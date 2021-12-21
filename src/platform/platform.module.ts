import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/orm/database.module';
import { repositoryProviders } from 'src/common/orm/repository.providers';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';


@Module({
  imports: [DatabaseModule,
  ],
  controllers: [PlatformController],
  providers: [...repositoryProviders, PlatformService],
})
export class PlatformModule { }
