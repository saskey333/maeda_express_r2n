import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CsvDownload from 'react-json-to-csv';
import '../../css/datatable.css';
import schema from './Schema.js';
import OrderActions from './OrderActions';
import config from '../../config/Config';

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

const Orders = () => {
	const tableHieght = window.innerHeight - 320;
	const [ isLoaded, setIsLoaded ] = useState(false);
	const [ filterText, setFilterText ] = useState('');
	const [ resetPaginationToggle, setResetPaginationToggle ] = useState(false);
	const [ data, setData ] = useState([]);
	const [ page, setPage ] = useState(1);
	const [ total, setTotal ] = useState(0);
	const [ selected, setSelected ] = useState([]);
	const countPerPage = 200;

	const filteredItems = data.filter(
		(item) =>
			(item.customer_name && item.customer_name.toLowerCase().includes(filterText.toLowerCase())) ||
			(item.restaurant_name && item.restaurant_name.toLowerCase().includes(filterText.toLowerCase())) ||
			(item.order_number && item.order_number.toLowerCase().includes(filterText.toLowerCase())) ||
			(item.payment_method && item.payment_method.toLowerCase().includes(filterText.toLowerCase()))
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
					setData(response.data.data.results);
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
					<Link to="/orders/live" className="live">
						<div>مباشر</div>
					</Link>
					<div className="offline selectedDisplay">افتراضي</div>
				</div>
				<span>طريقة عرض الطلبات</span>
			</div>
		);
	};

	if (isLoaded === false) {
		return <div className="wait">يرجى الانتظار ...</div>;
	}

	return (
		<div>
			{selected.length > 0 && (
				<CsvDownload
					filename="orders.csv"
					data={selected}
					style={{
						position: 'absolute',
						top: 90,
						zIndex: 2,
						right: 30,
						borderWidth: 0,
						backgroundColor: '#fff',
						padding: 10,
						borderRadius: 5,
						cursor: 'pointer'
					}}
				>
					تحميل البيانات
				</CsvDownload>
			)}

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
				onSelectedRowsChange={(row) => setSelected(row.selectedRows)}
				selectableRowsVisibleOnly
				persistTableHead
				selectableRowsHighlight
				direction={'rtl'}
				expandableRows
				expandableRowsHideExpander
				expandOnRowClicked
				paginationServer
				paginationTotalRows={total}
				paginationPerPage={countPerPage}
				paginationComponentOptions={{
					noRowsPerPage: true
				}}
				onChangePage={(page) => setPage(page)}
				expandableRowsComponent={<OrderActions data={(row) => row} />}
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
		</div>
	);
};

export default Orders;
