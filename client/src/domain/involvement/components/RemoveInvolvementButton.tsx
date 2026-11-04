import { useState } from 'react';

import { App, Button, Popconfirm } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { hideInternalError } from '@domain/@shared/hide-internal-error';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';

import { deleteInvolvement } from '../api/delete-involvement.service';
import type { Involvement } from '../involvement.type';
import { useInvolvementsContext } from '../Involvements.context';

type Props = { involvement: Involvement.Model };

export function RemoveInvolvementButton({ involvement }: Props) {
    const [isPopconfirmVisible, setIsPopconfirmVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const { recordId, fetchInvolvements } = useInvolvementsContext();

    const app = App.useApp();

    const handleRemove = async () => {
        setIsSending(true);

        const response = await deleteInvolvement(recordId, involvement.id);

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response, hideInternalError);

        setIsPopconfirmVisible(false);
        fetchInvolvements();
    };

    return (
        <Popconfirm
            title="Remover envolvido"
            description="Tem certeza que deseja remover esta pessoa do relato?"
            open={isPopconfirmVisible}
            placement="left"
            cancelText="Não"
            okText="Sim"
            okType="danger"
            okButtonProps={{ loading: isSending }}
            onConfirm={handleRemove}
            onCancel={() => setIsPopconfirmVisible(false)}
        >
            <Button
                type="text"
                icon={<DeleteOutlined />}
                title="Remover"
                onClick={() => setIsPopconfirmVisible(true)}
            />
        </Popconfirm>
    );
}