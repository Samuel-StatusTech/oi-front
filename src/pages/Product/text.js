export const capFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const capitalizeWords = (string) => {
  let str = ""

  string.split(" ").forEach((word) => {
    str += `${capFirstLetter(word)} `
  })

  return str.trim()
}

export const isEmpty = (str) => str.trim().length === 0
