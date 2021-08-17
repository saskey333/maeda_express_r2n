import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useSocket from '../../socket/useSocket';
import produce from 'immer';
import '../../css/datatable.css';
import schema from './Schema.js';
import config from '../../config/Config';
import useStore from '../../store';

const FilterComponent = ({ filterText, onFilter, onClear }) => (
	<input
		id="search"
		type="text"
		placeholder="بحث ..."
		aria-label="Search Input"
		value={filterText}
		onChange={onFilter}
		className="search"
	/>
);

const LiveOrders = () => {
	const store = useStore();
	const tableHieght = window.innerHeight - 320;
	const [ isLoaded, setIsLoaded ] = useState(false);
	const [ filterText, setFilterText ] = useState('');
	const [ resetPaginationToggle, setResetPaginationToggle ] = useState(false);
	const [ data, setData ] = useState([]);
	// const data = store.orders;
	// const setData = store.setOrders;
	const [ page, setPage ] = useState(1);
	const [ total, setTotal ] = useState(0);
	const [ wsActive, setWsActive ] = useState(true);
	const [ expandedId, setExpandedId ] = useState(true);
	const [ counter, setCounter ] = useState(0);
	const countPerPage = 200;

	const [ socket ] = useSocket(config.SOCKET_URL, {
		autoConnect: false
	});
	const filteredItems = data.filter(
		(item) =>
			item.customer_name.toLowerCase().includes(filterText.toLowerCase()) ||
			item.restaurant_name.toLowerCase().includes(filterText.toLowerCase()) ||
			item.order_number.toLowerCase().includes(filterText.toLowerCase()) ||
			item.payment_method.toLowerCase().includes(filterText.toLowerCase())
	);

	const conditionalRowStyles = [
		{
			when: (row) => row.driver_id !== null,
			style: {
				backgroundColor: '#F8EECC'
			}
		},
		{
			when: (row) => row.isCanceled,
			style: {
				backgroundColor: '#F7DDDE'
			}
		},
		{
			when: (row) => row.isDelivered,
			style: {
				backgroundColor: '#D4E9D8'
			}
		},
		{
			when: (row) => row.isTest,
			style: {
				backgroundColor: '#C4C4C4'
			}
		}
	];
	async function getOrders() {
		try {
			await axios
				.get(`${config.API_URL.ORDERS.GET_ORDERS_PAGE}?page=${page}&limit=${countPerPage}&sort=-1`, {
					headers: config.headers
				})
				.then(async (response) => {
					const fetchData = produce(data, (draft) => {
						draft.push(...response.data.data.results);
					});
					setData(fetchData);
					if (response.data.data.results.length > 0) {
						setIsLoaded(true);
						setTotal(response.data.data.total);
					}
				});
			return;
		} catch (e) {
			console.log('Axios error: ', e);
		}
	}
	useEffect(
		() => {
			// Axios: fire the function
			getOrders();
		},
		[ page ]
	);

	// WS: New order
	useEffect(
		() => {
			console.log('ws: new');
			socket.connect();
			socket.on('newOrder', (order) => {
				const newOrder = produce(data, (draft) => {
					if (wsActive) {
						draft.unshift(order);
					}
				});
				setData((currentData) => [ ...newOrder, ...currentData ]);
			});
		},
		[ wsActive ]
	);

	useEffect(
		() => {
			if (!data) return;
			console.log('ws: update');
			setCounter(counter + 1);
			// WS: Assign order to Driver.
			socket.once('update', (order) => {
				const updateFields = order.updatedFields;
				const orderId = order['_id'];
				if (updateFields.driver_name === null) {
					// to avoid mounting if call for reset
					return;
				}
				const orderIndex = data.findIndex((o) => o._id === orderId);
				const updatedData = produce(data, (draft) => {
					if (orderIndex !== -1) {
						if (updateFields.driver_id) {
							draft[orderIndex].driver_id = updateFields.driver_id;
						}
						if (updateFields.driver_name) {
							draft[orderIndex].driver_name = updateFields.driver_name;
						}
						if (updateFields.isDelivered) {
							draft[orderIndex].isDelivered = updateFields.isDelivered;
						}
						if (updateFields.isCanceled) {
							draft[orderIndex].isCanceled = updateFields.isCanceled;
						}
						if (updateFields.delivery_time) {
							draft[orderIndex].delivery_time = updateFields.delivery_time;
						}
						if (updateFields.assigned_at) {
							draft[orderIndex].assigned_at = updateFields.assigned_at;
						}
					}
				});
				setData(updatedData);
			});
		},
		[ data, wsActive ]
	);
	const subHeaderComponentMemo = useMemo(
		() => {
			const handleClear = () => {
				if (filterText) {
					setResetPaginationToggle(!resetPaginationToggle);
					setFilterText('');
				}
			};

			return (
				<FilterComponent
					onFilter={(e) => setFilterText(e.target.value)}
					onClear={handleClear}
					filterText={filterText}
				/>
			);
		},
		[ filterText, resetPaginationToggle ]
	);

	const toggleLive = () => {
		return (
			<div className="displayHolder">
				<div className="toggleLiveHolder">
					<div className="live selectedDisplay">مباشر</div>
					<Link to="/orders" className="live">
						<div className="offline">افتراضي</div>
					</Link>
				</div>
				<span>طريقة عرض الطلبات</span>
			</div>
		);
	};

	if (isLoaded === false) {
		return <div className="wait">يرجى الانتظار ...</div>;
	}

	return (
		<DataTable
			title={toggleLive()}
			columns={schema}
			data={filteredItems}
			fixedHeader
			pagination
			fixedHeaderScrollHeight={tableHieght.toString() + 'px'}
			paginationPerPage={50}
			paginationRowsPerPageOptions={[ 50, 100 ]}
			paginationResetDefaultPage={resetPaginationToggle}
			subHeader
			conditionalRowStyles={conditionalRowStyles}
			paginationComponentOptions={{
				rowsPerPageText: 'عدد النتائج بالصفحة :',
				rangeSeparatorText: 'من',
				noRowsPerPage: false,
				selectAllRowsItem: false
			}}
			subHeaderComponent={subHeaderComponentMemo}
			selectableRows
			selectableRowsVisibleOnly
			selectableRowsComponent={() => <div />}
			persistTableHead
			selectableRowsHighlight
			direction={'rtl'}
			paginationServer
			paginationTotalRows={total}
			paginationPerPage={countPerPage}
			paginationComponentOptions={{
				noRowsPerPage: true
			}}
			onChangePage={(page) => setPage(page)}
			customStyles={{
				headCells: {
					style: {
						fontWeight: 'bold',
						fontSize: 12,
						background: '#F9F9F9',
						justifyContent: 'flex-start',

						padding: 0
					}
				},
				rows: {
					style: {
						cursor: 'pointer',
						fontSize: 12
					}
				}
			}}
		/>
	);
};

export default LiveOrders;
