import { MINUTE, HOUR, DAY, formatTime } from '../../../../utils/date';

export default ({ updated_at, open_at }) => {
  if (!updated_at) {
    if (!open_at) {
      return 'Não há atividades';
    } else {
      const idleTime = Date.now() - new Date(open_at).getTime();

      if (idleTime < MINUTE) {
        return `${idleTime / 1000} segundos`;
      }

      if (idleTime < DAY) {
        return `${formatTime(idleTime)}`.slice(0, 5);
      }

      const year = parseInt(idleTime / DAY, 10);
      const hours = parseInt((idleTime - year) / HOUR, 10);

      return `${year} dia e ${hours} horas`;
    }
  }

  const idleTime = Date.now() - new Date(updated_at).getTime();

  if (idleTime < MINUTE) {
    return `${idleTime / 1000} segundos`;
  }

  if (idleTime < DAY) {
    return `${formatTime(idleTime)}`.slice(0, 5);
  }

  const year = parseInt(idleTime / DAY, 10);
  const hours = parseInt((idleTime - year) / HOUR, 10);

  return `${year} dia e ${hours} horas`;
};
