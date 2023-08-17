import React, { useState } from 'react';
import { Paper, Grid, TextField, Button, Chip } from '@material-ui/core';
import Api from '../../../api';
import { connect } from 'react-redux';

const Batch = ({ event }) => {
  const [id, setId] = useState('');
  const [list, setList] = useState([]);

  const handleCancel = async () => {
    try {
      const { data } = await Api.delete(`/order/cancelOrder/${event}`, {
        order_list: list,
      });

      console.log(data);

      setList([]);
    } catch (e) {
      console.log(e.response);
      alert('Erro ao cancelar alguns produtos');
    }
  };

  const handleDelete = (index) => {
    setList((previous) => previous.filter((item, i) => index !== i));
  };

  const handleAdd = (e) => {
    console.log(e.key);
    if (e.key === 'Enter' && !!id) {
      setList((previous) => [...previous, id]);
      setId('');
    }
  };

  const handleChange = (e) => {
    setId(e.target.value);
  };

  return (
    <Paper style={{ paddingLeft: 8 }}>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            value={id}
            variant="outlined"
            onChange={handleChange}
            onKeyDown={handleAdd}
          />
        </Grid>

        <Grid item>
          <Grid container spacing={1}>
            {list.map((item, index) => (
              <Grid item>
                <Chip label={item} onDelete={() => handleDelete(index)} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Button variant="outlined" color="primary" onClick={handleCancel}>
            Processar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Batch);
