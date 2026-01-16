import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, CreateModuleDto, CreateLessonDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/enums';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
   constructor(private readonly coursesService: CoursesService) { }

   @Post()
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
   @ApiBearerAuth()
   @ApiOperation({ summary: 'Create a new course' })
   async create(@Body() createCourseDto: CreateCourseDto) {
      return this.coursesService.create(createCourseDto);
   }

   @Get()
   @ApiOperation({ summary: 'Get all courses with filters' })
   @ApiQuery({ name: 'category', required: false })
   @ApiQuery({ name: 'level', required: false })
   @ApiQuery({ name: 'instructorId', required: false })
   async findAll(
      @Query('category') category?: string,
      @Query('level') level?: string,
      @Query('instructorId') instructorId?: string,
   ) {
      return this.coursesService.findAll({ category, level, instructorId });
   }

   @Get(':id')
   @ApiOperation({ summary: 'Get course by ID' })
   async findOne(@Param('id') id: string) {
      return this.coursesService.findOne(id);
   }

   @Patch(':id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
   @ApiBearerAuth()
   @ApiOperation({ summary: 'Update a course' })
   async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
      return this.coursesService.update(id, updateCourseDto);
   }

   @Delete(':id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
   @ApiBearerAuth()
   @ApiOperation({ summary: 'Delete course' })
   async remove(@Param('id') id: string) {
      return this.coursesService.remove(id);
   }

   @Post(':courseId/modules')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
   @ApiBearerAuth()
   @ApiOperation({ summary: 'Add module to course' })
   async addModule(
      @Param('courseId') courseId: string,
      @Body() createModuleDto: CreateModuleDto,
   ) {
      return this.coursesService.addModule(courseId, createModuleDto);
   }

   @Post(':courseId/modules/:moduleId/lessons')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
   @ApiBearerAuth()
   @ApiOperation({ summary: 'Add lesson to module' })
   async addLesson(
      @Param('courseId') courseId: string,
      @Param('moduleId') moduleId: string,
      @Body() createLessonDto: CreateLessonDto,
   ) {
      return this.coursesService.addLesson(courseId, moduleId, createLessonDto);
   }
}
