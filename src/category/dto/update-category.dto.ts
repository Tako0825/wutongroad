import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto implements Partial<CreateCategoryDto> {
    title?: string
    description?: string
}
