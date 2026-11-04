import { Fragment } from 'react';

import { DatePicker, Form, Input } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';

export type Values = {
    name: string;
    cpf: string;
    email: string;
    birth_date: Dayjs;
};

const CPF_LENGTH = 11;

const onlyDigits = (value: string) =>
    value.replace(/\D/g, '').slice(0, CPF_LENGTH);

const isFutureDate = (date: Dayjs) => date.isAfter(dayjs(), 'day');

export function PersonFields() {
    return (
        <Fragment>
            <Form.Item<Values>
                name="name"
                label="Nome completo"
                rules={[{ required: true, message: 'Por favor, digite o nome completo.' }]}
            >
                <Input placeholder="Nome completo da pessoa" />
            </Form.Item>

            <Form.Item<Values>
                name="cpf"
                label="CPF"
                normalize={onlyDigits}
                rules={[
                    { required: true, message: 'Por favor, digite um CPF.' },
                    { len: CPF_LENGTH, message: 'O CPF deve ter 11 dígitos.' },
                ]}
            >
                <Input placeholder="Somente números" />
            </Form.Item>

            <Form.Item<Values>
                name="email"
                label="E-mail"
                rules={[
                    { required: true, message: 'Por favor, digite um e-mail.' },
                    { type: 'email', message: 'Por favor, digite um e-mail válido.' },
                ]}
            >
                <Input placeholder="E-mail de contato" />
            </Form.Item>

            <Form.Item<Values>
                name="birth_date"
                label="Data de nascimento"
                rules={[{ required: true, message: 'Por favor, selecione a data de nascimento.' }]}
            >
                <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="DD/MM/AAAA"
                    disabledDate={isFutureDate}
                    style={{ width: '100%' }}
                />
            </Form.Item>
        </Fragment>
    );
}