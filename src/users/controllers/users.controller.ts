import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Request, Response } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

const example = {
  username: '12312',
  email: '213213',
  password: '$2b$12$jB6Vatxl0Rxa4Wp1aYKTk.YqUKUbZDgGDy5reqaH86HebfWnaabRK',
  _id: '62e50a635783b39025777a7b',
  __v: 0,
};
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Creating a user' })
  @ApiResponse({
    status: 201,
    description: 'New user response',
    schema: { example },
  })
  @ApiBearerAuth('access-token')
  @UsePipes(ValidationPipe)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<CreateUserDto> {
    const { cookie, authorization } = request.headers;
    const { token, user } = await this.usersService.createUser(
      cookie,
      createUserDto,
      authorization,
    );
    response.cookie('token', token, { httpOnly: true });

    return user;
  }

  @Get()
  @ApiOperation({ summary: 'Getting all users' })
  @ApiResponse({
    status: 200,
    description: 'All users response',
    schema: { example },
  })
  @ApiBearerAuth('access-token')
  async findAll(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<object> {
    const { cookie, authorization } = request.headers;
    const { token, user } = await this.usersService.findUsers(
      cookie,
      authorization,
    );
    response.cookie('token', token, { httpOnly: true });

    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Getting specific user' })
  @ApiResponse({
    status: 200,
    description: 'Found user response',
    schema: { example },
  })
  @ApiBearerAuth('access-token')
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<object> {
    const { cookie, authorization } = request.headers;
    const { token, user } = await this.usersService.findUser(
      id,
      cookie,
      authorization,
    );
    response.cookie('token', token, { httpOnly: true });

    return user;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editing specific user' })
  @ApiResponse({
    status: 200,
    description: 'Updated user response',
    schema: { example },
  })
  @ApiBearerAuth('access-token')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() newData: UpdateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<object> {
    const { cookie, authorization } = request.headers;
    const { token, user } = await this.usersService.updateUser(
      id,
      newData,
      cookie,
      authorization,
    );
    response.cookie('token', token, { httpOnly: true });

    return user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleting specific user' })
  @ApiResponse({
    status: 200,
    description: 'Result response',
    schema: {
      example: {
        message: 'Success',
      },
    },
  })
  @ApiBearerAuth('access-token')
  async remove(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<object> {
    const { cookie, authorization } = request.headers;
    const token = await this.usersService.deleteUser(id, cookie, authorization);
    response.cookie('token', token, { httpOnly: true });

    return {
      message: 'Success',
    };
  }
}
