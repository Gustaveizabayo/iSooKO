export const UserRole = {
    STUDENT: 'STUDENT',
    INSTRUCTOR: 'INSTRUCTOR',
    ADMIN: 'ADMIN',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export const EnrollmentStatus = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const;
export type EnrollmentStatus = typeof EnrollmentStatus[keyof typeof EnrollmentStatus];

export const PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const ApplicationStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;
export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export const CourseStatus = {
    DRAFT: 'DRAFT',
    SCHEDULED: 'SCHEDULED',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED',
} as const;
export type CourseStatus = typeof CourseStatus[keyof typeof CourseStatus];

export const LessonType = {
    VIDEO: 'VIDEO',
    ARTICLE: 'ARTICLE',
    QUIZ: 'QUIZ',
    ASSIGNMENT: 'ASSIGNMENT',
    RESOURCE: 'RESOURCE',
} as const;
export type LessonType = typeof LessonType[keyof typeof LessonType];

export const ReviewStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;
export type ReviewStatus = typeof ReviewStatus[keyof typeof ReviewStatus];
