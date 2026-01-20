import { Injectable } from '@nestjs/common';
import { CourseStatus } from '../../common/types/enums';

@Injectable()
export class CourseStatusValidator {
    private readonly validTransitions: Record<CourseStatus, CourseStatus[]> = {
        [CourseStatus.DRAFT]: [CourseStatus.SCHEDULED, CourseStatus.PUBLISHED],
        [CourseStatus.SCHEDULED]: [CourseStatus.PUBLISHED, CourseStatus.DRAFT],
        [CourseStatus.PUBLISHED]: [CourseStatus.ARCHIVED],
        [CourseStatus.ARCHIVED]: [], // Cannot transition from ARCHIVED
    };

    canTransition(from: CourseStatus, to: CourseStatus): boolean {
        return this.validTransitions[from]?.includes(to) ?? false;
    }

    validateTransition(from: CourseStatus, to: CourseStatus): void {
        if (!this.canTransition(from, to)) {
            throw new Error(
                `Invalid status transition from ${from} to ${to}. ` +
                `Allowed transitions: ${this.validTransitions[from]?.join(', ') || 'none'}`
            );
        }
    }
}
