import { describe, expect, it } from 'vitest';

import { isConflictError } from './is-conflict-error';
import type { Service } from './service.type';

describe('isConflictError', () => {
    it('returns true for a 409 server exception', () => {
        const response: Service.ServerException = {
            statusCode: 409,
            error: { type: 'CONFLICT', description: 'CPF already exists' },
        };

        const result = isConflictError(response);

        expect(result).toBe(true);
    });

    it('returns false for a server exception with another status', () => {
        const response: Service.ServerException = {
            statusCode: 422,
            error: { type: 'VALIDATION_ERROR', description: 'Invalid input' },
        };

        const result = isConflictError(response);

        expect(result).toBe(false);
    });

    it('returns false for a client error', () => {
        const response = new Error('network failure');

        const result = isConflictError(response);

        expect(result).toBe(false);
    });
});