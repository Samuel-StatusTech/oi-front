import React from 'react';
import { Grid, Tab, Tabs, withStyles } from '@material-ui/core';
import useStyles from '../../../../global/styles';
const AntTabs = withStyles({
  root: {
    marginBottom: '10px',
  },
  indicator: {
    backgroundColor: '#0097FF',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    '&:hover': {
      color: '#0097FF',
    },
  },
}))(Tab);

export default ({ value, type, setValue }) => {
  const styles = useStyles();
  const viewPage = (page, value) => {
    setValue(page, value);
  };

  return (
    <Grid container spacing={2}>
      <AntTabs value={value[0]}>
        <AntTab label='Visão Geral' onClick={() => viewPage(0, 0)} index={0} className={styles.fullWidthShrink} />

        {type === 'all' && (
          <AntTab
            label='Detalhado Operador'
            onClick={() => viewPage(1, 1)}
            index={1}
            className={styles.fullWidthShrink}
          />
        )}

        {type === 'all' && (
          <AntTab label='Status Operador' onClick={() => viewPage(2, 2)} index={2} className={styles.fullWidthShrink} />
        )}

        {/*type === 'bar' && (
          <AntTab label='Margem/Lucro' onClick={() => viewPage(1, 3)} index={1} className={styles.fullWidthShrink} />
        )}
        {type === 'ingresso' && (
          <AntTab label='Vendas por Dia' onClick={() => viewPage(1, 2)} index={2} className={styles.fullWidthShrink} />
        )}
        {type === 'estacionamento' && (
          <AntTab label='Busca por Placa' onClick={() => viewPage(1, 2)} index={2} className={styles.fullWidthShrink} />
        )*/}
      </AntTabs>
    </Grid>
  );
};
