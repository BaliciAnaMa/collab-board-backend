import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; // Importăm doar modulul de Auth

@Module({
  imports: [AuthModule], // Aici trebuie să fie doar AuthModule
  controllers: [],
  providers: [],
})
export class AppModule {}
