import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateDescriptionDto extends PartialType(CreateCategoryDto) {

    description: string;
}
