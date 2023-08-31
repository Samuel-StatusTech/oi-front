export const setSizeOptions = (pageSize) => {
  let newConfig = [5]

  if (pageSize >= 10) {
    newConfig.push(10)
    if (pageSize >= 20) {
      newConfig.push(20)
      if (pageSize >= 50) {
        newConfig.push(50)
        if (pageSize >= 170) newConfig.push(100)
      }
    }
  }


  if (newConfig.find(e => e == pageSize) === undefined)
    newConfig.push(pageSize)

  newConfig.sort((a, b) => {
    if (a < b)
      return -1;
    if (a > b)
      return 1;
    return 0;
  })


  return newConfig
}