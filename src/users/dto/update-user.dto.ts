import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(3, 40)
  @ApiProperty({
    description: 'The username or nickname',
    example: 'iGwT',
    required: false,
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of user',
    example: '15457akdepe@gmail.com',
    required: false,
  })
  email: string;

  @ApiProperty({
    description: 'The password of the User',
    example: 'Mongo2022',
    required: false,
  })
  @Length(8, 30)
  @Matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])/, {
    message: 'Password is too weak',
  })
  password: string;
}
