import React from 'react';
import { Breadcrumbs, Link } from '@material-ui/core';

export default ({ paths = [], ...props }) => {
  console.log('props =>', props);

  return (
    <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: '0.4rem' }}>
      <Link color="textPrimary" /*href={`/dashboard/home`}*/ aria-current="page">
        Dashboard
      </Link>
      {paths.map((path, index) => (
        <Link
          key={index}
          color="textPrimary"
          //href={`/dashboard${path.route}`}
          aria-current="page"
        >
          {path.title}
        </Link>
      ))}
    </Breadcrumbs>
  );
};
