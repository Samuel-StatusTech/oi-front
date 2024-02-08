import React, { memo, useEffect, useState, useRef } from "react"
import {
  Grid,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
} from "@material-ui/core"

import Painel from "./Painel"
import Api from "../../../../../api"
import axios from "axios"
import { Between } from "../../../../../components/Input/DateTime"
import { formatDateTimeToDB } from "../../../../../utils/date"

const Operators = ({ type, event }) => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [dateIni, setDateIni] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())
  const [selected, onSelectType] = useState(1)
  const [groupList, setGroupList] = useState([])
  const [group, setGroup] = useState("all")
  const cancelTokenSource = useRef()

  useEffect(() => {
    if (selected != 2) {
      onSearch()
    }
  }, [event, type, group, selected])

  useEffect(() => {
    Api.get("/group/getList").then(({ data }) => {
      if (data.success) {
        setGroupList(data.groups)
      } else {
        alert("Erro ao buscar a lista de grupos")
      }
    })
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

  const getMachSells = (mach) => {
    const dateIniFormatted = formatDateTimeToDB(dateIni)
    const dateEndFormatted = formatDateTimeToDB(dateEnd)
    const dateURL =
      selected !== 1
        ? `&date_ini=${dateIniFormatted}&date_end=${dateEndFormatted}`
        : ""

    return new Promise(async (resolve) => {
      const url = `/order/getList/${event}?status=todos&type=todos&operator=${mach.user.id}&per_page=1000000&page=0${dateURL}`
      const sells = await Api.get(url)
      const res = {
        ...mach,
        orders: sells.data.orders,
      }
      
      resolve(res)
    })
  }

  const parseMoney = (v) => Number(v) / 100

  const getUnitaryTotal = (t) => {
    // return new Promise((resolve) => {
      let details = {
        money: 0,
        debit: 0,
        credit: 0,
        pix: 0,
      }

      t.orders.forEach((o, k) => {
        if (o.status === "cancelamento") {
          if (k < t.orders.length - 1) return
        } else {
          o.payments.forEach((p) => {
            switch (p.payment_type) {
              case "credito":
                details.credit = details.credit + parseMoney(p.price) * 100
                break
              case "debito":
                details.debit = details.debit + parseMoney(p.price) * 100
                break
              case "pix":
                details.pix = details.pix + parseMoney(p.price) * 100
                break
              case "dinheiro":
                details.money = details.money + parseMoney(p.price) * 100
                break
            }
          })
        }
        
      })

      return details
  }

  const handleSearch = () => {
    setLoading(true)
    if (event) {
      const dateIniFormatted = formatDateTimeToDB(dateIni)
      const dateEndFormatted = formatDateTimeToDB(dateEnd)
      const dateURL =
        selected !== 1
          ? `&date_ini=${dateIniFormatted}&date_end=${dateEndFormatted}`
          : ""
  
      const groupURL = group && group != "all" ? `&group_id=${group}` : ""

      cancelTokenSource.current = axios.CancelToken.source()

      Api.get(`/statistical/saleDetails/${event}?type=${type}${groupURL}${dateURL}`, {
        cancelToken: cancelTokenSource.current.token,
      })
        .then(async ({ data: allDetails }) => {
          
          if (allDetails) {
            setUsers([])
            let promises = []

            for (const idx in allDetails)
              promises.push(getMachSells(allDetails[idx]))

            await Promise.all(promises)
              .then(async (data) => {
                
                let dList = []

                data.map(async d => {
                  
                  const products = []
                  for (const key in d.products) {
                    let productIdx = -1
                    if (d.products[key].productVariable) {
                      for (const pIdx in products) {
                        if (
                          products[pIdx].product_name ==
                            d.products[key].product_name &&
                          products[pIdx].productId ==
                            d.products[key].productId
                        ) {
                          productIdx = pIdx
                          break
                        }
                      }
                    }
                    if (productIdx < 0) {
                      products.push(d.products[key])
                    } else {
                      products[productIdx].quantity +=
                        d.products[key].quantity
                      products[productIdx].price_total =
                        Number(products[productIdx].price_total) +
                        Number(d.products[key].price_total)
                      products[productIdx].price_unit = "Variável"
                    }
                  }

                  d.products = products
                  d.payments = getUnitaryTotal(d)

                  dList.push(d)
                })

                setUsers(
                  data.sort((a, b) => a.user.name.localeCompare(b.user.name))
                )
              })

            setLoading(false)
          } else {
            setLoading(false)
          }
        })
    }
  }

  return (
    <Grid container direction="column" spacing={2}>
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
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            {users.map(({ user, products, payments, operations }) => {
              const total = payments.money + payments.debit + payments.credit + payments.pix

              return total > 0 ?(
                <Grid item key={user.id}>
                  <Painel
                    userKey={user.id}
                    event={event}
                    dateIni={selected !== 1 ? formatDateTimeToDB(dateIni) : ""}
                    dateEnd={selected !== 1 ? formatDateTimeToDB(dateEnd) : ""}
                    title={user.name}
                    type={type}
                    data={products}
                    payments={payments}
                    operations={operations}
                    group={group}
                  />
                </Grid>
              ) : null
            })}
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

export default memo(Operators)
