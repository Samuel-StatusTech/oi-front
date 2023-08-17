class Utils {
  currencyFormatter(value) {
    if (!Number(value)) return '';

    const amount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);

    return `${amount}`;
  }
  getParentElementUntilFindElement(target, findElement) {
    let elementFind = false;
    let element = target;
    while (elementFind === false) {
      if (element.querySelector(findElement)) {
        elementFind = true;
      } else {
        element = element.parentElement;
      }
    }
    return element.querySelector(findElement);
  }
}
export default Utils;
