import { formatDatetime } from '../../../../utils/date';

export default ({ updated_at, open_at }) => {
  if (!updated_at) {
    if (!open_at) {
      return 'Não há atividade deste PDV neste evento';
    } else {
      return formatDatetime(open_at);
    }
  } else {
    return formatDatetime(updated_at);
  }
};
