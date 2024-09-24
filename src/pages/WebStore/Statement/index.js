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

  const deleteRelease = (rInfo) => {
    const newArr = releases.filter((r) => r.id !== rInfo.id)
    Api.delete(`/financialops/${rInfo.id}`)
    setReleases(newArr)
  }

  const toggleModal = () => {
    if (showReleaseModal) setShowReleaseModal(false)
    else setShowReleaseModal(true)
  }

  const loadData = useCallback(async (params) => {

    Api.get(`/${event}/ecommerce/sells/extract${params ?? ""}`).then(({ data }) => {
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
      />
    </div>
  )
}

const mapStateToProps = ({ event }) => ({ event })

export default connect(mapStateToProps)(WSStatement)
