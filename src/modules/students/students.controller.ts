import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/enums';

@ApiTags('Students Management')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all students (Instructors/Admins only)' })
    async findAll() {
        return this.studentsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get student details' })
    async findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }

    @Get(':id/progress')
    @ApiOperation({ summary: 'Get student overall progress' })
    async getProgress(@Param('id') id: string) {
        return this.studentsService.getStudentProgress(id);
    }
}
