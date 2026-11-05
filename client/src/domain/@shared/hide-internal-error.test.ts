import { describe, expect, it } from 'vitest';

import { hideInternalError } from './hide-internal-error';
import type { Service } from './service.type';

describe('hideInternalError', () => {
    it('returns a friendly message for a server error', () => {
        const response: Service.ServerException = {
            statusCode: 500,
            error: { type: 'SERVER_ERROR', description: 'SQLSTATE[23000]: Integrity constraint violation' },
        };

        const message = hideInternalError(response);

        expect(message).toBe('Não foi possível concluir a operação por um erro no servidor.');
    });

    it('returns null for a client error status, keeping the API message', () => {
        const response: Service.ServerException = {
            statusCode: 422,
            error: { type: 'VALIDATION_ERROR', description: 'Invalid input' },
        };

        const message = hideInternalError(response);

        expect(message).toBeNull();
    });
});