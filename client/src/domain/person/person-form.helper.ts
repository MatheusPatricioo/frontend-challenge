import dayjs from 'dayjs';

import type { Values } from './components/PersonFields';
import type { Person } from './person.type';

const API_DATE_FORMAT = 'YYYY-MM-DD';

export const DUPLICATED_CPF_MESSAGE = 'Já existe uma pessoa cadastrada com este CPF.';

export const toPersonBody = (values: Values) => ({
    ...values,
    birth_date: values.birth_date.format(API_DATE_FORMAT),
});

export const toPersonValues = (person: Person.Model): Values => ({
    name: person.name,
    cpf: person.cpf,
    email: person.email,
    birth_date: dayjs(person.birth_date),
});