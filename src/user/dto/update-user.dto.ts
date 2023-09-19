import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, Validate } from 'class-validator';
import { GenderRule } from '../rule/gender.rule';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty({ message: "用户名不能为空" })
    nickname: string
    @Validate(GenderRule, { message: '性别仅可为男或女' })
    gender: "男" | "女"
    @IsNotEmpty({message: "头像不允许为空"})
    avatar: string
}
