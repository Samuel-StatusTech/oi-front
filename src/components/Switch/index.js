const { withStyles, Switch } = require("@material-ui/core");

export const GreenSwitch = withStyles({
    switchBase: {
        '&$checked': {
            color: '#9ACD32',
        },
        '&$checked + $track': {
            backgroundColor: '#9ACD32',
        }
    },
    checked: {},
    track: {},
})(Switch);

export const StatusSwitch = withStyles({
    switchBase: {
        '&$checked': {
            color: '#9ACD32',
        },
        '&$checked + $track': {
            backgroundColor: '#9ACD32',
        },
        '&': {
            color: '#F51',
        },
        '& + $track': {
            backgroundColor: '#F51',
        },
    },
    checked: {},
    track: {},
})(Switch);