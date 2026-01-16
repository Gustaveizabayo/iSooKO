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
        const { password, ...result } = user;
        return result;
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
        return this.prisma.enrollment.findMany({
            where: { userId: id },
            include: {
                course: {
                    include: {
                        _count: {
                            select: {
                                modules: true
                            }
                        }
                    }
                },
                payment: true,
            },
        });
    }

    async getUserCourses(id: string) {
        return this.prisma.course.findMany({
            where: { instructorId: id },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
        });
    }

    async getUserPayments(id: string) {
        return this.prisma.payment.findMany({
            where: { userId: id },
            include: {
                enrollment: {
                    include: {
                        course: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getUserProgress(id: string) {
        return this.prisma.lessonProgress.findMany({
            where: { userId: id },
            include: {
                lesson: {
                    include: {
                        module: {
                            include: {
                                course: true
                            }
                        }
                    }
                }
            }
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
