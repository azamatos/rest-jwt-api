import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetTokenDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of user',
    example: '15457akdepe@gmail.com',
  })
  email: string;
}
