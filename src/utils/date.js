export const parseUrlDate = (d) => {
  const dt = new Date(d)
  return dt.getFullYear() + "-" +
    String(dt.getMonth() + 1).padStart(2, "0") + "-" +
    String(dt.getDate()).padStart(2, "0")
}

export const parseDate = (date) => {
  const formDate = new Date(new Date(date).getTime() - 10800000)
  let day = formDate.getDate()
  let month = formDate.getMonth() + 1
  let hours = formDate.getHours()
  let minutes = formDate.getMinutes()

  if (day < 10) day = `0${day}`
  if (month < 10) month = `0${month}`
  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`

  return `${day}/${month}/${formDate.getFullYear()} - ${hours}h${minutes}`
}

export const parseDateDash = (date) => {
  const formDate = new Date(new Date(date).getTime() - 10800000)
  let day = formDate.getDate()
  let month = formDate.getMonth() + 1
  let hours = formDate.getHours()
  let minutes = formDate.getMinutes()

  if (day < 10) day = `0${day}`
  if (month < 10) month = `0${month}`
  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`

  return `${day}-${month}-${formDate.getFullYear()}`
}

export const returnString = (period) => (period < 10 ? "0" + period : period)

export const formatDate = (timestamp, woMonth = false, woYear = false) => {
  const obj = new Date(timestamp)

  return `${returnString(obj.getUTCDate())
    }${woMonth ? "" : `/${returnString(
      obj.getUTCMonth() + 1
    )}`}${woYear ? "" : `/${obj.getUTCFullYear()}`}`
}

export const formatTime = (timestamp) => {
  const obj = new Date(timestamp)

  return `${returnString(obj.getHours())}:${returnString(obj.getMinutes())}`
}

export const formatDatetime = (timestamp) =>
  `${formatDate(timestamp)} ${formatTime(timestamp)}`

export const formatDateToDB = (timestamp) => {
  const obj = new Date(timestamp)

  return `${returnString(obj.getFullYear())}-${returnString(
    obj.getMonth() + 1
  )}-${obj.getDate()}`
}

export const formatDateTimeToDB = (timestamp) => {
  const obj = new Date(timestamp)

  return `${returnString(obj.getUTCFullYear())}-${returnString(
    obj.getUTCMonth() + 1
  )}-${obj.getUTCDate()}T${returnString(obj.getUTCHours())}:${returnString(
    obj.getUTCMinutes()
  )}:${returnString(obj.getUTCSeconds())}.000Z`
}

export const compareDateBetween = (firstDate, secondDate, dateCompare) => {
  const from = new Date(firstDate)
  const to = new Date(secondDate)
  const compare = new Date(dateCompare)
  return compare >= from && compare <= to
}
export const getDateDifferenceInDays = (firstDate, secondDate) => {
  const utc1 = Date.UTC(
    firstDate.getFullYear(),
    firstDate.getMonth(),
    firstDate.getDate()
  )
  const utc2 = Date.UTC(
    secondDate.getFullYear(),
    secondDate.getMonth(),
    secondDate.getDate()
  )

  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24))
}
export const getMinDateToday = () => {
  return new Date().setFullYear(new Date().getFullYear() - 10)
}
export const getMaxDateToday = () => {
  return new Date().setFullYear(new Date().getFullYear() + 10)
}
export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
