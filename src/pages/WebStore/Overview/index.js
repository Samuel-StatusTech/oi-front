/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react"
import { connect, useStore } from "react-redux"
import { store } from "../../../store/index"
import Overview from "./Tabs/Overview"

import Api from "../../../api"

export const releasesPerPage = 100

const WSOverview = ({ event }) => {

  const [eventData, setEventData] = useState(null)

  const { user } = useStore(store).getState("user")

  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [histData, setHistData] = useState([])

  const [prodList, setProdList] = useState([])
  const [payment, setPayment] = useState({
    gross: {
      money: 0,
      credit: 0,
      debit: 0,
      pix: 0,
    },
    net: {
      credit: 0,
      debit: 0,
      pix: 0,
    },
    withdraw: 0
  })
  const [withdraw, setWithdraw] = useState(0)

  const toggleModal = () => {
    if (showReleaseModal) setShowReleaseModal(false)
    else setShowReleaseModal(true)
  }

  const editSingle = (info) => {
    setShowReleaseModal(true)
  }

  const calcCards = (orders) => {
    let data = {
      gross: { money: 0, credit: 0, debit: 0, pix: 0 },
      net: { credit: 0, debit: 0, pix: 0 }
    }

    orders.forEach(o => {
      o.payments.forEach(p => {
        switch (p.payment_type) {
          case "pix":
            data.gross.pix += p.price
            break;
          case "credit":
            data.gross.credit += p.price
            break;
          default:
            break;
        }
      })
    })

    setPayment(data)
  }

  const calcProds = (tickets = []) => {

    try {

      let prodsObjList = {}

      tickets.forEach((prodItem) => {
        if (!prodsObjList[prodItem.eccommerce_product_id]) prodsObjList[prodItem.eccommerce_product_id] = { ...prodItem, sold_quantity: 0 }
      })


      if (tickets.length > 0) {
        tickets.forEach((prodItem) => {
          prodsObjList[prodItem.eccommerce_product_id].sold_quantity += prodItem.sold_quantity
        })
      }

      const list = Object.values(prodsObjList).map(item => ({ ...item, price_total: item.sold_quantity * item.price_unit }))

      setProdList(list)
    } catch (error) {
      console.log("---error---", error)
    }
  }

  const loadHistory = (hist) => {
    const history = hist.map((d, k) => ({
      x: k,
      y: +d.price,
      qnt: d.qtde,
      timeLabel: new Date(d.dt).getTime()
    }))

    setHistData(history)
  }

  const loadData = useCallback(async (params = "") => {
    let dataPromises = []

    dataPromises.push(Api.get("/event/getSelect?status=todos").then(({ data }) => {
      const eData = data.events.find((ev) => ev.id === event)
      if (eData) {
        setEventData({
          ...eData,
          clientName: user.client_name,
          clientDocument: user.client_document,
        })
      }
    }))

    dataPromises.push(Api.get(`${event}/ecommerce/sells_dash${params}`).then(({ data }) => {
      loadHistory(data.sells)
      setWithdraw(data.validated_ticket_cash ?? 0)
    }))

    dataPromises.push(Api.get(`${event}/ecommerce/sells/tickets${params}`).then(({ data }) => {
      calcProds(data.tickets)
    }))

    dataPromises.push(Api.get(`${event}/ecommerce/orders${params}`).then(async ({ data }) => {
      let ods = []

      let pms = []
      data.orders.forEach(od => {
        pms.push(Api.get(`${event}/ecommerce/orders/${od.order_id}`).then(res => {
          ods.push(res.data)
        }))
      })

      await Promise.all(pms).then(() => {
        calcCards(ods)
      })
    }))

    await Promise.allSettled(dataPromises)
  }, [])

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Overview
        event={event}
        user={user}
        eventData={eventData}
        toggleModal={toggleModal}
        editSingle={editSingle}
        payment={{
          ...payment,
          withdraw
        }}
        productsList={prodList}
        histData={histData}
        loadData={loadData}
      />
    </div>
  )
}

const mapStateToProps = ({ event }) => ({ event })

export default connect(mapStateToProps)(WSOverview)
