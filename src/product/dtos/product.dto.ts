import { Category } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, } from "class-validator";

class Image {
    @IsString()
    @IsNotEmpty()
    url: string;
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(Category)
    @IsNotEmpty()
    category: Category;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsArray()
    @ArrayNotEmpty()
    colors: string[];

    @IsArray()
    @ArrayNotEmpty()
    sizes: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Image)
    images: Image[];
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(Category)
    @IsOptional()
    category?: Category;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsArray()
    @IsOptional()
    colors?: string[];

    @IsArray()
    @IsOptional()
    sizes?: string[];
}