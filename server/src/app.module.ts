import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey123', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}