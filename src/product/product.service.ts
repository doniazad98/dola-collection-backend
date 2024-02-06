import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateProductParam {
    name: string;
    category: Category;
    price: number;
    colors: string[];
    sizes: string[];
    images: { url: string }[];
}
interface UpdateProductParam {
    name?: string;
    category?: Category;
    price?: number;
    colors?: string[];
    sizes?: string[];
}
@Injectable()
export class ProductService {
    constructor(private readonly prismaService: PrismaService) { }
    getAllProduct() {
        return this.prismaService.product.findMany({
            select: {
                id: true,
                name: true,
                category: true,
                price: true,
                images: true,
            }
        })
    }

    getProduct(id: number) {
        return this.prismaService.product.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                category: true,
                price: true,
                colors: true,
                sizes: true,
                images: true,
            },

        })
    }

    async createProduct({ name, category, colors, images, price, sizes }: CreateProductParam) {
        const product = await this.prismaService.product.create({
            data: {
                name,
                category,
                colors,
                sizes,
                price
            },
        });

        const productImages = images.map((image) => {
            return { ...image, product_id: product.id };
        });

        await this.prismaService.image.createMany({
            data: productImages,
        });

        return product;
    }

    async updateProduct(data: UpdateProductParam, id: number) {
        const product = await this.prismaService.product.findUnique({
            where: {
                id,
            },
        });

        if (!product) {
            throw new NotFoundException();
        }
        const updatedProduct = await this.prismaService.product.update({
            where: {
                id
            },
            data
        });
        return updatedProduct;
    }
    async updateImages() {
        // TODO add this function
    }

    async deleteProduct(id: number) {
        await this.prismaService.image.deleteMany({
            where: {
                product_id: id
            }
        })
        await this.prismaService.product.delete({
            where: {
                id
            }
        })
    }
}
