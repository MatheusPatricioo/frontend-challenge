import type { ReactNode } from 'react';

import { Alert, Card, Col, Row, Statistic, Typography } from 'antd';

import { AuditOutlined, BuildOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { CompaniesContextProvider } from '@domain/company/Companies.context';
import { PeopleContextProvider } from '@domain/person/People.context';
import { RecordsContextProvider } from '@domain/record/Records.context';

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
                                            title="Aguardando investigação"
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
                                )}
                            </PeopleContextProvider>
                        )}
                    </RecordsContextProvider>
                )}
            </CompaniesContextProvider>
        </>
    );
}