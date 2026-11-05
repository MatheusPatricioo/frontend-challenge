import { type TableColumnsType, Tag, Typography } from 'antd';

import { formatCpf } from '@domain/@shared/format';
import { Table } from '@domain/@shared/Table';

import type { Involvement } from '../involvement.type';
import { INVOLVEMENT_TYPE_COLORS, INVOLVEMENT_TYPE_LABELS } from '../involvement-type.helper';
import { useInvolvementsContext } from '../Involvements.context';
import { RemoveInvolvementButton } from './RemoveInvolvementButton';

const COLUMNS: TableColumnsType<Involvement.Model> = [
    {
        title: 'Nome',
        render: (_, { person }) => person
            ? person.name
            : <Typography.Text type="secondary">Pessoa excluída</Typography.Text>,
    },
    {
        title: 'CPF',
        render: (_, { person }) => person ? formatCpf(person.cpf) : '—',
    },
    {
        title: 'Envolvimento',
        dataIndex: 'type',
        render: (type: Involvement.Type) => (
            <Tag color={INVOLVEMENT_TYPE_COLORS[type]}>
                {INVOLVEMENT_TYPE_LABELS[type]}
            </Tag>
        ),
    },
    {
        render: (_, involvement) => <RemoveInvolvementButton involvement={involvement} />,
    },
];

export function InvolvementsTable() {
    const { involvements, isLoading } = useInvolvementsContext();

    return (
        <Table
            columns={COLUMNS}
            dataSource={involvements}
            loading={isLoading}
        />
    );
}