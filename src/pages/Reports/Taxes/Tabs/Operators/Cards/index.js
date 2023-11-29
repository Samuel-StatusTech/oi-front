import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

export default ({ title, content }) => {
    return (
        <Card style={{height: '100%'}}>
            <CardContent>
                <Typography>{title}</Typography>
                <Typography style={{fontSize: 20, fontWeight: 'bold'}}>{content}</Typography>
            </CardContent>
        </Card>
    )
}