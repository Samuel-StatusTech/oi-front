import React, { useEffect, useState } from 'react';
import {
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  DialogActions,
  withStyles,
} from '@material-ui/core';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import Api from '../../../../api';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import TransferList from '../../../../components/TransferList';
import { getMinDateToday, getMaxDateToday } from '../../../../utils/date';

const Modal = ({ show, onClose, handleGotoEdit, event }) => {
  const { handleSubmit, register, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState(true);
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [hasDateLimit, setHasDateLimit] = useState(false);
  const [hasQuantityLimit, setHasQuantityLimit] = useState(false);
  const [timeLimit, setTimeLimit] = useState(new Date(2019, 0, 0, 0, 0));
  const [dateLimit, setDateLimit] = useState(new Date(2019, 0, 0, 0, 0));
  const [quantityLimit, setQuantityLimit] = useState(0);
  const [hasProductList, setHasProductList] = useState(false);
  const [productList, setProductList] = useState([]);
  const [rawList, setRawList] = useState([]);
  const [eventDate, setEventDate] = useState(null);

  const GreenSwitch = withStyles({
    switchBase: {
      '&$checked': {
        color: '#9ACD32',
      },
      '&$checked + $track': {
        backgroundColor: '#9ACD32',
      },
    },
    checked: {},
    track: {},
  })(Switch);

  useEffect(() => {
    Api.get(`/event/getData/${event}`).then(({ data }) => {
      if (data.success) {
        setEventDate(data.event.date_ini);
      }
    });
  }, [event]);

  const handleCreate = async () => {
    try {
      if (loading) {
        return false;
      }
      setLoading(true);

      if (productList.length === 0) {
        alert(
          'Selecione ao menos um item para associar um ingresso/produto à Lista.'
        );
        return false;
      }

      const { data } = await Api.post('/list/createList', {
        name,
        event_id: event,
        status,
        has_time_limit: hasTimeLimit,
        has_date_limit: hasDateLimit,
        has_quantity_limit: hasQuantityLimit,
        time_limit: timeLimit,
        quantity_limit: quantityLimit,
        product_list: productList,
      });

      if (data.success) {
        handleGotoEdit(data.id)();
      } else {
        alert('Erro ao criar a lista');
      }
    } catch (e) {
      console.log(e);
      alert('Erro ao criar a lista');
    } finally {
      setLoading(false);
    }
  };

  const onSelectProduct = (products) => {
    setProductList(products);
    setHasProductList(products.length);
  };

  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Dados da lista</DialogTitle>
      <form onSubmit={handleSubmit(handleCreate)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg md sm xs>
                  <TextField
                    label="Nome"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    inputRef={register({
                      required: 'É necessário preencher este campo',
                    })}
                    error={Boolean(errors?.name)}
                    helperText={errors?.name?.message}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label={status ? 'Ativo' : 'Inativo'}
                    name="status"
                    value={status}
                    inputRef={register}
                    control={
                      <GreenSwitch
                        checked={status}
                        onChange={(e) => setStatus(e.target.checked)}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label="Data Limite"
                    name="hasDateLimit"
                    value={hasDateLimit}
                    inputRef={register}
                    control={
                      <GreenSwitch
                        checked={hasDateLimit}
                        onChange={(e) => setHasDateLimit(e.target.checked)}
                      />
                    }
                  />
                </Grid>
                <Grid item lg md sm xs>
                  <KeyboardDatePicker
                    name="dateLimit"
                    value={dateLimit}
                    onChange={setDateLimit}
                    inputRef={register}
                    minDate={new Date(eventDate)}
                    error={Boolean(errors?.dateLimit)}
                    helperText={errors?.dateLimit?.message}
                    inputVariant="outlined"
                    variant="inline"
                    format="DD/MM/YYYY"
                    clearable
                    disabled={!hasDateLimit}
                    minDate={getMinDateToday()}
										maxDate={getMaxDateToday()}
										minDateMessage="A data não deve ser menor que 10 anos da data atual"
										maxDateMessage="A data não deve ser maior que 10 anos da data atual"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label="Hora Limite"
                    name="hasTimeLimit"
                    value={hasTimeLimit}
                    inputRef={register}
                    control={
                      <GreenSwitch
                        checked={hasTimeLimit}
                        onChange={(e) => setHasTimeLimit(e.target.checked)}
                      />
                    }
                  />
                </Grid>
                <Grid item lg md sm xs>
                  <KeyboardTimePicker
                    name="timeLimit"
                    value={timeLimit}
                    inputRef={register}
                    onChange={setTimeLimit}
                    inputVariant="outlined"
                    variant="inline"
                    format="HH:mm"
                    clearable
                    disabled={!hasTimeLimit}
                    ampm={false}
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label="Limite de Quantidade"
                    name="hasQuantityLimit"
                    value={hasQuantityLimit}
                    inputRef={register}
                    control={
                      <GreenSwitch
                        checked={hasQuantityLimit}
                        onChange={(e) => setHasQuantityLimit(e.target.checked)}
                      />
                    }
                  />
                </Grid>
                <Grid item lg md sm xs>
                  <TextField
                    name="quantityLimit"
                    value={quantityLimit}
                    inputRef={register({
                      maxLength: {
                        value: 5,
                        message: 'Esse campo pode conter somente 5 dígitos.',
                      },
                    })}
                    error={Boolean(errors?.quantityLimit)}
                    helperText={errors?.quantityLimit?.message}
                    onChange={(e) => {
                      if (e.target.value >= 0) setQuantityLimit(e.target.value);
                    }}
                    variant="outlined"
                    clearable
                    disabled={!hasQuantityLimit}
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TransferList
                onSelect={onSelectProduct}
                rawList={rawList}
                hasProduct={hasProductList}
                label="Associar Ingressos/Produtos à Lista"
                selectAll
                hasQuantity
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {loading ? <CircularProgress size={25} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Modal);
