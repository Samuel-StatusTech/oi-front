import { formatDatetime } from '../../../../utils/date';

export default ({ last_at, last_type }) => {
  if (!last_at) {
    return '';
  }

  switch (last_type) {
    case 'inicio':
      return 'Aberto';
    case 'intervalo':
      return `Iniciou o intervalo: ${formatDatetime(last_at)}`;
    case 'retorno':
      return `Voltou a trabalhar: ${formatDatetime(last_at)}`;
    default:
      return `Fechado: ${formatDatetime(last_at)}`;
  }
};
