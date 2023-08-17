import React, { memo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Delete';
import Utils from '../../utils/index';

const ImagePicker = ({ label = '', image, setImage, ...props }) => {
  const [imagePreview, setImagePreview] = useState(image);
  const handleClear = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSelect = (e) => {
    try {
      const element = new Utils().getParentElementUntilFindElement(e.target, '.inputFile input');
      element.click();
    } catch (error) {
      alert(error?.message ?? 'Erro ao selecionar imagem');
    }
  };

  const handleFileLoad = (e) => {
    let photo = e.target.files[0];
    if (photo) {
      const nameType = `${photo.name}`.split('.');
      if(nameType.length == 0 || (nameType[nameType.length-1].toLocaleLowerCase() != 'jpg' && nameType[nameType.length-1].toLocaleLowerCase() != 'jpeg') && nameType[nameType.length-1].toLocaleLowerCase() != 'png') {
        alert('Arquivo inválido. Você precisa selecionar um arquivo de imagem')
        return;
      }
      const reader = new FileReader();

      reader.onload = (ee) => {
        setImagePreview(ee.target.result);
      };
      
      reader.readAsDataURL(photo);

      setImage(photo);
    }
  };

  return (
    <Card style={{ height: '100%' }}>
      {!image && <CardHeader subheader={label} />}
      <CardContent>
        <CardMedia image={imagePreview} style={image ? { paddingTop: '50%', backgroundSize: 'contain' } : {}} />
        <TextField
          {...props}
          type='file'
          className='inputFile'
          style={{ display: 'none' }}
          accept='image/png, image/jpg, image/jpeg'
          onChange={handleFileLoad}
        />
        {image && <Typography variant='caption'>{label}</Typography>}
      </CardContent>
      <CardActions>
        {image ? (
          <>
            <IconButton onClick={handleSelect}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleClear}>
              <RemoveIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={handleSelect}>
            <AddIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default memo(ImagePicker);
