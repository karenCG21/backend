import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber } from "class-validator";
import { CreateSaleItemDto } from "./create-sale_item.dto";

export class CreateSaleDto {
  @IsNumber()
  userId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}
