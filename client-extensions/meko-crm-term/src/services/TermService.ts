import type { Term } from '../models/Term.ts';

const mockTerms: Term[] = [];

export const getTerms = async (): Promise<Term[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...mockTerms]), 300);
    });
};

export const createTerm = async (termData: Partial<Term>): Promise<Term> => {
    return new Promise((resolve) => {
        const newTerm: Term = {
            id: Date.now().toString(),
            name: termData.name || '',
            code: termData.code || '',
            type: termData.type || 'Quarterly',
            startDate: termData.startDate || '',
            endDate: termData.endDate || '',
            progressText: 'Chưa bắt đầu',
            progressPercentage: 0,
            courseCount: 0,
            classCount: 0,
            classDesc: '',
            status: 'UPCOMING'
        };
        mockTerms.push(newTerm);
        setTimeout(() => resolve(newTerm), 300);
    });
};
