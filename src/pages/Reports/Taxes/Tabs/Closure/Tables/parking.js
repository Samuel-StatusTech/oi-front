import React, { memo, useState, useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import { format } from "currency-formatter";

import EaseGrid from "../../../../../../components/EaseGrid";

import Api from "../../../../../../api";
import { formatDatetime } from "../../../../../../utils/date";
//import { formatDatetime } from "../../../../../../utils/date";

const ParkingTable = ({ type, event }) => {
  const [placa, setPlaca] = useState("");
  const [users, setUsers] = useState([]);

  let columns = [
    {
      title: "Placa",
      field: "name",
      render: () => "",
    },
    {
      title: "Operador",
      field: "name",
    },
    {
      title: "Emissão",
      field: "sales",
      render: ({ sales = 0 }) => format(sales / 100, { code: "BRL" }),
    },
    {
      title: "Produto",
      field: "product_name"
    },
    {
      title: "Valor",
      field: "price_total",
      render: ({ price_total = 0 }) => format(price_total / 100, { code: "BRL" }),
    },
    {
      title: "Data",
      field: "created_at",
      render: ({ created_at = 0 }) => formatDatetime(new Date(created_at)),
    },
  ];

  useEffect(() => {
    if (event) {
      Api.get(`/statistical/saleOperations/${event}?type=${type}`).then(
        ({ data }) => {
          if (data) {
            setUsers(data.list);
          }
        }
      );
    }
  }, [event, type]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <EaseGrid
          toolbar={() => (
            <TextField
              size="small"
              label="Buscar Placa"
              variant="outlined"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
            />
          )}
          columns={columns}
          data={users}
        />
      </Grid>
    </Grid>
  );
};

export default memo(ParkingTable);
