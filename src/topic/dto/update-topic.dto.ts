import { PartialType } from '@nestjs/mapped-types';
import { CreateTopicDto } from './create-topic.dto';
import { IsNotEmpty, Length, Validate } from 'class-validator';
import { CategoryExistedRule } from '../rule/category-existed.rule';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {
    @Length(1, 10, { message: "话题标题限制长度为1~10" })
    title: string;
    @IsNotEmpty({ message: "话题内容不能为空" })
    content: string;
    @Validate(CategoryExistedRule, { message: "不存在该话题分类" })
    category_id: string;
}
