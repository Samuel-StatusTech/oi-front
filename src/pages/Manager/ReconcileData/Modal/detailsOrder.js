import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, DialogActions, Grid } from '@material-ui/core';
import Api from '../../../../api';
import EaseGrid from '../../../../components/EaseGrid/index';
import { formatDatetime } from '../../../../utils/date';
import { format } from 'currency-formatter';
const ModalDetailsOrder = ({ show, onClose, order_id, detailsOrderDataId, event }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [hasCancelData, setHasCancelData] = useState(false);
  const columns = [
    { title: 'Produto', field: 'product_name' },
    { title: 'QR Code', field: 'qr_code' },
    {
      title: 'Valor',
      field: 'price_unit',
      render({ price_unit, parent_id }) {
        if (parent_id) return null;
        return format(price_unit / 100, { code: 'BRL' });
      },
    },
    {
      title: 'Validado Em',
      field: 'date_validated',
      render: ({ date_validated }) => {
        return !date_validated ? null : formatDatetime(date_validated);
      },
    },
    { title: 'Cancelado Por', field: 'canceled_by', hidden: !hasCancelData },
    {
      title: 'Data/Hora Cancelado',
      field: 'canceled_date',
      render({ canceled_date }) {
        return !canceled_date ? null : formatDatetime(canceled_date);
      },
      hidden: !hasCancelData,
    },
    { title: 'Cancelamento', field: 'canceled_location', hidden: !hasCancelData },
    {
      title: 'Status',

      render({ status }) {
        return status == 'validado' ? 'Validado' : (status == 'cancelamento' ? 'Cancelado' : 'Pendente');
      },
    },
    /*{
      title: 'Ações',
      render: (row) => {
        if (row.parent_id) return null;
        return row.status === 'cancelamento' ? (
          <Button
            variant='outlined'
            size='small'
            color='secondary'
            className='uncancelSingleProduct'
            value={row.tableData.id}
          >
            Desfazer
          </Button>
        ) : (
          <Button
            className='cancelSingleProduct'
            variant='outlined'
            size='small'
            color='secondary'
            value={row.tableData.id}
          >
            Cancelar
          </Button>
        );
      },
    },*/
  ];

  useEffect(() => {
    if (!show) {
      setData([]);
      setHasCancelData(false);
    } else {
      if (order_id != null) {
        updateDetails();
      }
    }
  }, [show]);
  useEffect(() => {
    window.addEventListener('click', handleEventClick);
    return () => {
      window.removeEventListener('click', handleEventClick);
    };
  }, [data]);
  const handleEventClick = (event) => {
    const target = event.target;
    if (target.closest('.cancelSingleProduct')) {
      handleCancelSingleProduct(target.closest('.cancelSingleProduct')?.value);
    } else if (target.closest('.uncancelSingleProduct')) {
      handleUncancelSingleProduct(target.closest('.uncancelSingleProduct')?.value);
    }
  };
  const handleCancelSingleProduct = async (index) => {
    const currentData = data[index];
    try {
      setLoading(true);
      let newData = data;
      if (currentData?.id) {
        const updatedData = await Api.patch(`/order/cancelSingleOrderCombo/${currentData.id}`, {
          combo_group: currentData.combo_group,
          order_id,
          canceled_location: 'web',
        });
        newData[index] = updatedData.data;
      } else {
        const updatedData = await Api.patch(`/order/cancelSingleOrder`, {
          qr_code: currentData.qr_code,
          order_id,
          canceled_location: 'web',
        });
        newData[index] = updatedData.data;
      }
      setHasCancelData(true);
      setData(newData);
    } catch (err) {
      alert(err?.message ?? 'Ocorreu um erro ao pegar os dados da transação');
    } finally {
      setLoading(false);
    }
  };
  const handleUncancelSingleProduct = async (index) => {
    const currentData = data[index];
    try {
      setLoading(true);
      let newData = data;
      if (currentData?.id) {
        const updatedData = await Api.patch(`/order/uncancelSingleOrderCombo/${currentData.id}`, {
          combo_group: currentData.combo_group,
          order_id,
        });
        newData[index] = updatedData.data;
      } else {
        const updatedData = await Api.patch(`/order/uncancelSingleOrder`, { qr_code: currentData.qr_code, order_id });
        newData[index] = updatedData.data;
      }
      setData(newData);
    } catch (err) {
      alert(err?.message ?? 'Ocorreu um erro ao pegar os dados da transação');
    } finally {
      setLoading(false);
    }
  };
  const updateDetails = async () => {
    try {
      setLoading(true);
      const detailsOrder = await Api.get(`/order/getDetailsOrder/${detailsOrderDataId}?event=${event}`);
      setHasCancelData(detailsOrder.data.hasCancelData);
      setData(detailsOrder.data.orders);
    } catch (err) {
      alert(err?.message ?? 'Ocorreu um erro ao pegar os dados da transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Detalhes Transação - {detailsOrderDataId}</DialogTitle>
      <DialogContent>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <EaseGrid
            columns={columns}
            data={data}
            isLoading={loading}
            parentChildData={(row, rows) => rows.find((a) => a.id + a.combo_group === row.parent_id + row.combo_group)}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='secondary' onClick={() => onClose()}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDetailsOrder;
