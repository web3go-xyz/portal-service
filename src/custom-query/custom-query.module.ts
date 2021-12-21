import { Module } from '@nestjs/common';

import { repositoryProviders } from 'src/common/orm/repository.providers';
import { DatabaseModule } from 'src/common/orm/database.module';
import { CustomQueryController } from './custom-query.controller';
import { CustomQueryService } from './custom-query.service';

@Module({
    imports: [DatabaseModule],
    controllers: [CustomQueryController],
    providers: [...repositoryProviders, CustomQueryService],
})
export class CustomQueryModule { }
