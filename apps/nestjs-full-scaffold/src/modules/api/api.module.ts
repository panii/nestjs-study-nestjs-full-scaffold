import { Module } from '@nestjs/common';
import { AppModule } from '../../kernel/app.module';
import { ApiController } from './controllers/api.controller';
import { ApiService } from './services/api.service';

@Module({
  // imports: [AppModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
