import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import produce from 'immer';
import { toast } from 'react-toastify';
import config from '../../config/Config';
import '../../css/receipt.css';
toast.configure();
const DriversList = (props) => {
	const { order_number } = props;
	const [ data, setData ] = useState([]);
	const [ isLoaded, setIsLoaded ] = useState(false);
	const [ filterText, setFilterText ] = useState('');
	const filteredItems = data.filter(
		(item) =>
			item.name.toLowerCase().includes(filterText.toLowerCase()) ||
			item.phone.toLowerCase().includes(filterText.toLowerCase())
	);

	async function getDrivers() {
		try {
			await axios.get(config.API_URL.DRIVERS.GET_ALL_DRIVERS, { headers: config.headers }).then(async (response) => {
				// Store data for State
				const fetchData = produce(data, (draft) => {
					draft.push(...response.data.data.results);
					setIsLoaded(true);
				});
				setData(fetchData);
			});
		} catch (e) {
			console.log('Axios error: ', e);
		}
	}
	useEffect(() => {
		// Axios: fire the function
		getDrivers();
	}, []);

	const assign = async (order_number, driver_id, name, token) => {
		try {
			await axios
				.patch(
					config.API_URL.ORDERS.DRIVER_ASSIGN_ORDER + order_number,
					{},
					{ headers: { Authorization: 'Bearer ' + token } }
				)
				.then(async (response) => {
					if (response.data.status === 409) {
						toast.error('هذا الطلب مسند لمندوب', { position: toast.POSITION.BOTTOM_LEFT });
						props.closeModal();
					} else {
						toast('تم اسناد الطلب بنجاح', { position: toast.POSITION.BOTTOM_LEFT });
						props.closeModal();
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="DriversListContainer">
			<input
				type="text"
				name="search"
				className="search"
				autoComplete="off"
				placeholder="بحث عن مندوب ..."
				onChange={(e) => setFilterText(e.target.value)}
			/>
			<div className="driversList">
				<ul>
					{filteredItems.map((res, index) => {
						if (res.token) {
							return (
								<li key={index}>
									{res.name}
									{/* order_number, driver_id, name */}
									<div className="btnLeft" onClick={() => assign(order_number, res._id, res.name, res.token)}>
										اسناد
									</div>
								</li>
							);
						}
					})}
				</ul>
			</div>
		</div>
	);
};

export default DriversList;
