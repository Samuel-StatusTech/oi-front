import React from 'react';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';

import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';

const MainCard = ({ type, title, value }) => {

    const returnIcon = () => {
        switch (type) {
            default:
            case 1:
                return <MonetizationOnOutlinedIcon style={{fontSize: 50, color: "#4C7"}} />
            case 2:
                return <DescriptionOutlinedIcon style={{fontSize: 50, color: "#3A82F8"}} />
            case 3:
                return <HighlightOffOutlinedIcon style={{fontSize: 50, color: "#FE2265"}} />
        } 
    }

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item>
                        {returnIcon()}
                    </Grid>
                    <Grid item>
                        <Typography>{title}</Typography>
                        <Typography style={{ fontSize: 30, fontWeight: 'bold' }}>{value}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default MainCard;