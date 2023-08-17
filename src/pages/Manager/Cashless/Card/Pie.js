import React, { useRef, useEffect, useState, memo } from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';

import Pie from '../../../../components/Chart/Pie';

const colors = ['#FE2265', '#4C7', '#FFAA15', '#303132', '#3A82F8'];

export default memo(({ title, content, topList = [] }) => {
  const [height, setHeight] = useState(80);
 
  const cardRef = useRef(null);

  useEffect(() => {
    const height = cardRef.current.offsetHeight;

    setHeight(height || 0);
  }, [cardRef]);

  return (
    <Card style={{ height: '100%' }}>
      <CardContent style={{ height: '100%' }} ref={cardRef}>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography
              style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 20 }}
            >
              Mais vendidos
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row">
              <Grid item lg={5} md={5} sm={5} xs={5}>
                {topList.map((item, index) => (
                  <Grid container spacing={2} direction="row">
                    <Grid item>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: colors[index],
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography style={{ fontWeight: 'bold' }}>
                        {item.name}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Grid item lg={7} md={7} sm={7} xs={7}>
                <Pie
                  width="100"
                  height="50"
                  data={{
                    labels: topList.map((item) => item.name),
                    datasets: [
                      {
                        label: 'Mais vendidos',
                        backgroundColor: colors,
                        data: [10, 10, 10],
                      },
                    ],
                  }}
                  // options={{ maintainAspectRatio: false }}
                  redraw
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});
