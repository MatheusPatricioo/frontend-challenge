import { useMemo, useState } from 'react';

import { App, Button, Form, Select } from 'antd';

import { formatCpf } from '@domain/@shared/format';
import { hideInternalError } from '@domain/@shared/hide-internal-error';
import { isConflictError } from '@domain/@shared/is-conflict-error';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';
import { usePeopleContext } from '@domain/person/People.context';

import { createInvolvement } from '../api/create-involvement.service';
import type { Involvement } from '../involvement.type';
import { INVOLVEMENT_TYPE_LABELS } from '../involvement-type.helper';
import { useInvolvementsContext } from '../Involvements.context';

type Values = {
    person_id: number;
    type: Involvement.Type;
};

const DUPLICATED_INVOLVEMENT_MESSAGE = 'Esta pessoa já está vinculada a este relato.';

const TYPE_OPTIONS = Object.entries(INVOLVEMENT_TYPE_LABELS)
    .map(([value, label]) => ({ value, label }));

export function AddInvolvementForm() {
    const [isSending, setIsSending] = useState(false);

    const { people, isLoading: isLoadingPeople } = usePeopleContext();
    const { recordId, involvements, fetchInvolvements } = useInvolvementsContext();

    const [form] = Form.useForm<Values>();

    const app = App.useApp();

    const personOptions = useMemo(() => {
        const linkedPersonIds = involvements.map(involvement => involvement.person_id);

        return people
            .filter(person => !linkedPersonIds.includes(person.id))
            .map(person => ({
                value: person.id,
                label: `${person.name} (${formatCpf(person.cpf)})`,
            }));
    }, [people, involvements]);

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const response = await createInvolvement(recordId, values);

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response) && isConflictError(response))
            return form.setFields([{ name: 'person_id', errors: [DUPLICATED_INVOLVEMENT_MESSAGE] }]);

        if (hasServiceError(response))
            return handleServiceError(app, response, hideInternalError);

        form.resetFields();
        fetchInvolvements();
    };

    return (
        <Form
            form={form}
            onFinish={onFinish}
            name="addInvolvement"
            layout="vertical"
            autoComplete="off"
        >
            <Form.Item<Values>
                name="person_id"
                label="Pessoa"
                rules={[{ required: true, message: 'Por favor, selecione uma pessoa.' }]}
            >
                <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="Busque pelo nome"
                    options={personOptions}
                    loading={isLoadingPeople}
                />
            </Form.Item>

            <Form.Item<Values>
                name="type"
                label="Tipo de envolvimento"
                rules={[{ required: true, message: 'Por favor, selecione o tipo de envolvimento.' }]}
            >
                <Select
                    placeholder="Selecione o tipo"
                    options={TYPE_OPTIONS}
                />
            </Form.Item>

            <Button
                type="primary"
                htmlType="submit"
                loading={isSending}
            >
                Vincular
            </Button>
        </Form>
    );
}