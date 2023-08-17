import React, { useState, useEffect } from 'react';
import {
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  DialogActions,
  Button,
} from '@material-ui/core';
import Api from '../../../../api';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import TransferList from '../../../../components/TransferList';

const Modal = ({ id, show, onClose }) => {
  const { handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState({});
  const [productList, setProductList] = useState([]);
  const [rawList, setRawList] = useState([]);

  useEffect(() => {
    if (!id) {
      return;
    }
    Api.get(`/list/getData/${id}`).then(({ data }) => {
      if (data.success) {
        setList(data.data);
        setRawList(data.data.product_list);
      } else {
        alert('Erro ao carregar os dados da lista');
      }
    });
  }, [id]);

  const handleConnect = async () => {
    try {
      if (loading) {
        return false;
      }
      setLoading(true);

      if (productList.length === 0) {
        alert(
          "Selecione ao menos um item ou desabilite a opção de 'Quero escolher'"
        );
        return false;
      }

      const { data } = await Api.put(`/list/updateList/${id}`, {
        ...list,
        product_list: productList,
      });

      if (data.success) {
        onClose();
      } else {
        alert('Erro ao criar a lista');
      }
    } catch (e) {
      console.log(e);
      alert('Erro ao criar a lista');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Dados da lista</DialogTitle>
      <form onSubmit={handleSubmit(handleConnect)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TransferList
                onSelect={setProductList}
                rawList={rawList}
                hasProduct
                visible
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {loading ? <CircularProgress size={25} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Modal);
