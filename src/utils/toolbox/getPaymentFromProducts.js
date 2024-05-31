const processOrder = (order, gProds, updateTotals) => {

    // 1 - get total order
    const price = +order.total_price

    // 2 - get sum
    let groupTotalInOrder = 0
    order.products
        .filter(p => gProds.some(gp => gp.id === p.id))
        .forEach(prod => {
            const x = prod.price_unit
            groupTotalInOrder += x
        })

    // 3 - apply in payments
    order.payments.forEach(payment => {
        const groupPercent = (groupTotalInOrder / price)
        const percentedPrice = (payment.price * groupPercent)
        const paymentData = { ...payment, price: percentedPrice }

        updateTotals(paymentData)
    })

}

export const getPaymentFromProducts = (list = [], gProds = []) => {

    let totals = {
        money: 0,
        credit: 0,
        debit: 0,
        pix: 0
    }

    const validList = list.filter(order => order.status === 'validado')

    validList.forEach(order => {
        processOrder(order, gProds, (payment) => {

            switch (payment.payment_type) {
                case 'dinheiro':
                    totals.money = totals.money + payment.price
                    break
                case 'credito':
                    totals.credit = totals.credit + payment.price
                    break
                case 'debito':
                    totals.debit = totals.debit + payment.price
                    break
                case 'pix':
                    totals.pix = totals.pix + payment.price
                    break
                default:
                    break
            }
        })
    })

    return totals
}