import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { formatDate, formatTime } from '../../../utils/date';

import EaseGrid from '../../../components/EaseGrid';
import Api from '../../../api';

import AddPersonModal from './Modal/addPerson';
import AttachModal from './Modal/attach';

import { exportData } from './xls';
import ButtonRound from '../../../components/ButtonRound';

const Data = () => {
  const { idList } = useParams();
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [data, setData] = useState({});
  const columns = [
    { title: 'Nome', field: 'name' },
    { title: 'Telefone', field: 'fone' },
    { title: 'Documento', field: 'document' },
    { title: 'E-mail', field: 'email' },
    {
      title: 'Check in',
      field: 'checkin',
      render: ({ checkin, date, time }) => {
        if (checkin) {
          if (!new Date(time).getTime()) {
            return (
              formatDate(new Date(date).getTime()) + ' ' + time.slice(0, -3)
            );
          } else {
            return (
              formatDate(new Date(date).getTime()) +
              ' ' +
              formatTime(new Date(time).getTime())
            );
          }
        }

        return '';
      },
    },
    {
      title: 'Ações',
      render: (row) => (
        <>
          <Button
            onClick={handleEditPerson(row)}
            variant="outlined"
            size="small"
            color="primary"
          >
            Editar
          </Button>
          <Button
            onClick={handleRemovePerson(row)}
            variant="outlined"
            size="small"
            color="secondary"
          >
            Excluir
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    Api.get(`/list/getData/${idList}`).then(({ data }) => {
      if (data.success) {
        console.log(data.data, data.list);
        setName(data.data.name);
        setList(data.list);
      } else {
        alert('Erro ao carregar os dados da lista');
      }
    });
  }, [idList]);

  const handleEditPerson = (row) => () => {
    setData(row);
    setShowAddPerson(true);
  };

  const handleRemovePerson = (row) => async () => {
    try {
      const { status } = await Api.delete(
        `/list/removeList/${idList}/${row.id}`
      );

      if (status === 201) {
        setList((previous) => previous.filter((item) => item.id !== row.id));
      } else {
        alert('Erro ao remover a pessoa da lista');
      }
    } catch (e) {
      console.log(e);
      alert('Erro ao remover a pessoa da lista');
    }
  };

  const afterAddPerson = (person) => {
    setList((previous) => [...previous, person]);
  };

  const afterEditPerson = (person) => {
    setList((previous) =>
      previous.map((item) => {
        console.log(item.id, person.id);
        if (item.id === person.id) {
          console.log(person);
          return person;
        }

        return item;
      })
    );
  };

  return (
    <Grid container>
      <AddPersonModal
        show={showAddPerson}
        onClose={() => {
          setShowAddPerson(false);
          setData({});
        }}
        idList={idList}
        afterAddPerson={afterAddPerson}
        afterEditPerson={afterEditPerson}
        data={data}
      />
      <AttachModal
        show={showAttach}
        onClose={() => setShowAttach(false)}
        idList={idList}
        afterAddPerson={afterAddPerson}
      />

      <Grid item lg md sm xs>
        <EaseGrid
          columns={columns}
          data={list}
          title={name}
          toolbar={() => (
            <Grid container spacing={2}>
              <Grid item>
                <ButtonRound
                  variant="contained"
                  color="primary"
                  onClick={() => setShowAddPerson(true)}
                >
                  Adicionar Pessoa
                </ButtonRound>
              </Grid>
              <Grid item>
                <ButtonRound
                  variant="contained"
                  onClick={() => setShowAttach(true)}
                >
                  Importar Excel
                </ButtonRound>
              </Grid>
              <Grid item>
                <ButtonRound
                  variant="contained"
                  onClick={() => exportData(name, list)}
                >
                  Exportar Excel
                </ButtonRound>
              </Grid>
            </Grid>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Data;
