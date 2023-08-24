import React, { useEffect, useState } from 'react';
import { format } from 'currency-formatter';
import { connect } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

import EventCard from './Card/Event';
import RecipeCard from './Card/Recipe';
import PaymentCard from './Card/Payments';
import PanelCard from './Card/Panel';

import EaseGrid from '../../components/EaseGrid';

import Api from '../../api';

import overviewIcon from '../../assets/icons/ic_resumogeral.svg';
import totalIcon from '../../assets/icons/ic_baixa-produtos2.svg';
import useStyles from '../../global/styles';
import { formatDatetime } from '../../utils/date';
import CardData from '../../components/CardData';
import totalIconCard from '../../assets/icons/ic_total.svg';
import creditTotalIcon from '../../assets/icons/ic_total-credito.svg';
import debitTotalIcon from '../../assets/icons/ic_total-debito.svg';
import pixTotalIcon from '../../assets/icons/ic_total-pix.svg';
import returnsTotalIcon from '../../assets/icons/ic_total-extornos.svg';
import virtualIcon from '../../assets/icons/ic_loja.svg';
import { setSizeOptions } from '../../utils/tablerows';
const Home = ({ event, events }) => {
  const styles = useStyles();
  const [eventData, setEventData] = useState({});
  const [barData, setBarData] = useState({ total: 0, today: 0, emitted: 0 });
  const [ticketData, setTicketData] = useState({ total: 0, today: 0, emitted: 0 });
  const [parkData, setParkData] = useState({ total: 0, today: 0, emitted: 0 });
  const [othersData, setOthersData] = useState({ total: 0, today: 0, emitted: 0 });
  const [receipt, setReceipt] = useState(0);
  const [money, setMoney] = useState(0);
  const [debit, setDebit] = useState(0);
  const [credit, setCredit] = useState(0);
  const [pix, setPix] = useState(0);
  const [webstore, setWebStore] = useState(0);
  const [loading, setLoading] = useState(true);

  const [operators, setOperators] = useState([]);
  const columns = [
    {
      title: <Typography style={{ fontWeight: 'bold', marginLeft: 15 }}>Operador</Typography>,
      field: 'name',
      render: ({ name }) => {

        const { realName, status } = name

        return (
          <td class="MuiTableCell-body MuiTableCell-alignLeft MuiTableCell-sizeSmall" value={realName} style={{
            color: 'inherit',
            boxSizing: 'border-box',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            position: 'relative',
            transform: 'translate(23px)'
          }}>
            <div style={{
              backgroundColor: 'purple',
              position: 'absolute',
              transform: 'translate(-8px, 5px)',
            }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                background: (status) ? '#2FD8A0' : '#B22222',
                justifySelf: 'center',
                position: 'absolute',
                transform: 'translate(-15px)',
              }} />
            </div>
            {realName}
          </td>
        )
      }
    },
    {
      title: <Typography style={{ fontWeight: 'bold' }}>Total</Typography>,
      field: 'value',
      render: ({ value }) => format(value / 100, { code: 'BRL' }),
    },
    {
      title: <Typography style={{ fontWeight: 'bold' }}>Última Sinc.</Typography>,
      field: 'last_sync',
      render: ({ last_sync }) => formatDatetime(last_sync)
    },
  ];
  const infos = {
    infoCards: [
      {
        title: 'Total Receita',
        icon: { src: totalIconCard, alt: 'Ícone total receita' },
        value: (money + debit + credit + pix) * 100,
      },
      {
        title: 'Vendas Dinheiro',
        icon: { src: returnsTotalIcon, alt: 'Ícone vendas dinheiro' },
        value: money * 100,
      },
      {
        title: 'Vendas Débito',
        icon: { src: debitTotalIcon, alt: 'Ícone vendas débito' },
        value: debit * 100,
      },
      {
        title: 'Vendas Crédito',
        icon: { src: creditTotalIcon, alt: 'Ícone vendas crédito' },
        value: credit * 100,
      },
      {
        title: 'Vendas Pix',
        icon: { src: pixTotalIcon, alt: 'Ícone vendas pix' },
        value: pix * 100,
      },
      {
        title: 'Loja Virtual',
        icon: { src: virtualIcon, alt: 'Ícone loja virtual' },
        value: 0,
      },
    ],
  };

  const getOperatorsData = async () => {
    const info = await Api.get('/statistical/saleOperations/f8eb3d9a6373?type=all')
    return info.data.list
  }

  useEffect(() => {
    if (event) {
      setLoading(true);
      setEventData(events.find((item) => item.id === event));

      Api.get(`/statistical/resume/${event}`)
        .then(async ({ data }) => {
          if (data.success) {
            const { totalReceipt, total, operators: operatorsInfo } = data;
            const money = parseInt(totalReceipt.total_money || 0, 10) / 100;
            const debit = parseInt(totalReceipt.total_debit || 0, 10) / 100;
            const credit = parseInt(totalReceipt.total_credit || 0, 10) / 100;
            const pix = parseInt(totalReceipt.total_pix || 0, 10) / 100;

            setMoney(money, 10);
            setDebit(debit, 10);
            setCredit(credit, 10);
            setPix(pix, 10);

            setBarData({
              total: parseInt(total.total_bar),
              today: 0,
              emitted: parseInt(total.total_bar_emitted),
            });
            setTicketData({
              total: parseInt(total.total_ticket),
              today: parseInt(total.total_ticket_today),
              emitted: parseInt(total.total_ticket_emitted),
            });
            setParkData({
              total: parseInt(total.total_park),
              today: parseInt(total.total_park_today),
              emitted: parseInt(total.total_park_emitted),
            });
            setOthersData({
              total: parseInt(total.others),
            });

            const receipt =
              parseInt(total.total_bar) +
              parseInt(total.total_ticket) +
              parseInt(total.total_park) +
              parseInt(total.others);

            setReceipt(receipt / 100);

            const fullOperatorsInfo = await getOperatorsData()
            let completeOperatorsInfo = [...operatorsInfo]

            fullOperatorsInfo.forEach(o => {
              const arrId = completeOperatorsInfo.findIndex(op => op.name === o.name)

              if (arrId >= 0) {
                const newOp = {
                  ...completeOperatorsInfo[arrId],
                  name: {
                    realName: completeOperatorsInfo[arrId].name,
                    status: o.status
                  }
                }
                completeOperatorsInfo[arrId] = newOp
              }
            })

            setOperators(completeOperatorsInfo);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [event, events]);

  return (
    <Grid container direction='row' spacing={2}>
      <Grid item lg={5} md={6} sm={12} xs={12}>
        <EventCard event={eventData} loading={loading} />
      </Grid>
      <Grid item lg={3} md={6} sm={12} xs={12}>
        <RecipeCard receipt={receipt} loading={loading} />
      </Grid>
      <Grid item lg={4} md={12} sm={12} xs={12}>
        <PaymentCard money={money} debit={debit} credit={credit} pix={pix} webstore={webstore} loading={loading} />
      </Grid>
      <Grid item lg={12} md={12} xs={12} sm={12}>
        <Grid container spacing={2}>
          {infos.infoCards.map((item, index) => (
            <Grid item xl={2} lg={2} md={4} sm={6} xs={12} key={index}>
              <CardData title={item.title} value={format(item.value / 100, { code: 'BRL' })} icon={item.icon} styles={{ height: '00%' }} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <PanelCard
          barData={barData}
          ticketData={ticketData}
          parkData={parkData}
          othersData={othersData}
          loading={loading}
        />
      </Grid>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <EaseGrid
          className={styles.paddingT30}
          title={
            <div className={styles.flexRow}>
              <img src={totalIcon} alt='Ranking por operadores' style={{ width: '2.5em', marginRight: 5 }} />
              <Typography className={styles.h2}>Ranking por Operadores</Typography>
            </div>
          }
          data={operators}
          columns={columns}
          loading={loading}
          pageSize={operators.length}
          pageSizeOptions={setSizeOptions(operators.length)}
          paging={true}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event, events }) => ({ event, events });

export const Icon = () => {
  return <img src={overviewIcon} alt='Ícone resumo geral' />;
};

export default connect(mapStateToProps)(Home);
