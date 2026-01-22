import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Global()
@Module({
    imports: [ConfigModule],
    controllers: [SessionController],
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionModule { }
