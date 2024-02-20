import React, { useState, useEffect } from "react"
import { useHistory, useParams, useLocation } from "react-router-dom"
import {
  Grid,
  TextField,
  FormControlLabel,
  Button,
  CircularProgress,
  Typography,
  Divider,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core"
import { connect } from "react-redux"

import Api from "../../../api"
import firebase from "../../../firebase"
import { useForm } from "react-hook-form"

import InputPassword from "../../../components/Input/Password"
import TransferList from "../../../components/TransferList"
import ModalResetPassword from "./Modal/ResetPassword"
import ImagePicker from "../../../components/ImagePicker"
import { GreenSwitch, StatusSwitch } from "../../../components/Switch"
import { genWaiterFormData } from "./prodFD"

const Operator = ({ user }) => {
  const { register } = useForm()

  const history = useHistory()
  const location = useLocation()
  const { idOperator } = useParams()
  const [errorsVerify, setErrorsVerify] = useState({})
  const [resetPassword, setResetPassword] = useState(null)
  const [action] = useState(idOperator === "new")
  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)

  const [status, setStatus] = useState(true)
  const [photo, setPhoto] = useState(null)
  const [image, setImage] = useState(null)

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [hasProductList, setHasProductList] = useState(false)
  const [hasBar, setHasBar] = useState(false)
  const [hasTicket, setHasTicket] = useState(false)
  const [hasPark, setHasPark] = useState(false)
  const [prodsGroups, setProdsGroups] = useState([])
  const [payMoney, setPayMoney] = useState(true)
  const [payDebit, setPayDebit] = useState(true)
  const [payCredit, setPayCredit] = useState(true)
  const [payPix, setPayPix] = useState(true)
  const [payCashless, setPayCashless] = useState(false)
  const [payMulti, setPayMulti] = useState(false)
  const [hasServiceTax, setHasServiceTax] = useState(false)
  const [serviceTax, setServiceTax] = useState(0)
  const [printMode, setPrintMode] = useState(null)
  const [viaProduction, setViaProduction] = useState(false)
  const [allowCashback, setAllowCashback] = useState(false)
  const [allowCourtesy, setAllowCourtesy] = useState(false)
  const [allowDuplicate, setAllowDuplicate] = useState(false)
  const [isWaiter, setIsWaiter] = useState(false)
  const [hasCommission, setHasCommission] = useState(false)
  const [commission, setCommission] = useState(0)
  const [hasCashless, setHasCashless] = useState(false)
  const [printReceipt, setPrintReceipt] = useState(false)
  const [allowRefound, setAllowRefound] = useState(false)
  const [allowCashbackCashless, setAllowCashbackCashless] = useState(false)
  const [deviceCode, setDeviceCode] = useState(null)
  const [productList, setProductList] = useState([])
  const [allProds, setAllProds] = useState([])
  const [prodsLoaded, setProdsLoaded] = useState(false)
  const [rawList, setRawList] = useState([])
  const [disableOperators, setDisableOperators] = useState(false)
  const [hasCashlessConfig, setHasCashlessConfig] = useState(false)
  const [devices, setDevice] = useState([])

  const [isPhotoDeleted, setPhotoDeleted] = useState(false)

  const excludeWaiterGroup = (list) => {
    if (allProds.length > 0) {
      return list.filter((i) => !i.name.toLowerCase().includes("garçom"))
    }
  }

  const hasCashlessConf = async (user) => {
    if (user && user.uid) {
      console.log(user.uid)
      const clientKey = (
        await firebase
          .database()
          .ref("Managers/" + user.uid + "/client")
          .once("value")
      ).val()
      const hasCashlessC = (
        await firebase
          .database()
          .ref(`Clients/${clientKey}/cashless`)
          .once("value")
      ).val()
      setHasCashlessConfig(hasCashlessC)
    }
  }

  const loadData = () => {

    Api.get("/device/getListActived").then(({ data }) => {
      if (data.success) {
        setDevice(data.devices)
      } else {
        alert("Erro ao carregar os produtos")
      }
    })

    if (idOperator === "clone") {
      if (!location.state) {
        location["state"] = JSON.parse(localStorage.getItem("OPERATOR_CLONE"))
      }

      const { operator, list } = location.state

      setRawList(list)
      setHasProductList(operator.has_product_list)
      setHasBar(operator.has_bar)
      setHasTicket(operator.has_ticket)
      setHasPark(operator.has_park)
      setPayMoney(operator.pay_money)
      setPayDebit(operator.pay_debit)
      setPayCredit(operator.pay_credit)
      setPayPix(operator.pay_pix)
      setPayCashless(operator.pay_cashless)
      setPayMulti(operator.pay_multi)
      setPrintMode(operator.print_mode)
      setViaProduction(operator.via_production)
      setAllowCashback(operator.allow_cashback)
      setAllowCourtesy(operator.allow_courtesy)
      setAllowDuplicate(operator.allow_duplicate)
      setIsWaiter(operator.is_waiter)
      setHasCommission(operator.has_commission)
      setCommission(operator.commission)
      setHasCashless(operator.has_cashless)
      setPrintReceipt(operator.print_receipt)
      setAllowRefound(operator.allow_refound)
      setAllowCashbackCashless(operator.allow_cashback_cashless)
      setDeviceCode(operator.device_code)

      setLoading(false)
    } else if (idOperator !== "new") {
      // editing

      Api.get(`/operator/getData/${idOperator}`)
        .then(({ data }) => {
          const { success, operator, list } = data

          if (success) {
            setName(operator.name)
            setUsername(operator.username)
            if (operator.photo && operator.photo.length > 0)
              setPhoto(operator.photo)

            setRawList(list)
            
            setStatus(Boolean(operator.status))
            setHasProductList(Boolean(operator.has_product_list))
            setHasBar(Boolean(operator.has_bar))
            setHasTicket(Boolean(operator.has_ticket))
            setHasPark(Boolean(operator.has_park))
            setPayMoney(Boolean(operator.pay_money))
            setPayDebit(Boolean(operator.pay_debit))
            setPayCredit(Boolean(operator.pay_credit))
            setPayPix(Boolean(operator.pay_pix))
            setPayCashless(Boolean(operator.pay_cashless))
            setPayMulti(Boolean(operator.pay_multi))
            setPrintMode(operator.print_mode)
            setViaProduction(Boolean(operator.via_production))
            setAllowCashback(Boolean(operator.allow_cashback))
            setAllowCourtesy(Boolean(operator.allow_courtesy))
            setAllowDuplicate(Boolean(operator.allow_duplicate))
            setIsWaiter(Boolean(operator.is_waiter))
            setHasCommission(Boolean(operator.has_commission))
            setCommission(operator.commission)
            setHasCashless(Boolean(operator.has_cashless))
            setPrintReceipt(Boolean(operator.print_receipt))
            setAllowRefound(Boolean(operator.allow_refound))
            setAllowCashbackCashless(Boolean(operator.allow_cashback_cashless))
            setDeviceCode(operator.device_code)
          } else {
            alert("Não foi possível carregar os dados do gerente")
            handleCancel()
          }
        })
        .catch((e) => {
          if (e.response) {
            const data = e.response.data

            if (data.error) {
              alert(data.error)
            } else {
              alert("Erro não esperado")
            }
          } else {
            alert("Erro não esperado")
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }

  useEffect(loadData, [prodsLoaded])

  useEffect(() => {

    firebase.auth().onAuthStateChanged(hasCashlessConf)
    hasCashlessConf()

    Api.get("/group/getList").then(({ data }) => {
      setProdsGroups(excludeWaiterGroup(data.groups))
    })
    Api.get("/product/getList?type=todos").then(({ data }) => {
      setAllProds(data.products)
      setProdsLoaded(true)
    })

    // eslint-disable-next-line
  }, [])

  const returnFormData = () => {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("role", "operador")

    if (isPhotoDeleted) formData.append("photo", null)
    else {
      if (image) formData.append("image", image)
      else formData.append("photo", photo)
    }

    formData.append("org_id", user.org_id)
    formData.append("status", status ? 1 : 0)

    if (hasBar) formData.append("has_bar", 1)
    if (hasTicket) formData.append("has_ticket", 1)
    if (hasPark) formData.append("has_park", 1)
    if (payMoney) formData.append("pay_money", 1)
    if (payDebit) formData.append("pay_debit", 1)
    if (payCredit) formData.append("pay_credit", 1)
    if (payPix) formData.append("pay_pix", 1)
    if (payCashless) formData.append("pay_cashless", 1)
    if (payMulti) formData.append("pay_multi", 1)
    if (hasProductList) formData.append("has_product_list", 1)
    if (viaProduction) formData.append("via_production", 1)
    if (allowCashback) formData.append("allow_cashback", 1)
    if (allowCourtesy) formData.append("allow_courtesy", 1)
    if (allowDuplicate) formData.append("allow_duplicate", 1)
    if (isWaiter) formData.append("is_waiter", 1)
    if (hasCashless) formData.append("has_cashless", 1)
    if (printReceipt) formData.append("print_receipt", 1)
    if (allowRefound) formData.append("allow_refound", 1)
    if (allowCashbackCashless) formData.append("allow_cashback_cashless", 1)
    if (hasCommission) formData.append("has_commission", 1)
    if (hasServiceTax) formData.append("has_service_tax", 1)
    formData.append("commission", commission)
    // formData.append("service_tax", serviceTax)
    formData.append("print_mode", printMode)
    formData.append("device_code", deviceCode)
    formData.append("products", JSON.stringify(productList.map(p=>p.id)))

    return formData
  }

  const handleSave = async () => {
    try {
      setButtonLoading(true)
      const data = returnFormData()
      await Api.post("/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      handleCancel()
    } catch (e) {
      if (e.response) {
        const data = e.response.data

        if (data.error) {
          alert(data.error)
        } else {
          alert("Erro não esperado")
        }
      } else {
        alert("Erro não esperado")
      }
    } finally {
      setButtonLoading(false)
    }
  }

  const handleEdit = async () => {
    try {
      setButtonLoading(true)
      const data = returnFormData()
      await Api.put(`/operator/updateOperator/${idOperator}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      handleCancel()
    } catch (e) {
      if (e.response) {
        const data = e.response.data

        if (data.error) {
          alert(data.error)
        }
      } else {
        alert("Erro não esperado")
      }
    } finally {
      setButtonLoading(false)
    }
  }

  const onSelectProduct = (products) => {
    setProductList(products)
    setHasProductList(products.length)
  }

  const onOpenedHandle = (checked) => {
    setDisableOperators(checked)
    if (checked) {
      setHasBar(false)
      setHasTicket(false)
      setHasPark(false)
    }
  }

  const verifyInputs = () => {
    return (
      nameInputVerify(name) ||
      usernameInputVerify(username) ||
      (idOperator === "new" || idOperator === "clone"
        ? passwordInputVerify(password)
        : false) ||
      commissionInputVerify(commission)
    )
  }

  const verifyWaiterTax = () => {
    return hasCommission && commission === 0
  }

  const handleSubmit = async () => {
    try {
      setButtonLoading(true)
      if (verifyWaiterTax() || verifyInputs())
        throw { message: "Um ou mais campos possui erro!" }

      // "Taxa garçom product - logic"
      // 1. Verificar se hasServiceTax
      if (hasServiceTax) {
        // 2. Verificar se existe produto "Taxa garçom"

        // 3. Caso não, cadastrar produto (e grupo)

        if (!allProds.find((p) => p.name.includes("Taxa Garçom"))) {
          const waiterGroup = prodsGroups.find((g) =>
            g.name.includes("Taxa Garçom")
          )

          let gId = undefined

          if (waiterGroup) gId = waiterGroup.id
          else {
            const newGroup = await Api.post("/group/createGroup", {
              name: "Taxa Garçom",
              type: "bar",
              status: 1,
            })
            gId = newGroup.data.category.id
          }

          if (gId) {
            const fd = genWaiterFormData(gId)

            await Api.post("/product/createProduct", fd, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
          }
        }

        // 4. Caso sim, não fazer nada
      }

      if (idOperator === "new" || idOperator === "clone") {
        handleSave()
        return
      }
      handleEdit()
    } catch (error) {
      alert(error.message)
    } finally {
      setButtonLoading(false)
    }
  }

  const handleCancel = () => {
    history.push("/dashboard/operator")
  }

  const selectGroups = (e) => {
    setHasBar(e.target.checked)
    setHasPark(e.target.checked)
    setHasTicket(e.target.checked)
  }

  const isEmpty = (str) => {
    return !str || str.length === 0
  }
  const nameInputVerify = (name) => {
    if (isEmpty(name))
      return (errorsVerify.name = "É necessário preencher este campo")
    //if (!/^[a-zA-Z ]*$/.test(name)) return (errorsVerify.name = 'Esse campo só aceita letras.');
    errorsVerify.name = null
    return false
  }
  const usernameInputVerify = (username) => {
    if (!/^[a-z]{1}(\w)+$/.test(username))
      return (errorsVerify.username =
        "Esse campo somente aceita letras e números. (Mín. 2 caracteres)")
    errorsVerify.username = null
    return false
  }
  const passwordInputVerify = (password) => {
    if (!/^\S{4,}/.test(password))
      return (errorsVerify.password = "Mínimo 4 caracteres")
    if (!/^\S*$/i.test(password))
      return (errorsVerify.password = "Não pode espaço em branco no campo")
    errorsVerify.password = null
    return false
  }

  const commissionInputVerify = (commission) => {
    if (!/^[0-9]{1,3}/i.test(commission))
      return (errorsVerify.commission = "Valor Inválido.")
    errorsVerify.commission = null
    return false
  }

  const handleImage = (data) => {
    if (photo && !data) setPhotoDeleted(true)
    else if (isPhotoDeleted) setPhotoDeleted(false)

    setImage(data)
  }

  if (loading) {
    return (
      <Grid container spacing={2} justify="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <form>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item xl={4} lg={4} xs={12}>
                    <TextField
                      label="Nome"
                      name="name"
                      value={name}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 80)
                        setName(value)
                        nameInputVerify(value)
                      }}
                      error={Boolean(errorsVerify?.name)}
                      helperText={errorsVerify?.name}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xl={4} lg={4} xs={12}>
                    <TextField
                      label="Usuário"
                      name="username"
                      value={username}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 25)
                        setUsername(value)
                        usernameInputVerify(value)
                      }}
                      error={Boolean(errorsVerify?.username)}
                      helperText={errorsVerify?.username}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  {idOperator === "new" || idOperator === "clone" ? (
                    <Grid item xl={4} lg={4} xs={12}>
                      <InputPassword
                        label="Senha"
                        name="password"
                        value={password}
                        onChange={(e) => {
                          const value = e.target.value
                          setPassword(value)
                          passwordInputVerify(value)
                        }}
                        error={Boolean(errorsVerify?.password)}
                        helperText={errorsVerify?.password}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  ) : null}

                  <Grid item xl={4} lg={4} xs={12}>
                    <TextField
                      label="Dispositivo"
                      name="deviceCode"
                      value={deviceCode}
                      onChange={(e) => setDeviceCode(e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      select
                    >
                      {devices.map((device, index) => (
                        <MenuItem key={index} value={device.code}>
                          {device.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
                <FormControlLabel
                  label={status ? "Ativo" : "Inativo"}
                  name="status"
                  value={status}
                  control={
                    <StatusSwitch
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                    />
                  }
                />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography style={{ fontWeight: "bold" }}>
                  Quais produtos esse Operador vende?
                </Typography>
                <Divider />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel
                      label="Bar"
                      name="hasBar"
                      value={hasBar}
                      disabled={disableOperators}
                      control={
                        <GreenSwitch
                          checked={hasBar}
                          onChange={(e) => setHasBar(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Ingresso"
                      name="hasTicket"
                      value={hasTicket}
                      disabled={disableOperators}
                      control={
                        <GreenSwitch
                          checked={hasTicket}
                          onChange={(e) => setHasTicket(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Estacionamento"
                      name="hasPark"
                      value={hasPark}
                      disabled={disableOperators}
                      control={
                        <GreenSwitch
                          checked={hasPark}
                          onChange={(e) => setHasPark(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Todos"
                      name="allGroups"
                      value={hasBar && hasTicket && hasPark}
                      disabled={disableOperators}
                      control={
                        <GreenSwitch
                          checked={hasBar && hasTicket && hasPark}
                          onChange={selectGroups}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TransferList
                  onSelect={onSelectProduct}
                  rawList={rawList}
                  hasProduct={hasProductList}
                  onOpenedHandle={onOpenedHandle}
                  selectAll
                />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography style={{ fontWeight: "bold" }}>
                  Formas de Pagamento
                </Typography>
                <Divider />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel
                      label="Dinheiro"
                      name="payMoney"
                      value={payMoney}
                      control={
                        <GreenSwitch
                          checked={payMoney}
                          onChange={(e) => setPayMoney(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Débito"
                      name="payDebit"
                      value={payDebit}
                      control={
                        <GreenSwitch
                          checked={payDebit}
                          onChange={(e) => setPayDebit(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Crédito"
                      name="payCredit"
                      value={payCredit}
                      control={
                        <GreenSwitch
                          checked={payCredit}
                          onChange={(e) => setPayCredit(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Pix"
                      name="payPix"
                      value={payPix}
                      control={
                        <GreenSwitch
                          checked={payPix}
                          onChange={(e) => setPayPix(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      disabled
                      label="Cashless"
                      name="payCashless"
                      value={payCashless}
                      control={
                        <GreenSwitch
                          checked={payCashless}
                          onChange={(e) => setPayCashless(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Múltiplo"
                      name="payMulti"
                      value={payMulti}
                      control={
                        <GreenSwitch
                          checked={payMulti}
                          onChange={(e) => setPayMulti(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                </Grid>
                {/* <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel
                      label="Taxa de serviço"
                      name="hasServiceTax"
                      value={hasServiceTax}
                      control={
                        <GreenSwitch
                          checked={hasServiceTax}
                          onChange={(e) => setHasServiceTax(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  {hasServiceTax && (
                    <Grid item lg md sm xs>
                      <TextField
                        label="%"
                        name="serviceTax"
                        value={serviceTax}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 3)
                          setServiceTax(
                            value > 100 ? 100 : value === "" ? 0 : value
                          )
                        }}
                        error={Boolean(errorsVerify?.serviceTax)}
                        helperText={errorsVerify?.serviceTax}
                        variant="outlined"
                        // type="number"
                        size="small"
                      />
                    </Grid>
                  )}
                </Grid> */}

                <Grid
                  item
                  container
                  spacing={2}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                >
                  <Grid container spacing={2}>
                    <Grid item justify="center">
                      <FormControlLabel
                        label="Taxa de serviço"
                        name="hasCommission"
                        value={hasCommission}
                        control={
                          <GreenSwitch
                            checked={hasCommission}
                            onChange={(e) => setHasCommission(e.target.checked)}
                          />
                        }
                      />
                    </Grid>
                    {hasCommission && (
                      <Grid item lg md sm xs>
                        <TextField
                          label="%"
                          name="commission"
                          value={commission}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 3)
                            setCommission(
                              value > 100 ? 100 : value === "" ? 0 : value
                            )
                          }}
                          error={Boolean(errorsVerify?.commission)}
                          helperText={errorsVerify?.commission}
                          variant="outlined"
                          // type="number"
                          size="small"
                          disabled={!hasCommission}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography style={{ fontWeight: "bold" }}>
                  Modo de impressão
                </Typography>
                <Divider />
              </Grid>

              <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
                <TextField
                  label="Selecione"
                  name="printMode"
                  value={printMode}
                  onChange={(e) => setPrintMode(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  select
                >
                  <MenuItem value="ficha">Ficha</MenuItem>
                  <MenuItem value="recibo">Recibo</MenuItem>
                </TextField>
              </Grid>

              {printMode == "recibo" && (
                <Grid item>
                  <FormControlLabel
                    label="Imprimir 2 Vias do Recibo"
                    name="viaProduction"
                    value={viaProduction}
                    control={
                      <GreenSwitch
                        checked={viaProduction}
                        onChange={(e) => setViaProduction(e.target.checked)}
                      />
                    }
                  />
                </Grid>
              )}

              <Grid
                item
                xl={12}
                lg={12}
                md={6}
                sm={12}
                xs={12}
                style={{ marginBottom: 12 }}
              >
                <Grid container direction="row" spacing={2}>
                  <Grid
                    style={{ textAlign: "center" }}
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={6}
                  >
                    <ImagePicker
                      label="Logomarca específica para impressão neste dispositivo"
                      name="image"
                      inputRef={register}
                      image={photo ?? image}
                      setImage={handleImage}
                    />
                    <small>Tamanho: 262×100 (png)</small>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography style={{ fontWeight: "bold" }}>
                  Configurações Gerais
                </Typography>
                <Divider />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel
                      label="Permite Estorno"
                      name="allowCashback"
                      value={allowCashback}
                      control={
                        <GreenSwitch
                          checked={allowCashback}
                          onChange={(e) => setAllowCashback(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Permite Cortesias"
                      name="allowCourtesy"
                      value={allowCourtesy}
                      control={
                        <GreenSwitch
                          checked={allowCourtesy}
                          onChange={(e) => setAllowCourtesy(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Permite Impressão 2via"
                      name="allowDuplicate"
                      value={allowDuplicate}
                      control={
                        <GreenSwitch
                          checked={allowDuplicate}
                          onChange={(e) => setAllowDuplicate(e.target.checked)}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>

              {hasCashlessConfig && (
                <>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography style={{ fontWeight: "bold" }}>
                      Operação Cashless
                    </Typography>
                    <Divider />
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <FormControlLabel
                          label="Opera Cashless"
                          name="hasCashless"
                          value={hasCashless}
                          control={
                            <GreenSwitch
                              checked={hasCashless}
                              onChange={(e) => setHasCashless(e.target.checked)}
                            />
                          }
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          label="Imprime Recibo"
                          name="printReceipt"
                          value={printReceipt}
                          control={
                            <GreenSwitch
                              checked={printReceipt}
                              onChange={(e) =>
                                setPrintReceipt(e.target.checked)
                              }
                              disabled={!hasCashless}
                            />
                          }
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          label="Permite Devolução"
                          name="allowRefound"
                          value={allowRefound}
                          control={
                            <GreenSwitch
                              checked={allowRefound}
                              onChange={(e) =>
                                setAllowRefound(e.target.checked)
                              }
                              disabled={!hasCashless}
                            />
                          }
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          label="Permite Estorno"
                          name="allowCashbackCashless"
                          value={allowCashbackCashless}
                          control={
                            <GreenSwitch
                              checked={allowCashbackCashless}
                              onChange={(e) =>
                                setAllowCashbackCashless(e.target.checked)
                              }
                              disabled={!hasCashless}
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  {idOperator !== "new" && idOperator !== "clone" ? (
                    <Grid item>
                      <Button
                        onClick={() => setResetPassword(idOperator)}
                        variant="outlined"
                        color="secondary"
                      >
                        Trocar senha
                      </Button>
                    </Grid>
                  ) : null}
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => handleSubmit()}
                      variant="outlined"
                      color="primary"
                    >
                      {buttonLoading ? (
                        <CircularProgress size={25} />
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
      <ModalResetPassword
        id={resetPassword}
        onClose={() => setResetPassword(null)}
      />
    </>
  )
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(Operator)
