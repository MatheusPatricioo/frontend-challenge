import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { App } from 'antd';

import { hideInternalError } from '@domain/@shared/hide-internal-error';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { UnknownContextError } from '@domain/@shared/unknown-context-error';
import type { Record } from '@domain/record/record.type';

import { listInvolvements } from './api/list-involvements.service';
import type { Involvement } from './involvement.type';

type Value = {
    recordId: Record.Model['id'];
    involvements: Involvement.Model[];
    isAnonymous: boolean;
    isLoading: boolean;
    fetchInvolvements: () => Promise<void>;
};

type Props = {
    recordId: Record.Model['id'];
    children: (value: Value) => ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
export const InvolvementsContext = createContext<Value | null>(null);

export function InvolvementsContextProvider({ recordId, children }: Props) {
    const [isLoading, setIsLoading] = useState<Value['isLoading']>(true);
    const [involvements, setInvolvements] = useState<Value['involvements']>([]);
    const [isAnonymous, setIsAnonymous] = useState<Value['isAnonymous']>(true);

    const app = App.useApp();

    const fetchInvolvements = useCallback(async () => {
        setIsLoading(true);

        const response = await listInvolvements(recordId);

        setIsLoading(false);

        if (hasServiceError(response))
            return handleServiceError(app, response, hideInternalError);

        setInvolvements(response.data.involvements);
        setIsAnonymous(response.data.is_anonymous);
    }, [app, recordId]);

    useEffect(() => {
        fetchInvolvements();
    }, [fetchInvolvements]);

    const value: Value = {
        recordId,
        involvements,
        isAnonymous,
        isLoading,
        fetchInvolvements,
    };

    return (
        <InvolvementsContext.Provider value={value}>
            {children(value)}
        </InvolvementsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInvolvementsContext() {
    const context = useContext(InvolvementsContext);

    if (!context)
        throw new UnknownContextError();

    return context;
}