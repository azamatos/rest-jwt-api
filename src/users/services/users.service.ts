import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async getToken(cookie: string, auth: string) {
    const index = cookie.indexOf('token=ey');
    cookie = index > 0 ? cookie.substr(index, cookie.length) : cookie;
    const jwt = auth ? auth : cookie;
    const delCount = auth ? 7 : 6;
    const bearer = jwt.substr(delCount, jwt.length - delCount);
    try {
      const { email } = await this.jwtService.verifyAsync(bearer);
      return await this.jwtService.signAsync({ email });
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }

  async createUser(cookie: string, newUser: CreateUserDto, auth: string) {
    try {
      const token: string = await this.getToken(cookie, auth);
      newUser.password = await bcrypt.hash(newUser.password, 12);
      const data = new this.userModel(newUser);
      const user = await data.save();
      return {
        user,
        token,
      };
    } catch {
      throw new BadRequestException('Invalid Data');
    }
  }

  async findUsers(cookie: string, auth: string) {
    try {
      const token: string = await this.getToken(cookie, auth);
      const user = await this.userModel.find().exec();
      return {
        user,
        token,
      };
    } catch {
      throw new BadRequestException('Invalid Data');
    }
  }

  async findUser(id: string, cookie: string, auth: string) {
    const token = await this.getToken(cookie, auth);
    try {
      const user = await this.userModel.findById(id);
      return {
        user,
        token,
      };
    } catch {
      throw new BadRequestException('Invalid Data');
    }
  }

  async updateUser(
    id: string,
    newData: UpdateUserDto,
    cookie: string,
    auth: string,
  ) {
    try {
      const token: string = await this.getToken(cookie, auth);
      const user = await this.userModel.findOneAndUpdate({ id }, newData, {
        new: true,
      });
      console.log(user);
      return {
        user,
        token,
      };
    } catch {
      throw new BadRequestException('Invalid Data');
    }
  }

  async deleteUser(id: string, cookie: string, auth: string) {
    try {
      const token: string = await this.getToken(cookie, auth);
      await this.userModel.deleteOne({ id });
      return token;
    } catch {
      throw new BadRequestException('Invalid Data');
    }
  }
}
