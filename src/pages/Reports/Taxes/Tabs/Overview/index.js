import React, { useState, useEffect, useRef } from "react"
import { Grid, Card, CircularProgress } from "@material-ui/core"

import Api from "../../../../../api"
import { format } from "currency-formatter"

import { Between } from "../../../../../components/Input/DateTime"
import EaseGrid from "../../../../../components/EaseGrid/index"
import Bar from "../../../../../components/Chart/Bar"
import CardValue from "./CardValue"

export default (props) => {
  const [loading, setLoading] = useState(false)
  const { type: productType, event, selected, onSelectType } = props
  const [operatorsList, setOperatorsList] = useState([])
  const [operatorsData, setOperatorsData] = useState([])
  const columns = [
    { title: "Operador", field: "name" },
    { title: "É garçom", field: "isWaiter", type: "boolean" },
    {
      title: "Taxa / Comissão",
      field: "commission",
      render: ({ commission }) => <span>{`${commission}%`}</span>,
    },
    {
      title: "Total de vendas",
      field: "sales",
      render: ({ sales }) => <span>{`${format(sales, { code: "BRL" })}`}</span>,
    },
    {
      title: "Total de comissão",
      field: "value",
      render: ({ value }) => (
        <span>{`${format(value / 100, { code: "BRL" })}`}</span>
      ),
    },
  ]

  const [dateIni, setDateIni] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())

  const [cardInfo, setCardInfo] = useState({})
  const [payment, setPayment] = useState({
    money: 0,
    credit: 0,
    debit: 0,
    pix: 0,
  })
  const cancelTokenSource = useRef()

  useEffect(() => {
    setLoading(true)
    Api.get(`/operator/getList`).then(async ({ data }) => {
      if (data.success) {
        const salesData = await Api.get(
          `/statistical/saleOperations/${event}?type=all`
        ).then(({ data }) => data)

        salesData.list.forEach((opSalesData) => {
          const opId = data.operators.findIndex(
            (o) => o.name === opSalesData.name
          )
          if (opId > -1) {
            data.operators[opId].totalSales = opSalesData.sales
          }
        })

        setOperatorsList(data.operators)
      } else {
        alert("Erro ao buscar a lista de operadores")
      }
    })
  }, [])

  const generatePromise = (operator) =>
    Api.get(`/operator/getData/${operator.id}`).then(({ data }) => data)

  const handleSearch = async () => {
    try {
      if (event) {
        let promises = []

        operatorsList.forEach(async (op) => {
          promises.push(generatePromise(op))
        })

        Promise.all(promises).then((dataList) => {
          let resumedData = []

          dataList.forEach(({ operator: opData }) => {
            if (opData.has_commission) {
              const opSalesId = operatorsList.findIndex(
                (o) => o.name === opData.name
              )
              if (opSalesId > -1) {
                opData.sales = operatorsList[opSalesId].totalSales
              }

              const neededData = {
                name: opData.name,
                isWaiter: Boolean(opData.is_waiter),
                commission: Number(opData.commission) ?? 0,
                sales: opData.sales / 100,
                value: (opData.sales / 100 / 100) * opData.commission,
              }

              resumedData.push(neededData)
            }
          })

          setOperatorsData(resumedData)
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (selected != 2) {
      onSearch()
    }
  }, [event, operatorsList])

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
    <Grid container direction="column" spacing={2}>
      <Grid item container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
              <EaseGrid columns={columns} data={operatorsData} pageSize={10} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
