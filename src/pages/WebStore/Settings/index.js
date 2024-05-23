import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers'
import {
  Grid,
  TextField,
  FormControlLabel,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Card,
  CardContent
} from '@material-ui/core'
import { connect } from 'react-redux'
import { formatDate } from '../../../utils/date'
import 'react-quill/dist/quill.snow.css'

import { GreenSwitch, StatusSwitch } from '../../../components/Switch'
import ImagePicker from '../../../components/ImagePicker'
import ReactQuill from 'react-quill'

const Manager = ({ events, event, user }) => {

  const history = useHistory()
  const [errorsVerify] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Usuário comum
  const [eventData, setEventData] = useState({
    name: "Nome do evento",
    date: new Date(),
    hour: "12:00",
    local: "Local do evento",
    city: "Florianópolis",
    fu: "UF"
  });

  const [status, setStatus] = useState(true);
  const [nominalTicket, setNominalTicket] = useState(false);

  // To edit
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [imageDeleted, setImageDeleted] = useState(false);
  const [image, setImage] = useState(null);
  const [evLayoutDeleted, setEvLayoutDeleted] = useState(false);
  const [eventLayout, setEventLayout] = useState(null);
  const [target, setTarget] = useState(false);
  const [targetAge, setTargetAge] = useState(0);

  // Panel
  const [keepOnline, setKeepOnline] = useState(false);
  const [progEnd, setProgEnd] = useState(false);
  const [end, setEnd] = useState({
    date: new Date(),
    hour: new Date(),
  })

  useEffect(() => {
    const evData = events.find((item) => item.id === event)
    setEventData(evData)
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  const handleEdit = async () => {

    try {
      setButtonLoading(true);
      // await Api.put(`/manager/updateManager/${idManager}`, {
      //   status,
      //   nominalTicket,

      //   description,
      //   address,
      //   image,
      //   eventLayout,
      //   target,
      //   targetValue: target ? targetAge : undefined,
      //   keepOnline,
      //   progEnd,
      //   end: progEnd ? end : undefined
      // });
      handleCancel();
    } catch (e) {
      console.log(e);
    } finally {
      setButtonLoading(false);
    }
  };

  const verifyInputs = () => {
    return (
      // nameInputVerify(name) ||
      // (action ? passwordInputVerify(password) : false) ||
      // emailInputVerify(email) ||
      // codeInputVerify(code) ||
      // descriptionInputVerify(description)
      true
    );
  };

  const handleSubmit = () => {
    try {
      // eslint-disable-next-line no-throw-literal
      if (verifyInputs()) throw { message: 'Um ou mais campos possui erro!' };
      handleEdit();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    history.push('/dashboard/manager');
  };

  const handleDateMask = (val) => {
    setEnd({ ...end, date: val })
  }

  const handleHourMask = (val) => {
    setEnd({ ...end, hour: val })
  }

  const handleImage = (data) => {
    if (image && !data) setImageDeleted(true)
    else if (imageDeleted) setImageDeleted(false)

    setImage(data)
  }

  const handleImageLayout = (data) => {
    if (eventLayout && !data) setEvLayoutDeleted(true)
    else if (evLayoutDeleted) setEvLayoutDeleted(false)

    setEventLayout(data)
  }

  const formatHour = (str) => {
    if (!str) return "Dia todo"
    else {
      const [tHour, tMin] = str.split(":")
      return `${tHour}:${tMin}`
    }
  }

  return loading ? (
    <Grid container spacing={2} justify='center'>
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  ) : (
    <form>
      <Card>
        <CardContent>
          <Grid container spacing={2}>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <FormControlLabel
                name='status'
                control={<StatusSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                label={status ? 'Ativo' : 'Inativo'}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <FormControlLabel
                name='nominalTicket'
                control={<GreenSwitch checked={nominalTicket} onChange={(e) => setNominalTicket(e.target.checked)} />}
                label={nominalTicket ? 'Ingresso nominal' : 'Ingresso não nominal'}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Dados do evento</Typography>
              <Divider />
            </Grid>

            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item xl={2} lg={2} xs={12} direction='column'>
                  <Typography>Nome</Typography>
                  <Typography>{eventData.name}</Typography>
                </Grid>
                <Grid item xl={2} lg={2} xs={12} direction='column'>
                  <Typography>Data</Typography>
                  {
                    (new Date(eventData.date_end)).getFullYear() > 1970 ?
                      <Typography>{`De ${formatDate(eventData.date_ini)} até ${formatDate(eventData.date_end)}`}</Typography>
                      :
                      <Typography>{formatDate(eventData.date_ini)}</Typography>
                  }
                </Grid>
                <Grid item xl={2} lg={2} xs={12} direction='column'>
                  <Typography>Horário</Typography>
                  <Typography>{formatHour(eventData.time_ini)}</Typography>
                </Grid>
                <Grid item xl={2} lg={2} xs={12} direction='column'>
                  <Typography>Local</Typography>
                  <Typography>{eventData.local}</Typography>
                </Grid>
                <Grid item xl={2} lg={2} xs={12} direction='column'>
                  <Typography>Cidade</Typography>
                  <Typography>{eventData.city}</Typography>
                </Grid>
                <Grid item xl={2} lg={2} xs={12} direction='column'>
                  <Typography>UF</Typography>
                  <Typography>{eventData.state}</Typography>
                </Grid>
              </Grid>
              <Divider />
            </Grid>

            <Grid item container spacing={2} direction='row-reverse'>

              {/* right side */}
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} style={{ height: "100%" }}>

                <Grid container spacing={2} direction='column' style={{ height: "100%" }}>

                  <Grid item xl={12} lg={12} xs={12} style={{ flex: "unset" }}>
                    <Typography style={{ fontWeight: 'bold' }}>Descrição</Typography>
                  </Grid>

                  <Grid item xl={12} lg={12} xs={12} style={{ flex: 1 }}>
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      style={{
                        borderRadius: 6,
                        height: "100%",
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* left side */}
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                <Grid container spacing={2} direction='column'>

                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Typography style={{ fontWeight: 'bold' }}>Informações gerais</Typography>
                  </Grid>

                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xl={12} lg={12} xs={12}>
                        <TextField
                          label='Endereço'
                          name='address'
                          value={address}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 80);
                            setAddress(value);
                          }}
                          error={Boolean(errorsVerify?.address)}
                          helperText={errorsVerify?.address}
                          variant='outlined'
                          size='small'
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label='Possui classificação etária'
                        name='target'
                        value={target}
                        control={
                          <GreenSwitch
                            checked={target}
                            onChange={(e) => setTarget(e.target.checked)}
                          />
                        }
                      />
                    </Grid>
                    {target && (
                      <Grid item>
                        <TextField
                          label='Idade'
                          name='targetAge'
                          value={targetAge}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 80);
                            setTargetAge(value);
                          }}
                          error={Boolean(errorsVerify?.targetAge)}
                          helperText={errorsVerify?.targetAge}
                          variant='outlined'
                          size='small'
                          fullWidth
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xl={12} lg={12} md={6} sm={12} xs={12} style={{ marginBottom: 12 }}>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ textAlign: "center" }}>
                        <ImagePicker
                          label="Imagem do Evento"
                          name="image"
                          image={image}
                          setImage={handleImage}
                        />
                        <small>Tamanho: 262×100 (png)</small>
                      </Grid>
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ textAlign: "center" }}>
                        <ImagePicker
                          label="Imagem do Layout/Mapa do Evento"
                          name="layout"
                          image={eventLayout}
                          setImage={handleImageLayout}
                        />
                        <small>Tamanho: 262×100 (png)</small>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                  </Grid>
                </Grid>
              </Grid>

            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Painel de controle</Typography>
              <Divider />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='Manter Venda-Online'
                    name='keepOnline'
                    value={keepOnline}
                    control={
                      <GreenSwitch
                        checked={keepOnline}
                        onChange={(e) => setKeepOnline(e.target.checked)}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item container spacing={2}>
              <Grid item>
                <FormControlLabel
                  label='Possui encerramento programado'
                  name='progEnd'
                  value={progEnd}
                  control={
                    <GreenSwitch
                      checked={progEnd}
                      onChange={(e) => setProgEnd(e.target.checked)}
                    />
                  }
                />
              </Grid>
              {progEnd && (
                <Grid item lg={2}>
                  <KeyboardDatePicker
                    autoOk
                    label='Data'
                    value={end.date}
                    onChange={handleDateMask}
                    minDate={new Date()}
                    minDateMessage='A data final deve ser maior que hoje'
                    inputVariant='outlined'
                    variant='inline'
                    format='DD/MM/YYYY'
                    fullWidth
                    size='small'
                    style={{ backgroundColor: '#fff' }}
                  />
                </Grid>
              )}
              {progEnd && (
                <Grid item lg={2}>
                  <TimePicker
                    autoOk
                    ampm={false}
                    label='Hora'
                    value={end.hour}
                    onChange={handleHourMask}
                    minDate={new Date()}
                    minDateMessage='A data final deve ser maior que hoje'
                    inputVariant='outlined'
                    variant='inline'
                    format='HH:mm'
                    size='small'
                    fullWidth
                    style={{ backgroundColor: '#fff' }}
                  />
                </Grid>
              )}
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant='outlined' color='secondary' onClick={handleCancel}>
                    Cancelar
                  </Button>
                </Grid>
                <Grid item>
                  {user.role === 'master' &&
                    <Button onClick={() => handleSubmit()} variant='outlined' color='primary'>
                      {buttonLoading ? <CircularProgress size={25} /> : 'Salvar'}
                    </Button>
                  }
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </form >
  );
};

const mapStateToProps = ({ events, event, user }) => ({ events, event, user });

export default connect(mapStateToProps)(Manager);
