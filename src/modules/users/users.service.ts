import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole, UserStatus } from '../../common/types/enums';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: { role?: UserRole; status?: string }) {
        return this.prisma.user.findMany({
            where: {
                ...(query.role && { role: query.role }),
                ...(query.status && { status: query.status as UserStatus }),
            },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        courses: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                enrollments: true,
                courses: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async getProfile(id: string) {
        return this.findOne(id);
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    async updateStatus(id: string, status: 'ACTIVE' | 'SUSPENDED') {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: { status: status as UserStatus },
        });
    }

    async getUserEnrollments(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                enrollments: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user.enrollments;
    }

    async getUserCourses(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                courses: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user.courses;
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
