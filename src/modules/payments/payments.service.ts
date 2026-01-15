import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { PaymentStatus } from '../../common/types/enums';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) { }

  async create(createPaymentDto: CreatePaymentDto) {
    const { enrollmentId, amount, paymentMethod } = createPaymentDto;

    // Check if enrollment exists
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true,
        payment: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Check if payment already exists
    if (enrollment.payment) {
      throw new ConflictException('Payment already exists for this enrollment');
    }

    // Verify amount matches course price
    if (amount !== enrollment.course.price) {
      throw new BadRequestException(
        `Payment amount (${amount}) does not match course price (${enrollment.course.price})`,
      );
    }

    // Create payment
    const payment = await this.prisma.payment.create({
      data: {
        enrollmentId,
        amount,
        paymentMethod,
        status: 'PENDING',
        userId: enrollment.userId,
      },
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        userId: enrollment.userId,
        action: 'PAYMENT_CREATED',
        resource: 'PAYMENT',
        details: {
          paymentId: payment.id,
          amount,
          enrollmentId,
          courseTitle: enrollment.course.title,
        },
      },
    });

    return payment;
  }

  async processPayment(processPaymentDto: ProcessPaymentDto) {
    const { paymentId, transactionId } = processPaymentDto;

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Payment is not in PENDING status');
    }

    // Simulate payment processing
    // In a real application, integrate with payment gateway (Stripe, PayPal, etc.)
    const isSuccessful = Math.random() > 0.1; // 90% success rate for simulation

    if (!isSuccessful) {
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'FAILED',
        },
      });

      throw new BadRequestException('Payment processing failed');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        transactionId,
        paidAt: new Date(),
      },
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        userId: payment.userId,
        action: 'PAYMENT_COMPLETED',
        resource: 'PAYMENT',
        details: {
          paymentId,
          amount: payment.amount,
          transactionId,
        },
      },
    });

    return updatedPayment;
  }

  async findAll(filters?: {
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status as PaymentStatus;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};

      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }

      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    return this.prisma.payment.findMany({
      where,
      include: {
        enrollment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        enrollment: {
          include: {
            course: {
              include: {
                instructor: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updateStatus(id: string, status: 'COMPLETED' | 'FAILED' | 'REFUNDED', transactionId?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const data: any = { status };

    if (status === 'COMPLETED' && !payment.paidAt) {
      data.paidAt = new Date();
    }

    if (transactionId) {
      data.transactionId = transactionId;
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data,
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        userId: payment.userId,
        action: `PAYMENT_${status}`,
        resource: 'PAYMENT',
        details: {
          paymentId: id,
          oldStatus: payment.status,
          newStatus: status,
          transactionId,
        },
      },
    });

    return updatedPayment;
  }

  async getUserPayments(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.payment.findMany({
      where: { userId },
      include: {
        enrollment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRevenueStats() {
    // Total revenue
    const totalRevenue = await this.prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    // Monthly revenue
    const monthlyRevenue = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount
      FROM payments
      WHERE status = 'COMPLETED'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
      LIMIT 12
    `;

    // Revenue by course category
    const revenueByCategory = await this.prisma.$queryRaw`
      SELECT 
        c.category,
        COUNT(p.id) as transaction_count,
        SUM(p.amount) as total_amount
      FROM payments p
      JOIN enrollments e ON p."enrollmentId" = e.id
      JOIN courses c ON e."courseId" = c.id
      WHERE p.status = 'COMPLETED'
      GROUP BY c.category
      ORDER BY total_amount DESC
    `;

    // Recent transactions
    const recentTransactions = await this.prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: { paidAt: 'desc' },
      take: 10,
    });

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue,
      revenueByCategory,
      recentTransactions,
    };
  }
}