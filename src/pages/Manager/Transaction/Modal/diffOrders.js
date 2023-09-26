import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@material-ui/core';


const TableTh = ({ value, alignRight = false }) => {
  const style = { fontWeight: 'bold', color: 'black', whiteSpace: 'nowrap' }

  return (
    <TableCell style={style} align={alignRight ? 'right' : 'left'}>
      {value}
    </TableCell>
  )
}

const TableTd = ({ value, alignRight = false }) => {
  const style = { whiteSpace: 'nowrap' }

  return (
    <TableCell style={style} align={alignRight ? 'right' : 'left'}>
      {value}
    </TableCell>
  )
}


const ModalDiff = ({ show, onClose, data }) => {

  const padValue = (v) => {
    return String(v).padStart(2, '0')
  }

  const parseMoney = (v) => {
    return `R$ ${(Number(v) / 100).toFixed(2).replace('.', ',')}`
  }

  const parseDate = (v) => {
    const date = new Date(v)
    const
      d =
        `${padValue(date.getDate())}/` +
        `${padValue(date.getMonth())}/` +
        `${padValue(date.getFullYear())}`,
      h =
        `${padValue(date.getHours())}:` +
        `${padValue(date.getMinutes())}:` +
        `${padValue(date.getSeconds())}`

    return `${d} — ${h}`
  }


  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Transações com divergências</DialogTitle>
      <DialogContent>
        {data.length === 0 ?
          <CircularProgress />
          :
          <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
            <Table size="medium" aria-label="conflicting-data">
              <TableHead>
                <TableRow>
                  <TableTh value={'ID da transação'} />
                  <TableTh value={'Código QR'} />
                  <TableTh value={'Valor'} />
                  <TableTh value={'Data/Hora'} />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, k) => (
                  <TableRow
                    key={k}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableTd value={row.id} />
                    <TableTd value={'–'} />
                    <TableTd value={parseMoney(row.total_price)} />
                    <TableTd value={parseDate(row.created_at)} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        }
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='secondary' onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDiff;
