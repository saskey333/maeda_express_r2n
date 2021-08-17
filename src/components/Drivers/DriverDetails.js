import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config/Config';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
toast.configure();
export default function DriverDetails(props) {
	const { data } = props;
	const [ message, setMessage ] = useState('');
	const [ charge, setCharge ] = useState('');
	const [ showMessage, setShowMessage ] = useState(false);
	const [ showCharge, setShowCharge ] = useState(false);
	const [ disableAdd, setDisableAdd ] = useState(false);

	const handleMessage = (e) => {
		setMessage(e.target.value);
	};
	const handleCharge = (e) => {
		setCharge(e.target.value);
	};
	const sendMessage = async () => {
		if (message.length < 5) {
			alert('يجب ان يحتوي التنبية على 5 احرف كحد ادنى');
			return;
		}

		setShowMessage(false);
		setMessage('');
		await axios
			.post(
				`${config.API_URL.DRIVERS.SEND_MESSAGE}`,
				{
					title: 'ادارة مائدة',
					message: message,
					driver_id: data._id
				},
				{ headers: config.headers }
			)
			.then(() => toast('تم ارسال التنبيه بنجاح', { position: toast.POSITION.BOTTOM_LEFT }));
	};

	const sendCharge = async (e) => {
		if (charge.length < 1) return;
		let chargeType;
		if (e === 'charge') {
			chargeType = true;
		} else {
			chargeType = false;
		}
		setDisableAdd(true);
		await axios
			.post(
				`${config.API_URL.TRANSACTIONS.CREATE_TRANSACTION}`,
				{
					driver_id: data._id,
					amount: charge,
					delivery_cost: '0.00',
					isGift: !chargeType,
					isCharge: chargeType
				},
				{ headers: config.headers }
			)
			.then(() => toast('تم اضافة الرصيد بنجاح', { position: toast.POSITION.BOTTOM_LEFT }), setDisableAdd(false));
		setCharge('');
	};

	const activate = async (id_number) => {
		await axios
			.patch(`${config.API_URL.DRIVERS.ACTIVATE_DRIVER}${id_number}`, {}, { headers: config.headers })
			.then((response) => {
				if (response.data.status === 200) {
					console.log(response.data.message);
					props.toggleActivate(id_number, 'ture');
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const deactivate = async (id_number) => {
		await axios
			.patch(`${config.API_URL.DRIVERS.DEACTIVATE_DRIVER}${id_number}`, {}, config)
			.then((response) => {
				if (response.data.status === 200) {
					props.toggleActivate(id_number);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
	return (
		<div style={styles.container}>
			{!data.isActive ? (
				<button style={styles.activate} onClick={() => activate(data.id_number)}>
					تنشيط الحساب
				</button>
			) : (
				<button style={styles.deactivate} onClick={() => deactivate(data.id_number)}>
					ايقاف الحساب
				</button>
			)}

			<Link to={{ pathname: `/drivers/edit/${data._id}`, data: data }}>
				<button style={styles.edit}>تعديل البيانات</button>
			</Link>

			<button style={styles.chargeBtn} onClick={() => setShowCharge(!showCharge)}>
				اضافة رصيد
			</button>
			{showCharge && (
				<div style={styles.messageHolder}>
					<input
						type="number"
						name="message"
						onChange={handleCharge}
						value={charge}
						style={styles.chargeInput}
						placeholder="0.00"
					/>
					{disableAdd ? (
						<button style={[ styles.add, { opacity: 0.5 } ]}>اضافة</button>
					) : (
						<div style={{ display: 'inline-block' }}>
							<button style={styles.addCharge} onClick={() => sendCharge('charge')}>
								اضافة رصيد
							</button>
							<button style={styles.addGift} onClick={() => sendCharge('gift')}>
								اضافة مكافئة
							</button>
						</div>
					)}
				</div>
			)}

			<button style={styles.message} onClick={() => setShowMessage(!showMessage)}>
				ارسال تنبيه
			</button>
			{showMessage && (
				<div style={styles.messageHolder}>
					<input
						type="text"
						name="message"
						onChange={handleMessage}
						value={message}
						style={styles.messageInput}
						placeholder="الرسالة ... "
					/>
					<button style={styles.send} onClick={sendMessage}>
						ارسال
					</button>
				</div>
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
		border: 0,
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
		border: 0,
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
		border: 0,
		backgroundColor: '#E0EFF7',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 10,
		color: '#342B40',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer'
	},
	chargeBtn: {
		border: 0,
		backgroundColor: '#D7A404',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 10,
		color: '#6A5102',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer'
	},
	message: {
		border: 0,
		backgroundColor: '#34A5FA',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 10,
		color: '#fff',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer'
	},
	send: {
		border: 0,
		backgroundColor: '#31C961',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 10,
		color: '#fff',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer',
		marginRight: 10
	},
	addCharge: {
		border: 0,
		backgroundColor: '#31C961',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		color: '#fff',
		fontSize: 12,
		cursor: 'pointer'
	},
	addGift: {
		border: 0,
		backgroundColor: '#976EAD',
		padding: 8,
		paddingLeft: 20,
		paddingRight: 20,
		color: '#fff',
		fontSize: 12,
		borderRadius: 5,
		cursor: 'pointer',
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
		marginLeft: 20
	},
	messageHolder: {
		display: 'inline-block'
	},
	messageInput: {
		border: 0,
		padding: 5,
		borderRadius: 5,
		paddingLeft: 10,
		paddingRight: 10,
		marginRight: 40
	},
	chargeInput: {
		width: 80,
		border: 0,
		padding: 5,
		borderRadius: 5,
		paddingLeft: 10,
		paddingRight: 10,
		marginRight: 10,
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
		outline: 'none'
	}
};
