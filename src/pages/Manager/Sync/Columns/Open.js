import { formatDatetime } from '../../../../utils/date';

export default ({ open_at }) => (!open_at ? '' : formatDatetime(open_at));
