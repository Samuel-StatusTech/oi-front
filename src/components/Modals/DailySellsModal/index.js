/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, memo, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Typography
} from "@material-ui/core"
import EaseGrid from "../../../components/EaseGrid"
import { setSizeOptions } from '../../../utils/tablerows'


// Table
import useStyles from "../../../global/styles"
import { formatDate } from "../../../utils/date"

// ---

const DailySellsModal = ({ show, closeFn, data, date, soldTickets }) => {

  const [tickets, setTickets] = useState([])

  const styles = useStyles()

  const closeModal = () => {
    closeFn()
  }

  const getDayTickets = (date) => {
    const list = Object.values(soldTickets[date]) ?? []

    return list
  }

  useEffect(() => {
    console.log("In props", soldTickets)
  }, [soldTickets])

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
            detailPanel={rowData => {

              const list = getDayTickets(rowData.timeString)
              
              return (
                <div style={{ padding: '20px', fontSize: '14px' }}>
                  <EaseGrid
                    className={styles.paddingT30}
                    title={"Detalhes"}
                    data={list}
                    columns={[
                      {
                        title: <Typography style={{ fontWeight: "bold" }}>Ingresso</Typography>,
                        field: "product_name",
                        render: ({ product_name }) => (
                          <td>
                            <span style={{ fontSize: "0.9rem" }}>{product_name}</span>
                          </td>
                        ),
                      },
                      {
                        title: <Typography style={{ fontWeight: "bold" }}>Quantidade</Typography>,
                        field: "sold_quantity",
                        render: ({ sold_quantity }) => (
                          <td>
                            <span style={{ fontSize: "0.9rem" }}>{sold_quantity}</span>
                          </td>
                        ),
                      }
                    ]}
                    pageSize={list.length}
                    pageSizeOptions={setSizeOptions(list.length)}
                    paging={false}
                    hasSearch={false}
                  />
                </div>
              )
            }}
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
