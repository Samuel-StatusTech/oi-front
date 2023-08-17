import React, { useRef, useEffect, useState, memo } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

import Bar from '../../../../components/Chart/Bar';

export default memo(({ title, content }) => {
  const [height, setHeight] = useState(80);
  const data = {
    labels: ['Dinheiro', 'Crédito', 'Débito'],
    datasets: [
      {
        label: 'Formas de pagamento',
        backgroundColor: ['#32CD32', '#FFB90F', '#FF6A6A'],
        hoverBackgroundColor: ['#00FF7F', '#FFD700', '#FF0000'],
        data: [20, 50, 30],
        barPercentage: 1,
      },
    ],
  };
  const options = {
    plugins: {
      datalabels: {
        display: true,
        color: '#606162',
        labels: {
          title: {
            formatter: (value, context) => value + '% - R$' + value * 100,
            color: '#fff',
            textStrokeWidth: 0.5,
          },
        },
      },
    },
  };
  const cardRef = useRef(null);

  useEffect(() => {
    const height = cardRef.current.offsetHeight;

    setHeight(height || 0);
  }, [cardRef]);

  return (
    <Card style={{ height: '100%' }}>
      <CardContent
        style={{ height: '100%', maxHeight: '200px', minHeight: '150px' }}
        ref={cardRef}
      >
        {/* <Grid item lg={3} md={6} sm={12} xs={12}>
          <Grid container> */}
        <Typography
          style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 20 }}
        >
          Formas de pagamento
        </Typography>
        <Bar
          data={data}
          height={height - 30}
          // options={{ maintainAspectRatio: false }}
          redraw
          options={options}
        />
        {/* </Grid>
        </Grid> */}
      </CardContent>
    </Card>
  );
});
