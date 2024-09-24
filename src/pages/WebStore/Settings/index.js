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

import Api from "../../../api"
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
    name: "",
    date: new Date(),
    hour: "00:00",
    local: "",
    city: "",
    fu: ""
  });

  const [status, setStatus] = useState(true);
  const [nominalTicket, setNominalTicket] = useState(false);

  // To edit
  const [description, setDescription] = useState('');
  const [description2, setDescription2] = useState('');
  const [address, setAddress] = useState('');
  const [imageDeleted, setImageDeleted] = useState(false);
  const [image, setImage] = useState(null);
  const [evLayoutDeleted, setEvLayoutDeleted] = useState(false);
  const [eventLayout, setEventLayout] = useState(null);
  const [target, setTarget] = useState(false);
  const [targetAge, setTargetAge] = useState(0);

  // Panel
  const [keep_sells_online, setKeepOnline] = useState(false);
  const [progEnd, setProgEnd] = useState(false);
  const [end, setEnd] = useState({
    date: new Date(),
    hour: new Date(),
  })

  const loadEventData = async () => {

    const evData = await Api.get(`/event/getData/${event}`)
    if (evData.data.success) {

      const ev = evData.data.event

      setEventData({ ...ev, time_ini: ev.time_ini.slice(0, 5) })

      setKeepOnline(Boolean(ev.keep_sells_online))
      setTarget(Boolean(ev.has_age))
      setTargetAge(ev.age ?? 0)
      setProgEnd(Boolean(ev.has_ending))
      if (ev.ending) {
        const brDate = new Date(ev.ending).toLocaleString("pt-BR", { timeZone: "UTC" })
        const dateTime = brDate.split(" ")[1].split(":")

        const hourDate = new Date(new Date(new Date(ev.ending).setHours(dateTime[0])).setMinutes(dateTime[1]))

        console.log(hourDate)

        setEnd({ date: new Date(ev.ending), hour: hourDate })
      }

      setNominalTicket(Boolean(ev.nominal))
      setAddress(ev.address)
      setDescription(ev.description)
      setDescription2(ev.description2 ?? "")

      if (ev.event_banner) handleImage(ev.event_banner)
      if (ev.event_map) handleImageLayout(ev.event_map)
    }
  }

  useEffect(() => {
    loadEventData().then(() => {
      setLoading(false)
    })
    // eslint-disable-next-line
  }, []);

  const getDateString = () => {
    const hrs = new Date(end.hour).getHours()
    const mns = new Date(end.hour).getMinutes()

    let d = new Date(end.date)
    d.setHours(hrs)
    d.setMinutes(mns)

    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ` +
      `${String(hrs).padStart(2, "0")}:${String(mns).padStart(2, "0")}:00`

    return str
  }

  const generateObj = () => {
    const obj = {
      // editable
      status: Number(status),
      nominal: Number(nominalTicket),
      has_age: Number(target),
      age: Number(targetAge),
      address: address,
      description: description,
      description2: description2,
      event_banner: image,
      event_map: eventLayout,
      keep_sells_online: Number(keep_sells_online),
      has_ending: Number(progEnd),
      ending: getDateString(),

      // not editable
      org_id: eventData.org_id,
      name: eventData.name,
      hotsite_address: eventData.hotsite_address,
      order_number: eventData.order_number,
      date_ini: eventData.date_ini,
      // time_ini: eventData.time_ini,
      time_ini: new Date(eventData.date_ini).getTime(),
      date_end: eventData.date_end,
      local: eventData.local,
      city: eventData.city,
      state: eventData.state,
      print_valid: Number(eventData.print_valid),
      print_logo: Number(eventData.print_logo),
      days: eventData.days,
      has_cashless: Number(eventData.has_cashless),
      has_tax_active: Number(eventData.has_tax_active),
      allow_cashback: Number(eventData.allow_cashback),
      has_tax_cashback: Number(eventData.has_tax_cashback),
      tax_active: eventData.tax_active,
      tax_payback_cash: eventData.tax_payback_cash,
      tax_payback_percent: eventData.tax_payback_percent,
      logo: eventData.logo,
      logo_print: eventData.logo_print
    }

    return obj
  }

  const generateFD = (obj) => {
    let fd = new FormData()

    fd.append("name", obj.name)
    fd.append("status", obj.status)
    fd.append("logo", obj.logo)
    fd.append("logo_print", obj.logo_print)
    fd.append("date_ini", obj.date_ini)
    fd.append("time_ini", obj.time_ini)
    fd.append("date_end", obj.date_end)

    fd.append("has_age", obj.has_age)
    fd.append("age", obj.age)
    fd.append("keep_sells_online", obj.keep_sells_online)
    fd.append("has_ending", obj.has_ending)
    fd.append("ending", obj.ending)

    fd.append("local", obj.local)
    fd.append("city", obj.city)
    fd.append("state", obj.state)
    fd.append("print_valid", obj.print_valid)
    fd.append("description", obj.description)
    fd.append("description2", obj.description2)
    fd.append("order_number", obj.order_number)
    fd.append("print_logo", obj.print_logo)
    fd.append("days", obj.days)
    fd.append("has_cashless", obj.has_cashless)
    fd.append("has_tax_active", obj.has_tax_active)
    fd.append("allow_cashback", obj.allow_cashback)
    fd.append("has_tax_cashback", obj.has_tax_cashback)
    fd.append("tax_active", obj.tax_active)
    fd.append("tax_payback_cash", obj.tax_payback_cash)
    fd.append("tax_payback_percent", obj.tax_payback_percent)
    fd.append("hotsite_address", obj.hotsite_address)
    fd.append("address", obj.address)
    fd.append("nominal", obj.nominal)
    fd.append("event_banner", obj.event_banner)
    fd.append("event_map", obj.event_map)

    return fd
  }

  const handleEdit = async () => {

    try {
      setButtonLoading(true);

      const obj = generateObj()
      const fd = generateFD(obj)

      setButtonLoading(false);

      await Api.put(`/event/updateEvent/${event}`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .catch(() => {
          alert("Houve um erro ao atualizar os dados. Tente novamente mais tarde.")
        })
      handleCancel();

    } catch (e) {
      console.log(e);
    } finally {
      setButtonLoading(false);
    }
  };

  const verifyInputs = () => {
    return (
      !address ||
      !description
    );
  };

  const handleSubmit = () => {
    try {
      // eslint-disable-next-line no-throw-literal
      if (verifyInputs()) throw { message: 'Verifique os campos e tente novamente' };
      handleEdit();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    history.push('/dashboard/webstore');
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
                  <Typography>Endereço loja</Typography>
                  <Typography>{eventData.hotsite_address}</Typography>
                </Grid>
              </Grid>
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
                      value={description2}
                      onChange={setDescription2}
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

                  {/* Fotos */}
                  <Grid item container xl={12} lg={12} md={6} sm={12} xs={12} style={{ marginBottom: 12 }}>
                    <Grid item container direction="row" spacing={2}>
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ textAlign: "center" }}>
                        <ImagePicker
                          label="Imagem do Evento"
                          name="image"
                          image={image}
                          setImage={handleImage}
                          style={{ maxHeight: 80 }}
                        />
                        <small>Tamanho: 262×100 (png)</small>
                      </Grid>
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ textAlign: "center" }}>
                        <ImagePicker
                          label="Imagem do Layout/Mapa do Evento"
                          name="layout"
                          image={eventLayout}
                          setImage={handleImageLayout}
                          style={{ maxHeight: 80 }}
                        />
                        <small>Tamanho: 262×100 (png)</small>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Painel de controle</Typography>
              <Divider />

              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='Manter Venda-Online'
                    name='keep_sells_online'
                    value={keep_sells_online}
                    control={
                      <GreenSwitch
                        checked={keep_sells_online}
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
