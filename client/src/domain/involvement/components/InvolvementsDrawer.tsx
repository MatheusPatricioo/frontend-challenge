import { Divider, Drawer } from 'antd';

import { Show } from '@domain/@shared/Show';
import { PeopleContextProvider } from '@domain/person/People.context';
import { useRecordsContext } from '@domain/record/Records.context';

import { InvolvementsContextProvider } from '../Involvements.context';
import { AddInvolvementForm } from './AddInvolvementForm';
import { AnonymityTag } from './AnonymityTag';
import { InvolvementsTable } from './InvolvementsTable';

export function InvolvementsDrawer() {
    const { record, setRecordId, setIsInvolvementsDrawerVisible } = useRecordsContext();

    if (!record)
        throw new Error('Value of the `record` property is unknown');

    const close = () => {
        setIsInvolvementsDrawerVisible(false);
        setRecordId(null);
    };

    return (
        <PeopleContextProvider>
            {() => (
                <InvolvementsContextProvider recordId={record.id}>
                    {({ isAnonymous, isLoading }) => (
                        <Drawer
                            open
                            title={`Envolvidos — ${record.title}`}
                            extra={(
                                <Show when={!isLoading}>
                                    <AnonymityTag isAnonymous={isAnonymous} />
                                </Show>
                            )}
                            width={640}
                            onClose={close}
                        >
                            <AddInvolvementForm />

                            <Divider />

                            <InvolvementsTable />
                        </Drawer>
                    )}
                </InvolvementsContextProvider>
            )}
        </PeopleContextProvider>
    );
}