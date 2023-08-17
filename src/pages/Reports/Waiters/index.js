import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import Card from './Cards';

import EaseGrid from '../../../components/EaseGrid';

import Api from '../../../api';
import { format } from 'currency-formatter';

const Waiter = ({ event }) => {
	const columns = [
		{ title: 'Garçom', field: 'name' },
		{ title: 'Tipo', field: 'typeName' },
		{ title: 'Vendas', field: 'total', render: ({ sales }) => format(sales / 100, { code: 'BRL' }) },
		{ title: 'Comissão', field: 'commission', render: ({ commission }) => commission + "%" }
	];
	const [data, setData] = useState([]);
	const [stats, setStats] = useState({});

	const loadData = useCallback(async () => {
		try {
			const { data } = await Api.get(`/statistical/waiter/${event}`)

			setData(data.list.map(item => {
				if (item.isCode === 1) {
					item.typeName = 'Código';
				}
				else {
					item.typeName = 'Operador';
				}
				return item;
			}));
			setStats(data.stats)
		} catch (error) {

		}
	}, [event]);

	useEffect(() => {
		if (event) {
			loadData()
		}
	}, [event, loadData]);

	return (
		<Grid container direction="column" spacing={2}>
			<Grid item xs={12}>
				<Card {...stats} />
			</Grid>

			<Grid item xs={12}>
				<EaseGrid data={data} columns={columns} pageSize={10} />
			</Grid>
		</Grid>
	);
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Waiter);
