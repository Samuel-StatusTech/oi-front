export const returnString = (period) => (period < 10 ? '0' + period : period);

export const formatDate = (timestamp) => {
  const obj = new Date(timestamp);

  return `${returnString(obj.getUTCDate())}/${returnString(obj.getUTCMonth() + 1)}/${obj.getUTCFullYear()}`;
};

export const formatTime = (timestamp) => {
  const obj = new Date(timestamp);

  return `${returnString(obj.getHours())}:${returnString(obj.getMinutes())}`;
};

export const formatDatetime = (timestamp) => `${formatDate(timestamp)} ${formatTime(timestamp)}`;

export const formatDateToDB = (timestamp) => {
  const obj = new Date(timestamp);

  return `${returnString(obj.getFullYear())}-${returnString(obj.getMonth() + 1)}-${obj.getDate()}`;
};

export const formatDateTimeToDB = (timestamp) => {
  const obj = new Date(timestamp);

  return `${returnString(obj.getUTCFullYear())}-${returnString(obj.getUTCMonth() + 1)}-${obj.getUTCDate()}T${returnString(obj.getUTCHours())}:${returnString(obj.getUTCMinutes())}:${returnString(obj.getUTCSeconds())}.000Z`;
};

export const compareDateBetween = (firstDate, secondDate, dateCompare) => {
  const from = new Date(firstDate);
  const to = new Date(secondDate);
  const compare = new Date(dateCompare);
  return compare >= from && compare <= to;
};
export const getDateDifferenceInDays = (firstDate, secondDate) => {
  const utc1 = Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
  const utc2 = Date.UTC(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());

  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};
export const getMinDateToday = () => {
  return new Date().setFullYear(new Date().getFullYear() - 10);
};
export const getMaxDateToday = () => {
  return new Date().setFullYear(new Date().getFullYear() + 10);
};
export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
