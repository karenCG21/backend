import {
  IsNotEmpty,
  IsNumber,
} from "class-validator";

export class CreateProductDto {

  @IsNotEmpty()
  name!: string;

  // NUEVO
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  stock!: number;

  // NUEVO
  @IsNotEmpty()
  description!: string;
}