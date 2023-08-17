import React, { useState } from 'react';
import { Menu, MenuItem, Button } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { useHistory } from 'react-router-dom';
const UserButton = ({ user, onLogout }) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
        style={{ color: '#3B94FF', textTransform: 'capitalize' }}
        endIcon={<ArrowDropDown />}
      >
        Olá {user.name}
      </Button>

      <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => history.push('/dashboard/profile')}>Meu Perfil</MenuItem>
        <MenuItem onClick={() => onLogout()}>Sair</MenuItem>
      </Menu>
    </div>
  );
};

export default UserButton;
