import { Body, Controller, Get, Param, ParseEnumPipe, Post, UnauthorizedException } from '@nestjs/common';
import { GenerateProductKeyDto, SigninDto, SingupDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import { UserTypeEcom } from '@prisma/client';
import * as bcrypt from "bcryptjs"
import { User, UserInfo } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('signup/:userType')
    async signup(
        @Body() body: SingupDto,
        @Param('userType', new ParseEnumPipe(UserTypeEcom)) userType: UserTypeEcom
    ) {
        if (userType !== UserTypeEcom.BUYER) {
            if (!body.productKey) {
                throw new UnauthorizedException()
            }
            const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`
            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);
            if (!isValidProductKey) {
                throw new UnauthorizedException()
            }
        }
        return this.authService.signup(body, userType)
    }
    @Post('signin')
    signin(@Body() body: SigninDto) {
        return this.authService.signin(body)
    }

    @Post("/key")
    generateProductKey(
        @Body() { email, userType }: GenerateProductKeyDto
    ) {
        return this.authService.generateProductKey(email, userType)
    }

    @Get('/me')
    me(@User() user: UserInfo) {
        return user;
    }

}
