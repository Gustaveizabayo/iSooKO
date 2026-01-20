import { Controller, Get, Put, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AdminActionDto } from './dto/admin-action.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/enums';

@ApiTags('Profiles')
@Controller()
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Put('profiles/me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update my profile (sets status to PENDING)' })
    async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
        return this.profilesService.updateProfile(req.user.id, dto);
    }

    @Get('profiles/me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my profile status' })
    async getMyProfile(@Req() req: any) {
        return this.profilesService.getMyProfile(req.user.id);
    }

    @Get('admin/profiles/pending')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List pending profiles (Admin only)' })
    async getPendingProfiles() {
        return this.profilesService.getPendingProfiles();
    }

    @Patch('admin/profiles/:id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Approve, Reject, or Suspend profile (Admin only)' })
    async adminAction(
        @Param('id') id: string,
        @Body() dto: AdminActionDto,
        @Req() req: any,
    ) {
        return this.profilesService.adminAction(id, dto, req.user.id);
    }
}
