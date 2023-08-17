import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SearchIcon from '@material-ui/icons/Search';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import {
  Input,
  InputAdornment,
  IconButton,
  Typography,
  TextField,
  MenuItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: '100%',
    height: 300,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const CustomList = ({
  title,
  items,
  setItems,
  checked,
  setChecked,
  groupList = [],
  selectAll = false,
  isSearch = false,
  isGroupFilter = false,
  hasQuantity = false,
}) => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('todos');

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleQuantity = (id, qtd) => {
    setItems((data) =>
      data.map((d, i) => {
        if (d.id === id && qtd > 0) {
          const newValue = { ...d, qtd };
          handleToggle(newValue);
          return newValue;
        }
        return d;
      })
    );
  };

  const filteredItems = items.filter((value) =>
    isGroupFilter && group !== 'todos' ? value.group_id === group : true
  )

  return (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          selectAll ? (
            <Checkbox
              onClick={() => handleToggleAll(filteredItems)}
              checked={
                numberOfChecked(filteredItems) === filteredItems.length && filteredItems.length !== 0
              }
              indeterminate={
                numberOfChecked(filteredItems) !== items.length &&
                numberOfChecked(filteredItems) !== 0
              }
              disabled={filteredItems.length === 0}
              inputProps={{ 'aria-label': 'Todos os itens selecionados' }}
            />
          ) : (
            <span></span>
          )
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selecionado(s)`}
        action={
          <Grid container spacing={2} direction="row">
            {isGroupFilter && (
              <Grid item lg={6} md={12} sm={6} xs={12}>
                <TextField
                  value={group}
                  onChange={(e) => {
                    setGroup(e.target.value)
                    setChecked(not(checked, items));
                  }}
                  label="Grupo"
                  variant="outlined"
                  size="small"
                  select
                  fullWidth
                  style={{ marginTop: '1rem' }}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {groupList.map((group, index) => (
                    <MenuItem key={index} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {isSearch && (
              <Grid
                item
                lg={isGroupFilter ? 6 : 12}
                md={12}
                sm={isGroupFilter ? 6 : 12}
                xs={12}
              >
                <Input
                  placeholder="Pesquisar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  endAdornment={
                    <InputAdornment style={{ color: '#bdbdbd' }} position="end">
                      <SearchIcon style={{ color: '#bdbdbd' }} />
                    </InputAdornment>
                  }
                  fullWidth
                  style={{ marginTop: '1rem' }}
                />
              </Grid>
            )}
          </Grid>
        }
      />
      <Divider />
      <List className={classes.list}>
        {items
          .filter((value) =>
            isGroupFilter && group !== 'todos' ? (value.group ? value.group.id : value.group_id) === group : true
          )
          .filter((value) => (isSearch ? value.name.includes(search) : true))
          .map((value, index) => (
            <ListItem key={value?.id}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  onChange={() => handleToggle(value)}
                />
              </ListItemIcon>
              <ListItemText
                primary={value.name}
                onClick={() => handleToggle(value)}
              />
              {hasQuantity && (
                <>
                  <IconButton
                    onClick={() => handleQuantity(value?.id, value.qtd + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                  <Typography>{value.qtd}</Typography>
                  <IconButton
                    onClick={() => handleQuantity(value?.id, value.qtd - 1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </>
              )}
            </ListItem>
          ))}
        <ListItem />
      </List>
    </Card>
  );
};

export default CustomList;
