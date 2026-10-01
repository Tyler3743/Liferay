export type TermStatus = 'ONGOING' | 'UPCOMING' | 'FINISHED';

export interface Term {
    id: string;
    name: string;
    code: string;
    type: string;
    startDate: string;
    endDate: string;
    progressText: string;
    progressPercentage: number;
    courseCount: number;
    classCount: number;
    classDesc: string;
    status: TermStatus;
}
