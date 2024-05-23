import React, { memo } from 'react';

const AllowedContainer = ({ children, user, route }) => {
  // console.clear();
  const allow = route.allow;
  const security = user.roleData || {};

  if (!allow) {
    return <div>{children}</div>;
  }
  const isMaster = user.role === 'master';
  const isAdmin = user.role === 'admin' || !(user.roleData);
  const onlyMaster = allow.allow_only_master ?? false;
  const onlyAdmin = allow.allow_only_admin ?? false;
  const onlyEcommerce = allow.allow_only_ecommerce ?? false;

  const allowRegister =
    (allow.allow_register && allow.allow_register === security.allow_register) || !allow.allow_register;
  const allowOperation =
    (allow.allow_operation && allow.allow_operation === security.allow_operation) || !allow.allow_operation;
  const allowEcommerce =
    (allow.allow_ecommerce && allow.allow_ecommerce === security.allow_ecommerce) || !allow.allow_ecommerce;
    
  if (onlyEcommerce) {
    if (allowEcommerce) {
      if (onlyAdmin && isAdmin) {
        return <div>{children}</div>;
      } else if (!onlyAdmin) return <div>{children}</div>;
    }
  } else if (onlyMaster) {
    if (isMaster) {
      return <div>{children}</div>;
    }
  } else {
    if (isMaster || isAdmin || (allowRegister && allowOperation)) {
      return <div>{children}</div>;
    }
  }
  return <div>Voce não possui permissão para ver este módulo</div>;
};

export default memo(AllowedContainer);
