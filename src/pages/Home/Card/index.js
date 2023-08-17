import React from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';

const MainCard = ({ icon, title, children, style }) => {
  return (
    <Card style={{ height: '100%' }}>
      {title && <CardHeader title={
        (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={icon} style={{ width: '2.2em', marginRight: 5 }} alt='Ícone do evento' />
            <label>{title}</label>
          </div>
        )
        
        } style={style} />}
      <CardContent style={{ padding: '8px 16px' }}>{children}</CardContent>
    </Card>
  );
};

export default MainCard;
