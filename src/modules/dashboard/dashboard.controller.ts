import { Controller, Get, UseGuards, Query, Param, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/enums';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  async getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('me/instructor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current instructor dashboard stats' })
  async getMyInstructorDashboard(@Request() req: any) {
    return this.dashboardService.getInstructorDashboard(req.user.userId);
  }

  @Get('instructor/:instructorId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get instructor dashboard stats (Admin or self)' })
  async getInstructorDashboard(
    @Param('instructorId') instructorId: string,
    @Request() req: any
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== instructorId) {
      throw new ForbiddenException('Access denied');
    }
    return this.dashboardService.getInstructorDashboard(instructorId);
  }

  @Get('me/student')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current student dashboard stats' })
  async getMyStudentDashboard(@Request() req: any) {
    return this.dashboardService.getStudentDashboard(req.user.userId);
  }

  @Get('student/:studentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get student dashboard stats (Admin or self)' })
  async getStudentDashboard(
    @Param('studentId') studentId: string,
    @Request() req: any
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== studentId) {
      throw new ForbiddenException('Access denied');
    }
    return this.dashboardService.getStudentDashboard(studentId);
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get platform analytics' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getAnalytics(startDate, endDate);
  }

  @Get('recent-activity')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recent activity logs' })
  async getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }
}