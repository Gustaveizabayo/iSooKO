import { Module } from '@nestjs/common';
import { ProctoringService } from './proctoring.service';
import { ProctoringController } from './proctoring.controller';
import { SessionModule } from '../session/session.module';

@Module({
    imports: [SessionModule],
    controllers: [ProctoringController],
    providers: [ProctoringService],
    exports: [ProctoringService],
})
export class ProctoringModule { }
