import type { Involvement } from './involvement.type';

export const INVOLVEMENT_TYPE_LABELS: Record<Involvement.Type, string> = {
    whistleblower: 'Relatante',
    witness: 'Testemunha',
    victim: 'Vítima',
    denounced: 'Denunciado',
};

export const INVOLVEMENT_TYPE_COLORS: Record<Involvement.Type, string> = {
    whistleblower: 'blue',
    witness: 'gold',
    victim: 'purple',
    denounced: 'red',
};