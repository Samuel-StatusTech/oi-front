import React from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';

import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

export default ({ handleIncrement, handleDecrement, id, quantity, disabled }) => {

    return (
        <Grid container alignItems="center" spacing={2}>
            <Grid item>
                <IconButton onClick={() => handleDecrement(id)} disabled={quantity <= 0 || disabled}>
                    <RemoveIcon />
                </IconButton>
            </Grid>

            <Grid item>
                <Typography>{quantity}</Typography>
            </Grid>

            <Grid item>
                <IconButton onClick={() => handleIncrement(id)} disabled={disabled}>
                    <AddIcon />
                </IconButton>
            </Grid>      
        </Grid>
    )
}