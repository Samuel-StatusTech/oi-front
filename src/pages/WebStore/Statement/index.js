import React, { useCallback, useState } from "react"
import { connect, useStore } from "react-redux"
import { store } from "../../../store/index"
import Overview from "./Tabs/Overview"

import Api from "../../../api"

export const releasesPerPage = 100

const WSStatement = ({ event }) => {
  const [sells, setSells] = useState([])

  const { user } = useStore(store).getState("user")

  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [releases, setReleases] = useState([])
  const [taxControl, setTaxControl] = useState({
    has: 0,
    minimum: "0",
    percentage: "0",
    absolute: 0,
  })

  const deleteRelease = (rInfo) => {
    const newArr = releases.filter((r) => r.id !== rInfo.id)
    Api.delete(`/financialops/${rInfo.id}`)
    setReleases(newArr)
  }

  const toggleModal = () => {
    if (showReleaseModal) setShowReleaseModal(false)
    else setShowReleaseModal(true)
  }

  const getEventTaxes = async () => {
    // ecommerce
    const info = (await Api.get(`/ecommerce/getInfo?eventId=${event}`)).data
    setTaxControl({
      has: info.info.eCommerce.adminTax,
      minimum: info.info.eCommerce.adminTaxMinimum,
      percentage: Number(info.info.eCommerce.adminTaxPercentage) / 100 / 100,
      absolute: info.info.eCommerce.adminTaxValue
    })
  }

  const sumTaxes = ({
    adminTax,
    adminTaxValue,
    adminTaxPercentage,
    adminTaxMinimum,
    tickets,
  }) => {
    let total = 0
    const hasTax = adminTax
    const isTaxAbsolute = adminTaxValue !== 0

    if (hasTax) {
      const actives = tickets.filter((t) => Boolean(t.active))

      for (let i = 0; i < actives.length; i++) {
        const ticket = tickets[i]

        if (ticket.qnt > 0) {
          for (let i = 0; i < ticket.qnt; i++) {
            if (isTaxAbsolute) total += +adminTaxValue
            else {
              const percentage = +adminTaxPercentage / 100 / 100
              const taxMin = +adminTaxMinimum
              const calculedTax = Math.round(ticket.price_sell * percentage)

              const min = Math.max(taxMin, calculedTax)

              total += min
            }
          }
        }
      }
    }

    return total
  }


  const parseProducts = (tickets) => {
    const hasTax = taxControl.has
    const isTaxAbsolute = taxControl.absolute !== 0

    let list = []

    tickets.forEach(t => {

      if (hasTax) {
        if (isTaxAbsolute) {
          const obj = {
            ...t,
            tax: taxControl.absolute,
            price_total: t.price_total + taxControl.absolute
          }
          list.push(obj)
        } else {
          const percentage = +taxControl.percentage
          const taxMin = +taxControl.minimum
          const calculedTax = Math.round(t.price_sell * percentage)

          const min = Math.max(taxMin, calculedTax)

          const obj = {
            ...t,
            price_total: t.price_total + min,
            price_tax: min
          }
          list.push(obj)
        }
      } else {
        const obj = {
          ...t,
          tax: 0,
        }
        list.push(obj)
      }
    })

    setSells(list)
  }

  const loadData = useCallback(async (params) => {

    await getEventTaxes()

    Api.get(`/${event}/ecommerce/sells/extract${params ?? ""}`).then(({ data }) => {
      // parseProducts(data.tickets)
      setSells(data.tickets)
    })
  }, [event])

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Overview
        loadData={loadData}
        event={event}
        user={user}
        toggleModal={toggleModal}
        deleteRelease={deleteRelease}
        sells={sells}
        taxControl={taxControl}
      />
    </div>
  )
}

const mapStateToProps = ({ event }) => ({ event })

export default connect(mapStateToProps)(WSStatement)
