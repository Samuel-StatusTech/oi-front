import React, { useEffect, useState } from "react"
import { connect, useStore } from "react-redux"
import { store } from "../../store/index"
import Overview from "./Tabs/Overview"
import ModalNewRelease from "../../components/Modals/NewRelease"

import Api from "../../api"

export const releasesPerPage = 100

const FinancialStatement = ({ event }) => {
  const [eventData, setEventData] = useState(null)

  const { user } = useStore(store).getState("user")

  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [singleInfo, setSingleInfo] = useState(null)
  const [releases, setReleases] = useState([])

  const insertRelease = async (rInfo) => {
    const add = await Api.post("/financialops", rInfo)
    if (add.status === 200) {
      const newArr = [add.data.financialop, ...releases]
      setReleases(newArr)
      return true
    } else {
      return false
    }
  }

  const updateRelease = async (rInfo) => {
    const add = await Api.put(`/financialops/${rInfo.id}`, rInfo)
    if (add.status === 200) {
      const newArr = [...releases].map((r) => (r.id !== rInfo.id ? r : rInfo))

      setReleases(newArr)
      return true
    } else {
      return false
    }
  }

  const deleteRelease = (rInfo) => {
    const newArr = releases.filter((r) => r.id !== rInfo.id)
    Api.delete(`/financialops/${rInfo.id}`)
    setReleases(newArr)
  }

  const toggleModal = () => {
    if (showReleaseModal) setShowReleaseModal(false)
    else setShowReleaseModal(true)
  }

  const editSingle = (info) => {
    setSingleInfo(info)
    setShowReleaseModal(true)
  }

  const concludeSingle = () => {
    setSingleInfo(null)
  }

  const getReleases = async () => {
    const req = await Api.get("/financialops", {
      params: {
        type: "todos",
        per_page: 100000,
        page: 1,
      },
    })

    return req.status === 200 ? req.data.financialop : []
  }

  useEffect(() => {
    if (user) {
      getReleases().then((ops) => setReleases(ops))

      Api.get("/event/getSelect?status=todos").then(({ data }) => {
        const eData = data.events.find((ev) => ev.id === event)
        if (eData) {
          setEventData({
            ...eData,
            clientName: user.client_name,
            clientDocument: user.client_document,
          })
        }
      })
    }
  }, [user, event])

  return (
    <>
      <ModalNewRelease
        show={showReleaseModal}
        closeFn={() => {
          setShowReleaseModal(false)
          concludeSingle()
        }}
        singleInfo={singleInfo}
        insertRelease={insertRelease}
        updateRelease={updateRelease}
      />
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
          deleteRelease={deleteRelease}
          releases={releases}
        />
      </div>
    </>
  )
}

const mapStateToProps = ({ event }) => ({ event })

export default connect(mapStateToProps)(FinancialStatement)
