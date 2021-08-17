import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment-timezone';
import { slideInLeft } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import { X } from 'react-feather';
import '../../css/receipt.css';
import DriversList from './DriversList';
export default function Receipt(props) {
	const data = props.location.data;
	const [ assignModal, setAssignModal ] = useState(false);
	const [ loaded, setLoaded ] = useState(false);
	const history = useHistory();

	useEffect(() => {
		const check_data = props.location.data;
		if (!check_data) {
			history.push('/');
		} else {
			setLoaded(true);
		}
	}, []);
	const styles = {
		slideInLeft: {
			animation: 'x 0.4s',
			animationName: Radium.keyframes(slideInLeft, 'slideInLeft')
		}
	};
	const closeModal = () => {
		setAssignModal(false);
	};
	const Recipt = () => {
		return (
			<div className="container">
				<div className="tree">
					<span onClick={() => history.push('/orders')}>كشف الطلبات</span>
					<span> / </span>
					<span>{data.order_number}</span>
				</div>
				<div className="headContainer">
					<div className="rowRight">
						<div className="receiptHeadRow">
							<label>رقم الطلب</label>
							<span className="ltr">{data.order_number}</span>
						</div>
						<div className="receiptHeadRow">
							<label>اسم المطعم</label>
							<span>{data.restaurant_name}</span>
						</div>
						<div className="receiptHeadRow">
							<label>رقم المطعم</label>
							<span>{data.restaurant_phone}</span>
						</div>
						<div className="receiptHeadRow">
							<label>مدينة المطعم</label>
							<span>{data.restaurant_city}</span>
						</div>
					</div>
					<div className="rowLeft">
						<div className="receiptHeadRow">
							<label>الزبون</label>
							<span>{data.customer_name}</span>
						</div>
						<div className="receiptHeadRow">
							<label>رقم الزبون</label>
							<span>{data.customer_phone}</span>
						</div>
						<div className="receiptHeadRow">
							<label>تاريخ الطلب</label>
							<span>{moment(data.created_at).format('LLL')}</span>
						</div>
						<div className="receiptHeadRow">
							<label>مدينة الزبون</label>
							<span>{data.customer_city}</span>
						</div>
					</div>
				</div>
				<table
					id="dtBasicExample"
					className="table table-striped table-bordered"
					cellSpacing="0"
					style={{
						width: window.innerWidth - 60
					}}
				>
					<thead>
						<tr>
							<th className="th-sm quantity">الكمية</th>
							<th className="th-sm item">الصنف</th>
							<th className="th-sm price">السعر</th>
						</tr>
					</thead>
					<tbody>
						{data.items.map((r, index) => {
							return (
								<tr key={index}>
									<td>{r.item_quantity}</td>
									<td>{r.item_name}</td>
									<td>{r.item_price}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<div>
					<div className="receipt-checkout">
						<div className="receipt-row">
							<div className="receipt-column">قيمة التوصيل</div>
							<div className="receipt-column">{data.delivery_cost}</div>
						</div>
						<div className="receipt-row">
							<div className="receipt-column">قيمة الطلب</div>
							<div className="receipt-column">{data.sub_total}</div>
						</div>
						<div className="receipt-row">
							<div className="receipt-column">القيمة المضافة</div>
							<div className="receipt-column">{Number(data.sub_total * 0.15).toFixed(2)}</div>
						</div>
						<div className="receipt-row">
							<div className="receipt-column">المجموع الكلي</div>
							<div className="receipt-column">
								{Number(Number(data.delivery_cost) + Number(data.sub_total)).toFixed(2)}
							</div>
						</div>
						<div className="receipt-row">
							<div className="receipt-column">طريقة الدفع</div>
							<div className="receipt-column">{data.payment_method}</div>
						</div>
					</div>
				</div>
				<div className="assignBtn" onClick={() => setAssignModal(true)}>
					اسناد الطلب لمندوب
				</div>
				<StyleRoot>
					{assignModal && (
						<div className="driverListHolder" style={styles.slideInLeft}>
							<X className="closeBtn" size={30} onClick={() => setAssignModal(false)} />
							<DriversList order_number={data.order_number} closeModal={closeModal} />
						</div>
					)}
				</StyleRoot>
			</div>
		);
	};

	return loaded ? <Recipt /> : <div />;
}
