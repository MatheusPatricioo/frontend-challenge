import type { Service } from '@domain/@shared/service.type';

const HTTP_CONFLICT = 409;

export function isConflictError(response: Service.ExceptionResponse): response is Service.ServerException {
    return !(response instanceof Error) && response.statusCode === HTTP_CONFLICT;
}