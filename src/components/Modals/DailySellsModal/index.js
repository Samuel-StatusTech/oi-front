/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
} from "@material-ui/core"
import EaseGrid from "../../../components/EaseGrid"
import { setSizeOptions } from '../../../utils/tablerows'

import useStyles from "../../../global/styles"
import { formatDate } from "../../../utils/date"

const DailySellsModal = ({ show, closeFn, data, date }) => {
  const styles = useStyles()

  const closeModal = () => {
    closeFn()
  }

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="lg">
      <DialogTitle>Vendas online pela loja virtual {!!date ? ` - ${formatDate(date)}` : ""}</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxHeight: "60vh",
          }}
        >
          <EaseGrid
            className={styles.paddingT30}
            title={null}
            data={data.list}
            columns={data.columns}
            pageSize={data.list.length}
            pageSizeOptions={setSizeOptions(data.list.length)}
            paging={true}
            hasSearch={false}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 24,
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              closeModal()
            }}
          >
            Fechar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default DailySellsModal
