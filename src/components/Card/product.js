import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, CardHeader, IconButton } from '@material-ui/core';
import { format } from 'currency-formatter';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import imagePlaceholder from '../../assets/images/example.png';
import combo from '../../assets/images/default_image_combo.svg';
import estacionamento from '../../assets/images/default_image_park.svg';
import bar from '../../assets/images/default_image_bar.svg';
import ingresso from '../../assets/images/default_image_ticket.svg';
import unknown from '../../assets/images/default_image_unknown.svg';
import useStyles from '../../global/styles';
const CardProduct = ({ id, type, name, price_sell, image, group, status, warehouse_type, quantity, handleDelete }) => {
  const styles = useStyles();
  const history = useHistory();
  const editType = {
    combo: '/dashboard/product/combo',
    complement: '/dashboard/product/complement',
  };
  const imagesPlaceholder = {
    combo,
    bar,
    estacionamento,
    ingresso,
  };
  const handleEdit = () => {
    const url = editType?.[type] ? `${editType[type]}/${id}` : `/dashboard/product/simple/${id}`;
    console.log(url);
    history.push(url);
  };

  return (
    <Grid item lg={2} md={3} sm={4} xs={12}>
      <Card className={styles.cardContainer}>
        <CardContent className={styles.textCenter}>
          <Grid container className={styles.relative}>
            <Grid item xs={12} alignItems='flex-end' style={{position:'absolute', right: '0px'}}>
            <IconButton
              aria-label='settings'
              
              style={{ backgroundColor: '#000' }}
              onClick={handleEdit}
            >
              <EditIcon style={{ fill: '#fff', fontSize: 16 }} />
            </IconButton>
            <IconButton
              aria-label='settings'
             
              style={{ backgroundColor: '#fff' }}
              onClick={handleDelete}
            >
              <DeleteIcon style={{ fill: 'red', fontSize: 25 }} />
            </IconButton>
            </Grid>
            <Grid item xs={12}>
            <img
              className={styles.imgCardProduct}
              src={image ? image : imagesPlaceholder?.[type] ?? unknown}
              alt='Imagem do Produto'
            />
            </Grid>
            
      
          </Grid>

          <Typography className={`${styles.h2}`}>{name}</Typography>
          <Typography className={`${styles.h2}`}>{group.name}</Typography>

          <Typography align='center' className={styles.label}>
            {format(price_sell / 100, { code: 'BRL' })}
          </Typography>
          {(warehouse_type == 'soldOut' || (warehouse_type == 'controled' && quantity == 0)) &&
            <Typography style={{color:'white', backgroundColor: 'red', height: 24, borderRadius: 12, textAlign: 'center'}}>Esgotado</Typography>
          }
          {status ?
            <Typography className={`${styles.h2}`} style={{color:'green'}}>{ "Ativo"}</Typography>
          :
            <Typography className={`${styles.h2}`} style={{color:'red'}}>{ "Inativo"}</Typography>
          }
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CardProduct;
