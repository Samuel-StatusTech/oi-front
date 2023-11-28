import React, { useState } from "react"
import { connect } from "react-redux"
import Overview from "./Tabs/Overview"
import ModalNewRelease from "../../components/Modals/NewRelease"

const FinancialStatement = ({ event }) => {
  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [singleInfo, setSingleInfo] = useState(null)

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
        />
      </div>
    </>
  )
}

const mapStateToProps = ({ event }) => ({ event })

export default connect(mapStateToProps)(FinancialStatement)
