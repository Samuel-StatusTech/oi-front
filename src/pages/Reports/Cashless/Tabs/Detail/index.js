import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";

import Panel from "./Panels";

import Api from '../../../../../api'

export default ({ event }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (event) {
            Api.get(`/statistical/cashlessDetail/${event}`).then(({data}) => {
                setUsers(data)
            })
        }
    }, [event])

    return (
        <Grid container spacing={2}>
            {users.lenght > 0 &&
                users.map(user => (
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Panel title={user.name} init />
                    </Grid>
                ))
            }
        </Grid>
    )
}