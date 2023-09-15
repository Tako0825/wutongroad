import { Length, Validate } from "class-validator"
import { TitleExistedRule } from "../rule/title-existed.rule"

const titleLength = {
    min: 2,
    max: 5
}

const descrptionLength = {
    min: 0,
    max: 20
}

export class CreateCategoryDto {
    @Length(
        titleLength.min, 
        titleLength.max ,
        { 
            message: `话题分类名限制长度为${titleLength.min}~${titleLength.max}` 
        }
    )
    @Validate(TitleExistedRule, { message: "已存在该话题分类名"})
    title: string
    @Length(
        descrptionLength.min, 
        descrptionLength.max,
        {
            message: `话题分类描述限制长度为${descrptionLength.min}~${descrptionLength.max}`
        }
    )
    description: string
}
