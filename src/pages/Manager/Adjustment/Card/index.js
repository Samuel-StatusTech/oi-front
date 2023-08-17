import React from 'react';
import { Card, CardContent, CardHeader, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import InputMoney from '../../../../components/Input/Money';

const useStyles = makeStyles((theme) => ({
  borderError: {
    border: (props) =>
      `1px solid ${props.error ? theme.palette.error.light : 'transparent'}`,
  },
}));

export default ({ title, value = 0, onChange, disabled, error }) => {
  const styles = useStyles({ error });

  return (
    <Card className={styles.borderError}>
      <CardHeader title={title} style={{ paddingBottom: 0 }} />
      <CardContent style={{ paddingTop: 0, paddingBottom: 12 }}>
        <Grid container alignItems="center">
          <Grid item>
            <InputMoney
              value={value}
              onChange={onChange}
              size="small"
              InputProps={{
                readOnly: disabled,
                // endAdornment: error ? (
                //     <InputAdornment position="end">
                //         <IconButton
                //             onClick={() => {console.log('Cliquei')}}
                //         >
                //             <PriorityHighIcon />
                //         </IconButton>
                //     </InputAdornment>
                // ) : null
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
