import React, { useState, useEffect } from 'react';
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
import { KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import Api from '../../../../api';

import { formatTime, getMinDateToday, getMaxDateToday } from '../../../../utils/date';
import { useForm } from 'react-hook-form';
import InputPhone from '../../../../components/Input/NumberPhone';

const Modal = ({
  show,
  onClose,
  idList,
  afterAddPerson,
  afterEditPerson,
  data,
}) => {
  const { handleSubmit, register, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [fone, setFone] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [checkin, setCheckin] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [editMode, setEdit] = useState(false);

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
    console.log(show && data && data.id);
    if (show && data && data.id) {
      const time = new Date();

      if (data.checkin) {
        time.setHours(data.time.split(/:/g)[0]);
        time.setMinutes(data.time.split(/:/g)[1]);
      } else {
        time.setHours(0);
        time.setMinutes(0);
      }
      setEdit(true);

      setName(data.name);
      setFone(data.fone);
      setDocument(data.document);
      setEmail(data.email);
      setCheckin(data.checkin);
      setDate(new Date(data.date));
      setTime(time);
    } else {
      setEdit(false);
      setName('');
      setFone('');
      setDocument('');
      setEmail('');
      setCheckin(false);
      setDate(new Date());
      setTime(new Date());
    }
  }, [data, show]);

  const handleCreate = async () => {
    try {
      if (loading) {
        return false;
      }

      setLoading(true);

      const { data } = await Api.post(`/list/addList/${idList}`, {
        name,
        fone,
        document,
        email,
        checkin,
        date,
        time: formatTime(time.getTime()),
      });

      if (data.success) {
        afterAddPerson(data.data);
        onClose();
      } else {
        alert('Erro ao associar a pessoa na lista');
      }
    } catch (e) {
      console.log(e);
      alert('Erro ao criar a lista');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      if (loading) {
        return false;
      }

      setLoading(true);

      const res = await Api.put(`/list/editList/${idList}/${data.id}`, {
        name,
        fone,
        document,
        email,
        checkin,
        date,
        time,
        // time: formatTime(time.getTime())
      });

      if (res.data.success) {
        afterEditPerson(res.data.data);
        onClose();
      } else {
        alert('Erro ao associar a pessoa na lista');
      }
    } catch (e) {
      console.log(e);
      alert('Erro ao editar a lista');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    if (editMode) {
      handleEdit();
      return;
    }
    handleCreate();
  };

  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Dados da pessoa</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                label="Nome"
                name="name"
                value={name}
                inputRef={register({
                  required: 'É necessário preencher este campo',
                })}
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg md sm xs>
                  <InputPhone
                    label="Telefone"
                    name="fone"
                    value={fone}
                    inputRef={register({
                      required: 'É necessário preencher este campo',
                    })}
                    error={Boolean(errors?.fone)}
                    helperText={errors?.fone?.message}
                    onChange={(e) => setFone(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Documento"
                    name="document"
                    value={document}
                    inputRef={register({
                      required: 'É necessário preencher este campo',
                      pattern: {
                        value: /[0-9]{6,16}/i,
                        message: 'Documento inválido',
                      },
                    })}
                    error={Boolean(errors?.document)}
                    helperText={errors?.document?.message}
                    onChange={(e) => setDocument(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                label="E-mail"
                name="email"
                value={email}
                inputRef={register({
                  required: 'É necessário preencher este campo',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Endereço de email inválido',
                  },
                })}
                error={Boolean(errors?.email)}
                helperText={errors?.email?.message}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <FormControlLabel
                label="Check in"
                name="checkin"
                value={checkin}
                inputRef={register}
                control={
                  <GreenSwitch
                    checked={checkin}
                    onChange={(e) => setCheckin(e.target.checked)}
                  />
                }
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg md sm xs>
                  <KeyboardDatePicker
                    name="date"
                    value={date}
                    inputRef={register}
                    onChange={setDate}
                    label="Data"
                    inputVariant="outlined"
                    variant="inline"
                    format="DD/MM/YYYY"
                    clearable
                    ampm={false}
                    disabled={!checkin}
                    size="small"
                    minDate={getMinDateToday()}
										maxDate={getMaxDateToday()}
										minDateMessage="A data não deve ser menor que 10 anos da data atual"
										maxDateMessage="A data não deve ser maior que 10 anos da data atual"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <KeyboardTimePicker
                    name="time"
                    value={time}
                    inputRef={register}
                    onChange={setTime}
                    label="Hora"
                    inputVariant="outlined"
                    variant="inline"
                    format="HH:mm"
                    clearable
                    ampm={false}
                    disabled={!checkin}
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {loading ? (
              <CircularProgress size={25} />
            ) : editMode ? (
              'Editar'
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Modal;
