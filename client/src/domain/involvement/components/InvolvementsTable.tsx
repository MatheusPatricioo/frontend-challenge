import { type TableColumnsType, Tag } from 'antd';

import { formatCpf } from '@domain/@shared/format';
import { Table } from '@domain/@shared/Table';

import { INVOLVEMENT_TYPE_COLORS, INVOLVEMENT_TYPE_LABELS } from '../involvement-type.helper';
import type { Involvement } from '../involvement.type';
import { useInvolvementsContext } from '../Involvements.context';
import { RemoveInvolvementButton } from './RemoveInvolvementButton';

const COLUMNS: TableColumnsType<Involvement.Model> = [
    {
        title: 'Nome',
        dataIndex: ['person', 'name'],
    },
    {
        title: 'CPF',
        dataIndex: ['person', 'cpf'],
        render: formatCpf,
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