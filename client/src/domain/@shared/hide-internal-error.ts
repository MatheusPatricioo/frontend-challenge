import type { MakeMessage } from '@domain/@shared/service.helper';

const HTTP_INTERNAL_SERVER_ERROR = 500;

export const hideInternalError: MakeMessage = response =>
    response.statusCode >= HTTP_INTERNAL_SERVER_ERROR
        ? 'Não foi possível concluir a operação por um erro no servidor.'
        : null;