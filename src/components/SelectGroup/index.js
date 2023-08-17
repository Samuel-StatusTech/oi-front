import React, { useEffect, useState } from 'react';
import Api from '../../api';
import CustomList from '../CustomList';

const SelectGroup = ({ onSelect, rawList = [] }) => {
  const [checked, setChecked] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    Api.get('/group/getList').then(({ data }) => {
      if (data.success) {
        const groups = [];
        const selecteds = [];
        data.groups.map((group) => {
          const item = rawList.find((item) => item.id === group.id);

          if (item) {
            selecteds.push(group);
          }
          groups.push(group);

          return group;
        });

        setList(groups);
        handleSelected(selecteds);
      } else {
        alert('Erro ao carregar os grupos');
      }
    });
    // eslint-disable-next-line
  }, []);

  const handleSelected = (data) => {
    setChecked(data);
    onSelect(data);
  };

  return (
    <CustomList
      title="Grupos"
      items={list}
      setItems={setList}
      checked={checked}
      setChecked={handleSelected}
      selectAll
      isSearch
    />
  );
};

export default SelectGroup;
