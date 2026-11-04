import { useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { isConflictError } from '@domain/@shared/is-conflict-error';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';

import { updatePerson } from '../api/update-person.service';
import { usePeopleContext } from '../People.context';
import { DUPLICATED_CPF_MESSAGE, toPersonBody, toPersonValues } from '../person-form.helper';
import { PersonFields, type Values } from './PersonFields';

export function EditPersonModal() {
    const [isSending, setIsSending] = useState(false);

    const {
        person,
        setIsEditModalVisible,
        setPersonId,
        fetchPeople,
    } = usePeopleContext();

    if (!person)
        throw new Error('Value of the `person` property is unknown');

    const app = App.useApp();

    const [form] = Form.useForm<Values>();

    const close = () => {
        setIsEditModalVisible(false);
        setPersonId(null);
    };

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const response = await updatePerson(person.id, toPersonBody(values));

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response) && isConflictError(response))
            return form.setFields([{ name: 'cpf', errors: [DUPLICATED_CPF_MESSAGE] }]);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        close();
        fetchPeople();
    };

    return (
        <Modal
            open
            title="Editar pessoa"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Confirmar"
            onCancel={close}
            cancelText="Cancelar"
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="editPerson"
                layout="vertical"
                autoComplete="off"
                initialValues={toPersonValues(person)}
            >
                <PersonFields />
            </Form>
        </Modal>
    );
}