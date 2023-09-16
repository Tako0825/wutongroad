import { Validate } from "class-validator"
import { IntegerRule } from "../rule/integer.rule"

export class PageDto {
    @Validate(IntegerRule, { message: "不能转换为有效整数" })
    currentPage: string
    @Validate(IntegerRule, { message: "不能转换为有效整数" })
    pageSize: string
}