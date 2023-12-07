import React, { useState } from "react"
import { connect } from "react-redux"
import Overview from "./Tabs/Overview"
import ModalNewRelease from "../../components/Modals/NewRelease"

const FinancialStatement = ({ event }) => {
  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [singleInfo, setSingleInfo] = useState(null)
  const [releases, setReleases] = useState([])

  const insertRelease = (rInfo) => {
    const obj = {...rInfo, id: `${releases.length}`}
    const newArr = [...releases, obj]
    setReleases(newArr)
  }

  const updateRelease = (rInfo) => {

    const idx = releases.findIndex(r => r.id === rInfo.id)
    
    if(idx > -1) {
      let newArr = [...releases]
      newArr[idx] = rInfo
      setReleases(newArr)
    }
  }

  const deleteRelease = (rInfo) => {
    const newArr = releases.filter(r => r.id !== rInfo.id)
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
