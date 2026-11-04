import { useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { hideInternalError } from '@domain/@shared/hide-internal-error';
import { isConflictError } from '@domain/@shared/is-conflict-error';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';

import { createPerson } from '../api/create-person.service';
import { usePeopleContext } from '../People.context';
import { DUPLICATED_CPF_MESSAGE, toPersonBody } from '../person-form.helper';
import { PersonFields, type Values } from './PersonFields';

export function CreatePersonModal() {
    const [isSending, setIsSending] = useState(false);

    const { setIsCreateModalVisible, fetchPeople } = usePeopleContext();

    const [form] = Form.useForm<Values>();

    const app = App.useApp();

    const close = () => setIsCreateModalVisible(false);

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const response = await createPerson(toPersonBody(values));

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response) && isConflictError(response))
            return form.setFields([{ name: 'cpf', errors: [DUPLICATED_CPF_MESSAGE] }]);

        if (hasServiceError(response))
            return handleServiceError(app, response, hideInternalError);

        close();
        fetchPeople();
    };

    return (
        <Modal
            open
            title="Cadastrar pessoa"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Cadastrar"
            onCancel={close}
            cancelText="Cancelar"
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="createPerson"
                layout="vertical"
                autoComplete="off"
            >
                <PersonFields />
            </Form>
        </Modal>
    );
}