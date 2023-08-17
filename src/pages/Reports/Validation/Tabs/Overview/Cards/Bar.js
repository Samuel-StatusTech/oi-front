import React, { memo } from 'react';

import { Card, CardContent } from '@material-ui/core';

//components
import Ranking from '../../../../../../components/Ranking';
import useStyles from '../../../../../../global/styles';

export default memo(({top5List}) => {
  const styles = useStyles();
  return (
    <Card className={styles.fullHeight}>
      <CardContent>
        <Ranking title='Mais Validados' ranking={top5List.map(item => ({
          label: item.name,
          value: item.validados
        }))} />
      </CardContent>
    </Card>
  );
});
