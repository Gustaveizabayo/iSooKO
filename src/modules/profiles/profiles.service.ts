import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AdminActionDto, AdminAction } from './dto/admin-action.dto';
import { ProfileStatus } from '@prisma/client';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService) { }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        try {
            return await this.prisma.profile.upsert({
                where: { userId },
                create: {
                    userId,
                    ...dto,
                    status: 'PENDING' as any, // Cast to avoid enum import issues
                },
                update: {
                    ...dto,
                    status: 'PENDING' as any,
                },
                include: { user: { select: { id: true, name: true, email: true } } }
            });
        } catch (error: any) {
            console.error('Update Profile Error:', error);
            throw new Error(`Update Profile Failed: ${error.message}`);
        }
    }

    async getMyProfile(userId: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } } }
        });
        return profile;
    }

    async getPendingProfiles() {
        return this.prisma.profile.findMany({
            where: { status: ProfileStatus.PENDING },
            include: { user: { select: { id: true, name: true, email: true, role: true } } }
        });
    }

    async adminAction(userId: string, dto: AdminActionDto, adminId: string) {
        // Find profile by userId (assuming endpoint uses userId, or I can use profileId)
        // The prompt says "PATCH /admin/profiles/:id/approve". usually :id refers to the resource ID.
        // If resource is Profile, it has an ID. But usually manipulating User Profiles via User ID is easier.
        // I'll stick to Profile ID or User ID. Let's use User ID for "profiles/:userId/status" as easier URL schema?
        // Or if I list pending profiles, I get Profile IDs.
        // Let's support profileId.

        // Actually, prompt says "/admin/profiles/:id/approve". I'll assume :id is Profile ID.

        const profile = await this.prisma.profile.findUnique({
            where: { id: userId }, // Trying ID as Profile ID
        });

        let targetProfile = profile;
        if (!targetProfile) {
            // Try finding by userId
            targetProfile = await this.prisma.profile.findUnique({ where: { userId } });
        }

        if (!targetProfile) throw new NotFoundException('Profile not found');

        let status: ProfileStatus = ProfileStatus.PENDING;
        if (dto.action === AdminAction.APPROVE) status = ProfileStatus.ACTIVE;
        if (dto.action === AdminAction.REJECT) status = ProfileStatus.REJECTED;
        if (dto.action === AdminAction.SUSPEND) status = ProfileStatus.SUSPENDED;

        const updated = await this.prisma.profile.update({
            where: { id: targetProfile.id },
            data: {
                status,
                adminFeedback: dto.reason,
            },
        });

        await this.prisma.adminProfileLog.create({
            data: {
                profileId: targetProfile.id,
                adminId,
                action: dto.action,
                reason: dto.reason,
            },
        });

        return updated;
    }
}
