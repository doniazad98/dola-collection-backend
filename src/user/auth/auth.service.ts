import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs"
import { UserTypeEcom } from '@prisma/client';
import * as jwt from "jsonwebtoken"

interface SignUpParams {
    name: string
    phone: string
    adress: string
    email: string
    password: string
}
interface SignInParams {
    email: string
    password: string
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) { }
    async signup({ name, phone, adress, email, password }: SignUpParams, userType: UserTypeEcom) {
        // verify if the user exist before 
        const userExist = await this.prismaService.userEcom.findUnique({
            where: {
                email,
            }
        })
        if (userExist) throw new ConflictException()
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.prismaService.userEcom.create({
            data: {
                adress,
                email,
                name,
                phone,
                password: hashedPassword,
                user_type: userType
            }
        })
        return this.generateJWT(name, user.id);
    }
    async signin({ email, password }: SignInParams) {
        const user = await this.prismaService.userEcom.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new HttpException('Invalid credentials', 400);
        }

        const hashedPassword = user.password;

        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword) {
            throw new HttpException('Invalid credentials', 400);
        }

        return this.generateJWT(user.name, user.id);
    }
    private generateJWT(name: string, id: number) {
        return jwt.sign(
            {
                name,
                id,
            },
            process.env.JSON_TOKEN_KEY,
            {
                expiresIn: 3600000,
            },
        );
    }
    generateProductKey(email: string, userType: UserTypeEcom) {
        const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

        return bcrypt.hash(string, 10);
    }// we use this function to generate a key from admin and then the user use it to be able to sign as realtor
}
