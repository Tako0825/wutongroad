import { Length, Validate } from "class-validator"
import { TitleExistedRule } from "../rule/title-existed.rule"
import { Category } from "@prisma/client"

export class CreateCategoryDto implements Partial<Category> {
    @Length(2, 5, { message: `话题分类名限制长度为2~5` })
    @Validate(TitleExistedRule, { message: "已存在该话题分类名"})
    title: string
    @Length(0, 20,{message: `话题分类描述限制长度为0~20`})
    description: string
}
