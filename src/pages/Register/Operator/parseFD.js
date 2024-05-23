export const parseFD = (user, operator, passRequirement) => {

    const { operator: op, list } = operator

    const formData = new FormData()
    formData.append("username", op.username)
    formData.append("name", op.name)
    formData.append("password", op.password)
    formData.append("status", op.status)
    formData.append("photo", op.photo)
    formData.append("user_id", op.user_id)
    formData.append("device_code", op.device_code)
    formData.append("injection", op.injection)
    formData.append("prefix", op.prefix)
    if (op.has_bar) formData.append("has_bar", op.has_bar)
    if (op.has_ticket) formData.append("has_ticket", op.has_ticket)
    if (op.has_park) formData.append("has_park", op.has_park)
    if (op.pay_money) formData.append("pay_money", op.pay_money)
    if (op.pay_debit) formData.append("pay_debit", op.pay_debit)
    if (op.pay_credit) formData.append("pay_credit", op.pay_credit)
    if (op.pay_cashless) formData.append("pay_cashless", op.pay_cashless)
    if (op.pay_multi) formData.append("pay_multi", op.pay_multi)
    if (op.allow_cashback) formData.append("allow_cashback", op.allow_cashback)
    if (op.allow_courtesy) formData.append("allow_courtesy", op.allow_courtesy)
    if (op.allow_duplicate) formData.append("allow_duplicate", op.allow_duplicate)
    if (op.is_waiter) formData.append("is_waiter", op.is_waiter)
    if (op.has_cashless) formData.append("has_cashless", op.has_cashless)
    if (op.print_receipt) formData.append("print_receipt", op.print_receipt)
    if (op.allow_refound) formData.append("allow_refound", op.allow_refound)
    if (op.allow_cashback_cashless) formData.append("allow_cashback_cashless", op.allow_cashback_cashless)
    if (op.via_production) formData.append("via_production", op.via_production)
    if (passRequirement) formData.append("isNeedPassword", +passRequirement)
    formData.append("has_product_list", op.has_product_list)
    formData.append("print_mode", op.print_mode)
    formData.append("isCode", op.isCode)
    formData.append("code", op.code)
    formData.append("last_sync", op.last_sync)
    formData.append("archived", op.archived)
    formData.append("pay_pix", op.pay_pix)
    formData.append("has_service_tax", (op.service_tax && !Number.isNaN(op.service_tax)) ? op.has_service_tax : 0)
    formData.append("service_tax", (op.service_tax && !Number.isNaN(op.service_tax)) ? op.service_tax : 0)

    formData.append("role", "operador")
    formData.append("org_id", user.org_id)

    formData.append("products", JSON.stringify(list.map((p) => p.id)))

    return formData
}

export const parseFDDevice = (user, operator, device) => {

    const { operator: op, list } = operator

    const formData = new FormData()
    formData.append("username", op.username)
    formData.append("name", op.name)
    formData.append("password", op.password)
    formData.append("status", op.status)
    formData.append("photo", op.photo)
    formData.append("user_id", op.user_id)
    formData.append("device_code", device.code)
    formData.append("injection", op.injection)
    formData.append("prefix", op.prefix)
    if (op.has_bar) formData.append("has_bar", op.has_bar)
    if (op.has_ticket) formData.append("has_ticket", op.has_ticket)
    if (op.has_park) formData.append("has_park", op.has_park)
    if (op.pay_money) formData.append("pay_money", op.pay_money)
    if (op.pay_debit) formData.append("pay_debit", op.pay_debit)
    if (op.pay_credit) formData.append("pay_credit", op.pay_credit)
    if (op.pay_cashless) formData.append("pay_cashless", op.pay_cashless)
    if (op.pay_multi) formData.append("pay_multi", op.pay_multi)
    if (op.allow_cashback) formData.append("allow_cashback", op.allow_cashback)
    if (op.allow_courtesy) formData.append("allow_courtesy", op.allow_courtesy)
    if (op.allow_duplicate) formData.append("allow_duplicate", op.allow_duplicate)
    if (op.is_waiter) formData.append("is_waiter", op.is_waiter)
    if (op.has_cashless) formData.append("has_cashless", op.has_cashless)
    if (op.print_receipt) formData.append("print_receipt", op.print_receipt)
    if (op.allow_refound) formData.append("allow_refound", op.allow_refound)
    if (op.allow_cashback_cashless) formData.append("allow_cashback_cashless", op.allow_cashback_cashless)
    if (op.via_production) formData.append("via_production", op.via_production)
    if (op.isNeedPassword) formData.append("isNeedPassword", +op.isNeedPassword)
    formData.append("has_product_list", op.has_product_list)
    formData.append("print_mode", op.print_mode)
    formData.append("isCode", op.isCode)
    formData.append("code", op.code)
    formData.append("last_sync", op.last_sync)
    formData.append("archived", op.archived)
    formData.append("pay_pix", op.pay_pix)
    formData.append("has_service_tax", (op.service_tax && !Number.isNaN(op.service_tax)) ? op.has_service_tax : 0)
    formData.append("service_tax", (op.service_tax && !Number.isNaN(op.service_tax)) ? op.service_tax : 0)

    formData.append("role", "operador")
    formData.append("org_id", user.org_id)

    formData.append("products", JSON.stringify(list.map((p) => p.id)))

    return formData
}
