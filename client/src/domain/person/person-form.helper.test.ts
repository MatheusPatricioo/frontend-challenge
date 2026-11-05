import dayjs from 'dayjs';
import { beforeEach, describe, expect, it } from 'vitest';

import type { Values } from './components/PersonFields';
import { toPersonBody, toPersonValues } from './person-form.helper';
import type { Person } from './person.type';

describe('toPersonBody', () => {
    it('converts the birth date to the API format and keeps the other fields', () => {
        const values: Values = {
            name: 'Ana Silva',
            cpf: '12345678901',
            email: 'ana.silva@example.com',
            birth_date: dayjs('1990-03-15'),
        };

        const body = toPersonBody(values);

        expect(body).toEqual({
            name: 'Ana Silva',
            cpf: '12345678901',
            email: 'ana.silva@example.com',
            birth_date: '1990-03-15',
        });
    });
});

describe('toPersonValues', () => {
    let person: Person.Model;

    beforeEach(() => {
        person = {
            id: 1,
            name: 'Ana Silva',
            cpf: '12345678901',
            email: 'ana.silva@example.com',
            birth_date: '1990-03-15',
            created_at: '2026-06-10T20:40:42.000000Z',
            updated_at: null,
            deleted_at: null,
        };
    });

    it('copies the person fields to the form values', () => {
        const values = toPersonValues(person);

        expect(values).toMatchObject({
            name: 'Ana Silva',
            cpf: '12345678901',
            email: 'ana.silva@example.com',
        });
    });

    it('converts the birth date to a Dayjs object', () => {
        const values = toPersonValues(person);

        expect(values.birth_date.format('YYYY-MM-DD')).toBe('1990-03-15');
    });

    it('leaves the control fields out of the form values', () => {
        const values = toPersonValues(person);

        expect(values).not.toHaveProperty('id');
        expect(values).not.toHaveProperty('created_at');
    });
});