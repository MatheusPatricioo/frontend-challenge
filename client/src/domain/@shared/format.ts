import dayjs from 'dayjs';

export const formatCpf = (cpf: string) =>
    cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

export const formatDate = (date: string) =>
    dayjs(date).format('DD/MM/YYYY');