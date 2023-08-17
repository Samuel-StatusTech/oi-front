import React from "react";
import { Typography } from "@material-ui/core";

export default ({ user_id, userName }) => {
    let text = '';
    
    if (!user_id) {
        return (
            <Typography>Não há operador</Typography>
        );        
    }

    return (
        <Typography>{userName}</Typography>
    )
}