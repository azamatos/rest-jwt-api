import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'igwt',
      signOptions: {
        expiresIn: '15min',
      },
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [UsersService],
})
export class UsersModule {}
