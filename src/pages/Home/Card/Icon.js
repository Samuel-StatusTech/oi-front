import React from 'react';

import useStyles from '../../../global/styles';

const RenderIcon = ({ icon, title }) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <img src={icon} />
      <label className={styles.h2}>{title}</label>
    </div>
  );
};

export default RenderIcon;
