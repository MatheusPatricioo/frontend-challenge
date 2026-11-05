import { describe, expect, it } from 'vitest';

import { formatCpf, formatDate } from './format';

describe('formatCpf', () => {
    it('formats an 11-digit CPF with dots and dash', () => {
        const cpf = '12345678901';

        const formatted = formatCpf(cpf);

        expect(formatted).toBe('123.456.789-01');
    });

    it('returns the value unchanged when it does not have 11 digits', () => {
        const cpf = '12345';

        const formatted = formatCpf(cpf);

        expect(formatted).toBe('12345');
    });
});

describe('formatDate', () => {
    it('formats an API date as DD/MM/YYYY', () => {
        const date = '1990-03-15';

        const formatted = formatDate(date);

        expect(formatted).toBe('15/03/1990');
    });

    it('returns "Invalid Date" when the value is not a date', () => {
        const date = 'not-a-date';

        const formatted = formatDate(date);

        expect(formatted).toBe('Invalid Date');
    });
});