import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetTokenDto } from '../dto/get-token.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}
  @Post('/')
  @ApiOperation({ summary: 'Creating a user' })
  @ApiResponse({
    status: 200,
    description: 'New user response',
    schema: {
      example: {
        message: 'Success',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNmZ3NkZ2ZzZ2RmZyIsImlhdCI6MTY1OTE3NzU3MSwiZXhwIjoxNjU5MTc4NDcxfQ.WS3R7VnPT4Wo0G522MDDUxRGUyZ5QBSEYQzHQVo0ag8',
      },
    },
  })
  @UsePipes(ValidationPipe)
  async getToken(
    @Body() email: GetTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.jwtService.signAsync({ email });
    response.cookie('token', token, { httpOnly: true });
    return {
      message: 'Success',
      token,
    };
  }
}
