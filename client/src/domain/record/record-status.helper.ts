import type { Record } from './record.type';

export const RECORD_STATUS_LABELS: Record<Record.Status, string> = {
    awaiting_investigation: 'Aguardando investigação',
    investigation_in_progress: 'Investigação em andamento',
    resolved: 'Resolvido',
    archived: 'Arquivado',
};
