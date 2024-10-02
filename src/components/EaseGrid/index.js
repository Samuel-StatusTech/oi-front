import React, { forwardRef } from 'react';
import Table, { MTableToolbar } from 'material-table';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Skeleton from '@material-ui/lab/Skeleton';
import useStyles from '../../global/styles';
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const EaseGrid = ({
  title,
  config,
  actionsRight,
  toolbar,
  components,
  loading,
  loadingMessage,
  paging = false,
  pageSizeOptions = [5, 10, 20, 50, 100],
  pageSize = 10,
  hasSearch = true,
  randomKey = false,
  ...props
}) => {
  const { toolbarConfig, paginationConfig, pageConfig, rowStyle } = config || {};
  const styles = useStyles();


  return (
    <>
      {loading ? (
        <>
          <Skeleton animation='wave' variant='rect' height={30} style={{ marginBottom: '20px' }} />
          <Skeleton animation='wave' variant='rect' height={200} />
        </>
      ) : (
        <Table
          key={`KEY+${randomKey ? Math.random() : 0}`}
          title={<div className={styles.h2}>{title}</div> || ''}
          {...props}
          icons={tableIcons}
          options={{
            actionsColumnIndex: actionsRight ? -1 : 0,
            paging,
            pageSizeOptions,
            pageSize,
            padding: 'dense',
            headerStyle: {
              fontWeight: 500,
              fontSize: '15px',

              textTransform: 'capitalize',
              color: '#626262',
            },
            rowStyle: (data, index) => {
              const style = {};

              if (!(index % 2)) style.backgroundColor = '#f3f5f9';
              style.fontSize = '14px';
              if (rowStyle instanceof Function) {
                return {
                  ...style,
                  ...rowStyle(data, index),
                };
              }

              return style;
            },
            ...pageConfig,
          }}
          components={{
            Toolbar: (props) => {
              return (
                <div className={!title && toolbar ? styles.toolbar : ''}>
                  <div style={{ padding: toolbar && 10 }}>{toolbar && toolbar(props)}</div>
                  {hasSearch && <MTableToolbar {...props} />}
                </div>
              );
            },
            ...components,
          }}
          localization={{
            body: {
              editTooltip: 'Editar',
              emptyDataSourceMessage: loadingMessage ? "Carregando..." : 'Sem registro para exibir',
              filterRow: {
                filterTooltip: 'Filtro',
              },
            },
            header: {
              actions: 'Ações',
            },
            toolbar: {
              searchPlaceholder: 'Pesquisar',
              searchTooltip: 'Pesquisar',
              nRowsSelected: '{0} Item(s) selecionado(s)',
              ...toolbarConfig,
            },
            pagination: {
              labelDisplayedRows: `{from}-{to} de {count}`,
              labelRowsSelect: 'linhas',
              labelRowsPerPage: 'Linhas por página',
              firstTooltip: 'Primeira página',
              firstAriaLabel: 'Primeira página',
              previousTooltip: 'Página anterior',
              previousAriaLabel: 'Página anterior',
              nextTooltip: 'Próxima página',
              nextAriaLabel: 'Próxima página',
              lastTooltip: 'Última página',
              lastAriaLabel: 'Última página',
              ...paginationConfig,
            },
          }}
        />
      )}
    </>
  );
};

export default EaseGrid;
