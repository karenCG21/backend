import { PartialType } from '@nestjs/mapped-types';
import { CreateLossDto } from './create-loss.dto';

export class UpdateLossDto extends PartialType(CreateLossDto) {}
