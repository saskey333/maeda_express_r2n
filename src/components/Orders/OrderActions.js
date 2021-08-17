import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/Config';
export default function OrderActions(props) {
	const { data } = props;
	const [ reason, setReason ] = useState(false);
	const [ reasonType, setReasonType ] = useState('');
	const [ reasonTxt, setReasonTxt ] = useState('');
	let history = useHistory();

	const handleReasonTxt = (e) => {
		setReasonTxt(e.target.value);
	};
	const endTrip = async () => {
		const driver_id = data.driver_id;
		const order_number = data.order_number;
		await axios
			.patch(config.API_URL.ORDERS.EXECUTE_ORDER + order_number, { driver_id }, { headers: config.headers })
			.then((response) => {
				console.log(response.data);
				history.go(0);
			});
	};
	const cancelTrip = async () => {
		const order_number = data.order_number;
		const delivery_cost = data.delivery_cost;
		await axios
			.patch(
				config.API_URL.ORDERS.CANCEL_ORDER + order_number,
				{ cancel_reason: reasonType + ' - ' + reasonTxt, delivery_cost: delivery_cost },
				{ headers: config.headers }
			)
			.then((response) => {
				console.log(response.data);
				history.go(0);
			});
	};
	return (
		<div style={styles.container}>
			<Link to={{ pathname: `/orders/${data.order_number}`, data: data }}>
				<button style={styles.edit}>عرض الفاتورة</button>
			</Link>
			{!data.isDelivered && (
				<button style={styles.endTrip} onClick={() => endTrip()}>
					انهاء الرحلة
				</button>
			)}

			{!data.isCanceled && (
				<button style={styles.cancelOrder} onClick={() => setReason(!reason)}>
					الغاء الطلب
				</button>
			)}
			{reason && (
				<span>
					<span style={styles.reason}>سبب الالغاء : </span>
					<button
						style={{
							...styles.reasonBtn,
							...{ border: reasonType === 'app' ? '2px solid #C32E52' : '2px solid #fff' }
						}}
						onClick={() => setReasonType('app')}
					>
						التطبيق
					</button>
					<button
						style={{
							...styles.reasonBtn,
							...{ border: reasonType === 'restaurant' ? '2px solid #C32E52' : '2px solid #fff' }
						}}
						onClick={() => setReasonType('restaurant')}
					>
						المطعم
					</button>
					<button
						style={{
							...styles.reasonBtn,
							...{ border: reasonType === 'customer' ? '2px solid #C32E52' : '2px solid #fff' }
						}}
						onClick={() => setReasonType('customer')}
					>
						الزبون
					</button>
					<input
						type="text"
						placeholder="ملاحظات ..."
						value={reasonTxt}
						onChange={handleReasonTxt}
						style={styles.reasonInput}
					/>
					<button style={styles.confirmBtn} onClick={() => cancelTrip()}>
						تأكيد العملية
					</button>
				</span>
			)}
		</div>
	);
}

const styles = {
	container: {
		padding: 20,
		backgroundColor: '#FCF5F2'
	},
	activate: {
		backgroundColor: '#3BCE63',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 10,
		color: '#1C6F32',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer'
	},
	deactivate: {
		backgroundColor: '#342B40',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 10,
		color: '#f2f2f2',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer'
	},
	edit: {
		backgroundColor: '#E0EFF7',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 10,
		color: '#342B40',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer',
		border: '1px solid #E0EFF7'
	},
	reasonBtn: {
		backgroundColor: '#fff',
		border: '1px solid #ddd',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginRight: 10,
		color: '#342B40',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer'
	},
	confirmBtn: {
		backgroundColor: '#31C961',
		border: '1px solid #31C961',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginRight: 10,
		color: '#146530',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer'
	},
	cancelOrder: {
		backgroundColor: '#C32E52',
		border: '1px solid #C32E52',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 10,
		color: '#fff',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer'
	},
	endTrip: {
		backgroundColor: '#9AF7C0',
		border: '1px solid #9AF7C0',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 10,
		color: '#342B40',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer'
	},
	reason: {
		marginRight: 50,
		marginLeft: 10
	},
	reasonInput: {
		border: 0,
		padding: 5,
		borderRadius: 5,
		paddingLeft: 10,
		paddingRight: 10,
		marginRight: 10
	}
};
