import React from "react";
import { Typography } from "@material-ui/core";

export default ({ payments = [] }) => {
    let text = '';

    if (payments.length > 1) {
        text = 'Multiplus';
    } else if (payments.length === 1) {
        switch(payments[0].payment_type) {
            case 'dinheiro':
                text = 'Dinheiro';
                break;
            case 'debito':
                text = 'Debito';
                break;
            case 'credito':
                text = 'Credito';
                break;
            case 'pix':
                text = 'Pix';
                break;
            default:
                text = 'Cashless';
                break;
        }
    }

    return (
        <Typography>{text}</Typography>
    )
}