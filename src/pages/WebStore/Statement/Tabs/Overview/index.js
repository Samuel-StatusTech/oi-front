/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react"
import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  TextField,
  MenuItem
} from "@material-ui/core"

import useStyles from "../../../../../global/styles"

import axios from "axios"
import { format } from "currency-formatter"
import { formatDatetime } from "../../../../../utils/date"
import { setSizeOptions } from '../../../../../utils/tablerows'

import { Between } from "../../../../../components/Input/DateTime"
import SellDetailsModal from "../../../../../components/Modals/SellDetails"
import SendVoucherModal from "../../../../../components/Modals/SendVoucher"
import EaseGrid from "../../../../../components/EaseGrid"

const paymentTypesRelation = {
  credit: "Crédito",
  debit: "Débito",
  pix: "Pix"
}

const paymentRelation = {
  payed: "Pago",
  analysis: "Em análise",
  notApproved: "Não aprovado",
  cancelled: "Cancelado",
}

export default (props) => {
  const { event } = props

  const styles = useStyles()

  const [loading, setLoading] = useState(false)
  const [selected, onSelectType] = useState(1)

  // Filters
  const [transaction, setTransaction] = useState("")
  const [name, setName] = useState("")
  const [cpf, setCpf] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("todos")

  const [dateIni, setDateIni] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())
  const [editModal, setEditModal] = useState({ status: false, data: null })
  const [voucherModal, setVoucherModal] = useState({ status: false, data: null })

  const [sells, setSells] = useState({
    columns: [],
    list: []
  })

  const cancelTokenSource = useRef()

  const handleEdit = (sell) => {
    setEditModal({
      status: true,
      data: sell
    })
  }

  const handleSend = (sell) => {
    setVoucherModal({
      status: true,
      data: sell
    })
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      if (event) {
        // const dateIniFormatted = formatDateTimeToDB(dateIni)
        // const dateEndFormatted = formatDateTimeToDB(dateEnd)

        // const dateURL =
        //   selected !== 1
        //     ? `?date_ini=${dateIniFormatted}&date_end=${dateEndFormatted}`
        //     : ""

        cancelTokenSource.current = axios.CancelToken.source()
        // const { data } = await Api.get(
        //   `/statistical/financialOverview/${event}${dateURL}`,
        //   { cancelToken: cancelTokenSource.current.token }
        // )

        const prodsCols = [
          {
            title: <Typography style={{ fontWeight: "bold" }}>Transação</Typography>,
            field: "transaction",
            render: ({ transaction }) => (
              <td>
                <span>{transaction}</span>
              </td>
            ),
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Nome</Typography>,
            field: "name",
            render: ({ name }) => (
              <td>
                <span>{name}</span>
              </td>
            ),
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>CPF</Typography>,
            field: "cpf",
            render: ({ cpf }) => {

              return (
                <td>
                  <span>{cpf}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>E-mail</Typography>,
            field: "email",
            render: ({ email }) => {

              return (
                <td>
                  <span>{email}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Data/Hora Compra</Typography>,
            field: "date",
            render: ({ date }) => {

              return (
                <td>
                  <span>{formatDatetime(date)}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Pgto</Typography>,
            field: "payment",
            render: ({ payment }) => {

              return (
                <td>
                  <span>{paymentTypesRelation[payment]}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Total</Typography>,
            field: "total",
            render: ({ total }) => {

              return (
                <td>
                  <span>{format(total / 100, { code: "BRL" })}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Taxa</Typography>,
            field: "tax",
            render: ({ tax }) => {

              return (
                <td>
                  <span>{`${String((tax / 100).toFixed(2)).replace(".", ",")}%`}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Status</Typography>,
            field: "status",
            render: ({ status }) => {

              return (
                <td>
                  <span>{paymentRelation[status]}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold", textAlign: "center" }}>Opções</Typography>,
            field: "payment",
            render: (sell) => {

              return (
                <td>
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                  }}>
                    <Button style={{
                      color: "#FF7043"
                    }} onClick={() => handleEdit(sell)}>Editar</Button>
                    <Button style={{
                      color: "#3B94FF"
                    }} onClick={() => handleSend(sell)}>Enviar</Button>
                  </div>
                </td>
              )
            },
          },
        ]

        const prodsList = [
          {
            transaction: "ABC0123D",
            name: "Fulano legal",
            cpf: "123456789-0",
            email: "fulano@gmail.com",
            date: new Date(),
            payment: "credit",
            op_code: "19aje8",
            gateway: "PagSeguro",
            total: 12000,
            tax: 120,
            status: 'payed',
          },
          {
            transaction: "BBC0123D",
            name: "Fulano 2",
            cpf: "123456789-0",
            email: "fulano@gmail.com",
            date: new Date(),
            payment: "credit",
            op_code: "19aje8",
            gateway: "Transfeera",
            total: 12000,
            tax: 120,
            status: 'payed',
          },
          {
            transaction: "CBC0123D",
            name: "Fulano 3",
            cpf: "123456789-0",
            email: "fulano@gmail.com",
            date: new Date(),
            payment: "credit",
            op_code: "19aje8",
            gateway: "PagSeguro",
            total: 12000,
            tax: 120,
            status: 'payed',
          },
          {
            transaction: "DBC0123D",
            name: "Fulano 4",
            cpf: "123456789-0",
            email: "fulano@gmail.com",
            date: new Date(),
            payment: "credit",
            op_code: "19aje8",
            gateway: "PagSeguro",
            total: 12000,
            tax: 120,
            status: 'payed',
          },
        ]

        setSells({
          columns: prodsCols,
          list: prodsList
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = (changes) => {
    const { status, payment } = changes

    console.log({ status, payment })

    // update Api ...
  }

  const handleSendVoucher = (changes) => {
    const { status, payment } = changes

    console.log({ status, payment })

    // update Api ...
  }

  useEffect(() => {
    if (selected !== 2) {
      onSearch()
    }
  }, [event, selected])

  const onSearch = () => {
    if (cancelTokenSource && cancelTokenSource.current) {
      cancelTokenSource.current.cancel()
      setTimeout(() => {
        handleSearch()
      }, 500)
    } else {
      handleSearch()
    }
  }

  return (
    <>
      {editModal.data && (
        <SellDetailsModal
          show={editModal.status}
          closeFn={() => setEditModal({ status: false, data: null })}
          data={editModal.data}
          handleUpdate={handleUpdate}
        />
      )}

      {voucherModal.data && (
        <SendVoucherModal
          show={voucherModal.status}
          closeFn={() => setVoucherModal({ status: false, data: null })}
          data={voucherModal.data}
          handleSend={handleSendVoucher}
        />
      )}

      <Grid
        container
        direction="column"
        spacing={24}
        style={{
          height: "100%",
          gap: 24,
        }}
      >
        <Grid item lg={12} md={12} sm={12} xs={12}>

          {/* Filters */}
          <Grid item container spacing={2}>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <TextField
                value={transaction}
                onChange={(e) => setTransaction(e.target.value)}
                label='Transação'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                label='Nome'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <TextField
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                label='Cpf'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label='E-mail'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <TextField
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label='Status'
                variant='outlined'
                size='small'
                fullWidth
                select
              >
                <MenuItem value='todos'>Todos</MenuItem>
                <MenuItem value='payed'>Pago</MenuItem>
                <MenuItem value='analysis'>Em análise</MenuItem>
                <MenuItem value='notApproved'>Não aprovado</MenuItem>
                <MenuItem value='cancelled'>Cancelado</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Date */}
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Between
                iniValue={dateIni}
                endValue={dateEnd}
                onChangeIni={setDateIni}
                onChangeEnd={setDateEnd}
                selected={selected}
                onSelectType={onSelectType}
                onSearch={onSearch}
                size="small"
              />
            </Grid>
          </Grid>
        </Grid>

        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Grid item spacing={2} lg={12} md={12} sm={12} xs={12}>
            <EaseGrid
              className={styles.paddingT30}
              title={
                <div className={styles.flexRow}>
                  <Typography className={styles.h2}>Produtos vendidos</Typography>
                </div>
              }
              data={sells.list}
              columns={sells.columns}
              pageSize={sells.list.length}
              pageSizeOptions={setSizeOptions(sells.list.length)}
              paging={false}
              hasSearch={false}
            />
          </Grid>
        )}
      </Grid>
    </>
  )
}
