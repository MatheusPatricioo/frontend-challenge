import { Fragment, useMemo, useState } from 'react';

import { Input, type TableColumnsType } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { formatCpf, formatDate } from '@domain/@shared/format';
import { Table } from '@domain/@shared/Table';

import { usePeopleContext } from '../People.context';
import type { Person } from '../person.type';
import { PeopleActionsCell } from './PeopleActionsCell';

const COLUMNS: TableColumnsType<Person.Model> = [
    {
        title: 'ID',
        dataIndex: 'id',
        render: value => `#${value}`,
    },
    {
        title: 'Nome',
        dataIndex: 'name',
    },
    {
        title: 'CPF',
        dataIndex: 'cpf',
        render: formatCpf,
    },
    {
        title: 'E-mail',
        dataIndex: 'email',
    },
    {
        title: 'Data de nascimento',
        dataIndex: 'birth_date',
        render: formatDate,
    },
    {
        render: (_, record) => <PeopleActionsCell person={record} />,
    },
];

const normalize = (value: string) =>
    value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const matchesSearch = (person: Person.Model, search: string) => {
    const term = normalize(search.trim());
    const digits = search.replace(/\D/g, '');

    const matchesName = normalize(person.name).includes(term);
    const matchesCpf = digits !== '' && person.cpf.includes(digits);

    return matchesName || matchesCpf;
};

export function PeopleTable() {
    const [search, setSearch] = useState('');

    const { people, isLoading } = usePeopleContext();

    const filteredPeople = useMemo(
        () => people.filter(person => matchesSearch(person, search)),
        [people, search],
    );

    return (
        <Fragment>
            <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Buscar por nome ou CPF"
                value={search}
                onChange={event => setSearch(event.target.value)}
                style={{ maxWidth: 360, marginBottom: 16 }}
            />

            <Table
                columns={COLUMNS}
                dataSource={filteredPeople}
                loading={isLoading}
            />
        </Fragment>
    );
}