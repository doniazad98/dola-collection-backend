import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserTypeEcom } from '@prisma/client';


@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @Get()
    //Add query params later
    getAllProduct() {
        return this.productService.getAllProduct()
    }

    @Get('/:id')
    getProduct(@Param('id') id: number) {
        return this.productService.getProduct(id)
    }
    @Roles(UserTypeEcom.ADMIN, UserTypeEcom.MANAGER)
    @Post()
    createProduct(
        @Body() body: CreateProductDto,
    ) {
        return this.productService.createProduct(body)
    }
    @Roles(UserTypeEcom.ADMIN, UserTypeEcom.MANAGER)
    @Put('/:id')
    updateProduct(
        @Body() body: UpdateProductDto,
        @Param('id') id: number,
    ) {
        return this.productService.updateProduct(body, id)
    }
    @Roles(UserTypeEcom.ADMIN, UserTypeEcom.MANAGER)
    @Delete('/:id')
    deleteProduct(
        @Param('id') id: number,
    ) {
        return this.productService.deleteProduct(id)
    }
}
