import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export const mockPrisma = mockDeep<PrismaClient>();
export type MockContext = DeepMockProxy<PrismaClient>;
