/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, memo } from "react"
import {
  Grid,
  Typography,
  CircularProgress,
  TextField,
} from "@material-ui/core"

import useStyles from "../../../../../global/styles"

import { format } from "currency-formatter"
import { formatDatetime, parseUrlDate } from "../../../../../utils/date"

import { Between } from "../../../../../components/Input/DateTime"
import EaseGrid from "../../../../../components/EaseGrid"
import WithdrawalDetailsModal from "../../../../../components/Modals/WithdrawalDetails"

// -----

const Statement = (props) => {
  const { loadData, event, sells } = props

  const styles = useStyles()

  const [loading, setLoading] = useState(false)
  const [selected, onSelectType] = useState(1)

  // Filters
  const [transaction, setTransaction] = useState("")
  const [ticket, setTicket] = useState("")
  const [batch, setBatch] = useState("")

  const [dateIni, setDateIni] = useState(new Date('2020-01-01'))
  const [dateEnd, setDateEnd] = useState(new Date().setHours(new Date().getHours() + 24))
  const [modal, setModal] = useState({ status: false, data: null })

  const cancelTokenSource = useRef()

  const sellsColumns = [
    {
      title: <Typography style={{ fontWeight: "bold" }}>Transação</Typography>,
      field: "order_id",
      render: ({ order_id }) => (
        <td>
          <span>{order_id}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Lote</Typography>,
      field: "batch_name",
      render: ({ batch_name }) => (
        <td>
          <span>{batch_name}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Ingresso</Typography>,
      field: "product_name",
      render: ({ product_name }) => (
        <td>
          <span>{product_name}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Data/Hora Venda</Typography>,
      field: "sell_date",
      render: ({ sell_date }) => {

        return (
          <td>
            <span>{formatDatetime(sell_date)}</span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Total</Typography>,
      field: "price_total",
      render: ({ price_total }) => {

        return (
          <td>
            <span>{format(+price_total / 100, { code: "BRL" })}</span>
          </td>
        )
      },
    },
  ]

  const handleSearch = async () => {
    try {
      setLoading(true)
      if (event) {

        let filters = ""

        const dateIniFormatted = parseUrlDate(dateIni)
        const dateEndFormatted = parseUrlDate(dateEnd)

        const dateURL =
          selected !== 1
            ? `?dateStart=${dateIniFormatted}&dateEnd=${dateEndFormatted}`
            : `?dateStart=2020-01-01&dateEnd=${parseUrlDate(new Date().setHours(new Date().getHours() + 24)).replace("/", "-")}`

        const transactionFilter = transaction ? `&order=${transaction.trim()}` : ""
        const orderFilter = ticket ? `&ticket=${ticket.trim()}` : ""
        const batchFilter = batch ? `&batch=${batch.trim()}` : ""

        filters = dateURL + transactionFilter + orderFilter + batchFilter

        loadData(filters)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSelectRow = (data) => {
    setModal({ status: true, data: data })
  }

  useEffect(() => {
    if (selected !== 2) {
      onSearch()
    }
  }, [event, selected])

  useEffect(() => {
    onSearch()
  }, [])

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
      {modal.data && (
        <WithdrawalDetailsModal
          show={modal.status}
          closeFn={() => setModal({ status: false, data: null })}
          data={modal.data}
          eventId={event}
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
            <Grid item lg={1} md={1} sm={12} xs={12}>
              <TextField
                value={transaction}
                onChange={(e) => setTransaction(e.target.value)}
                label='Transação'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={1} md={1} sm={12} xs={12}>
              <TextField
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                label='Ingresso'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={1} md={1} sm={12} xs={12}>
              <TextField
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                label='Lote'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>

            <Grid item lg={9} md={9} sm={12} xs={12}>
              <Between
                iniValue={dateIni}
                endValue={dateEnd}
                onChangeIni={setDateIni}
                onChangeEnd={setDateEnd}
                selected={selected}
                onSelectType={onSelectType}
                onSearch={onSearch}
                size="small"
                withdrawals={true}
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
              data={sells}
              columns={sellsColumns}
              hasSearch={false}
              onRowClick={(_, info) => {
                onSelectRow && onSelectRow(sells[info.tableData.id])
              }}
            />
          </Grid>
        )}
      </Grid>
    </>
  )
}


export default memo(Statement)