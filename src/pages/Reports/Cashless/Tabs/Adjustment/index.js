import React, { memo, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import EaseGrid from "../../../../../components/EaseGrid";
import Api from "../../../../../api";

export default memo(({ event }) => {
    const columns = [
        {title: 'PDV', field: 'pdv_name'},
        {title: 'Horário', field: 'updated_at'},
        {title: 'Valor', field: 'value'},
        {title: 'Gerente', field: 'manager_name'}
    ]

    const [adjust, setAdjust] = useState([]);

    useEffect(() => {
        if (event) {
            Api.get(`/statistical/cashlessAdjust/${event}`).then(({data}) => {
                setAdjust(data)
            })
        }
    }, [event])

    return (
        <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <EaseGrid
                    data={adjust}
                    columns={columns}
                />
            </Grid>
        </Grid>
    )
});