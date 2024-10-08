/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, memo } from "react"
import {
  Grid,
  Typography,
  CircularProgress,
  Button,
} from "@material-ui/core"

import useStyles from "../../../../../global/styles"

import { format } from "currency-formatter"
import { formatDate, parseUrlDate } from "../../../../../utils/date"

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
  const [dateIni, setDateIni] = useState(new Date('2020-01-01'))
  const [dateEnd, setDateEnd] = useState(new Date().setHours(new Date().getHours() + 24))
  const [modal, setModal] = useState({ status: false, data: null })

  const cancelTokenSource = useRef()

  const sellsColumns = [
    ...[
      {
        title: <Typography style={{ fontWeight: "bold" }}>Data Venda</Typography>,
        field: "sell_date",
        render: ({ sell_date }) => {

          return (
            <td>
              <span>{formatDate(sell_date)}</span>
            </td>
          )
        },
      },
      {
        title: <Typography style={{ fontWeight: "bold" }}>Valor R$</Typography>,
        field: "value",
        render: ({ value }) => {

          return (
            <td>
              <span>{format(+(value ?? 0) / 100, { code: "BRL" })}</span>
            </td>
          )
        },
      },
      {
        title: <Typography style={{ fontWeight: "bold" }}>Observação</Typography>,
        field: "observation",
        render: ({ observation }) => (
          <td>
            <span>{observation ?? ""}</span>
          </td>
        ),
      },
    ],
    ...((props.user.role === "master" || props.user.role === "admin") ? [
      {
        title: <Typography style={{ width: '100%', fontWeight: "bold", textAlign: "center" }}>Ações</Typography>,
        render: (row) => (
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                style={{ color: "#FEC87D", border: "1px solid #FEC87D" }}
                onClick={() => handleEdit(row.id)}
              >
                Editar
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                style={{ color: "#E7345B", border: "1px solid #E7345B" }}
                onClick={() => handleDelete(row.id)}
              >
                Excluir
              </Button>
            </Grid>
          </Grid>
        ),
      }
    ] : [])
  ]

  const handleNew = async (data) => {
    console.log(data)
  }

  const handleEdit = (withdrawalId) => {
    console.log(withdrawalId)
  }

  const handleUpdate = (updateInfo) => {
    // const { date, value, observation } = updateInfo

    // ...
  }

  const handleDelete = (withdrawalId) => {
    console.log(withdrawalId)
  }

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

        filters = dateURL

        loadData(filters)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSelectRow = (data) => {
    setModal({ status: true, data: data, saveAction: handleUpdate })
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

  const handleNewWithdrawal = () => {
    const dt = { date: new Date(), value: 0, observation: "" }

    setModal({ status: true, data: dt, saveAction: handleNew })
  }

  return (
    <>
      {modal.data && (
        <WithdrawalDetailsModal
          show={modal.status}
          closeFn={() => setModal({ status: false, data: null })}
          data={modal.data}
          onSave={modal.saveAction}
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
                withdrawals={true}
                buttonAction={handleNewWithdrawal}
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