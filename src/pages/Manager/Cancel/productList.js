import React from "react";
import { Grid, Typography } from "@material-ui/core";
import EaseGrid from "../../../components/EaseGrid";
import { formatDatetime } from "../../../utils/date";
import { format } from "currency-formatter";

export default ({ history }) => {
    const { products, updated_at } = history.location.state;
    console.log(products, updated_at)

    const columns = [
        { title: 'Produto', field: "name" },
        { title: 'Grupo', field: "group_name" },
        // { title: 'Código de barra', field: "group_id" },
        { title: 'Valor', field: "price_total", render: ({ price_total }) => format(price_total/100, { code: 'BRL' }) },
        { title: 'Quantidade', field: "quantity" },
        // { title: 'Validação', field: "group_id" },
        // { title: 'Grupo', field: "group_id" },
        { title: 'Cancelamento', field: "update_at", render: () => (
            <Typography>{formatDatetime(updated_at)}</Typography>
        ) },
    ]

    return (
        <Grid container>
            <Grid item lg md sm xs>
                <EaseGrid 
                    data={products}
                    columns={columns}
                />
            </Grid>
        </Grid>
    )
}