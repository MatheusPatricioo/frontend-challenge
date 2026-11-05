import type { ReactNode } from 'react';

import { Alert, Card, Col, Progress, Row, Statistic, theme, Typography } from 'antd';

import { AuditOutlined, BuildOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { CompaniesContextProvider } from '@domain/company/Companies.context';
import { PeopleContextProvider } from '@domain/person/People.context';
import { RECORD_STATUS_LABELS } from '@domain/record/record-status.helper';
import type { Record } from '@domain/record/record.type';
import { RecordsContextProvider } from '@domain/record/Records.context';

const RECORD_STATUSES = Object.keys(RECORD_STATUS_LABELS) as Record.Status[];

type StatCardProps = {
    title: string;
    value: number;
    icon: ReactNode;
    isLoading: boolean;
};

function StatCard({ title, value, icon, isLoading }: StatCardProps) {
    return (
        <Col xs={24} sm={12} xl={6}>
            <Card>
                <Statistic
                    title={title}
                    value={value}
                    prefix={icon}
                    loading={isLoading}
                />
            </Card>
        </Col>
    );
}

type RecordsByStatusCardProps = {
    records: Record.Model[];
    isLoading: boolean;
};

function RecordsByStatusCard({ records, isLoading }: RecordsByStatusCardProps) {
    const { token } = theme.useToken();

    const statusColors: Record<Record.Status, string> = {
        awaiting_investigation: token.colorWarning,
        investigation_in_progress: token.colorPrimary,
        resolved: token.colorSuccess,
        archived: token.colorTextQuaternary,
    };

    return (
        <Card title="Relatos por status" loading={isLoading} style={{ marginTop: 16 }}>
            <Row gutter={[16, 24]}>
                {RECORD_STATUSES.map(status => {
                    const count = records.filter(record => record.status === status).length;
                    const percent = records.length > 0 ? Math.round((count / records.length) * 100) : 0;

                    return (
                        <Col key={status} xs={12} xl={6} style={{ textAlign: 'center' }}>
                            <Progress
                                type="circle"
                                size={100}
                                percent={percent}
                                strokeColor={statusColors[status]}
                                format={() => (
                                    <span style={{ fontSize: token.fontSizeHeading3, color: token.colorTextHeading }}>
                                        {count}
                                    </span>
                                )}
                            />

                            <div style={{ marginTop: 8 }}>
                                <Typography.Text>{RECORD_STATUS_LABELS[status]}</Typography.Text>
                            </div>

                            <Typography.Text type="secondary">
                                {percent}% dos relatos
                            </Typography.Text>
                        </Col>
                    );
                })}
            </Row>
        </Card>
    );
}

export function Dashboard() {
    return (
        <>
            <Typography.Title level={3}>Bem-vindo(a) ao Contato Seguro Slim!</Typography.Title>

            <Alert
                type="warning"
                showIcon
                message="Aviso sobre os dados de exemplo"
                description="Os dados cadastrados neste ambiente são meramente ilustrativos e foram gerados para fins de desenvolvimento e teste. Empresas, relatos e demais informações são fictícios. Qualquer semelhança com pessoas, empresas ou situações reais é mera coincidência."
            />

            <CompaniesContextProvider>
                {({ companies, isLoading: isLoadingCompanies }) => (
                    <RecordsContextProvider>
                        {({ records, isLoading: isLoadingRecords }) => (
                            <PeopleContextProvider>
                                {({ people, isLoading: isLoadingPeople }) => (
                                    <>
                                        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                                            <StatCard
                                                title="Empresas"
                                                value={companies.length}
                                                icon={<BuildOutlined />}
                                                isLoading={isLoadingCompanies}
                                            />

                                            <StatCard
                                                title="Relatos"
                                                value={records.length}
                                                icon={<AuditOutlined />}
                                                isLoading={isLoadingRecords}
                                            />

                                            <StatCard
                                                title={RECORD_STATUS_LABELS.awaiting_investigation}
                                                value={records.filter(record => record.status === 'awaiting_investigation').length}
                                                icon={<ClockCircleOutlined />}
                                                isLoading={isLoadingRecords}
                                            />

                                            <StatCard
                                                title="Pessoas"
                                                value={people.length}
                                                icon={<TeamOutlined />}
                                                isLoading={isLoadingPeople}
                                            />
                                        </Row>

                                        <RecordsByStatusCard
                                            records={records}
                                            isLoading={isLoadingRecords}
                                        />
                                    </>
                                )}
                            </PeopleContextProvider>
                        )}
                    </RecordsContextProvider>
                )}
            </CompaniesContextProvider>
        </>
    );
}