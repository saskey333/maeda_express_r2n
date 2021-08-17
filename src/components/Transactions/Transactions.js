import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import produce from 'immer';
import CsvDownload from 'react-json-to-csv';
import '../../css/datatable.css';
import schema from './Schema.js';
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

const Transactions = () => {
	const tableHieght = window.innerHeight - 320;
	const [ isLoaded, setIsLoaded ] = useState(false);
	const [ filterText, setFilterText ] = useState('');
	const [ resetPaginationToggle, setResetPaginationToggle ] = useState(false);
	const [ data, setData ] = useState([]);
	const [ selected, setSelected ] = useState([]);

	const filteredItems = data.filter((item) => item.driver_name.toLowerCase().includes(filterText.toLowerCase()));

	const conditionalRowStyles = [
		{
			when: (row) => row.isFee !== null,
			style: {
				backgroundColor: '#f2f2f2'
			}
		},
		{
			when: (row) => row.isCharge,
			style: {
				backgroundColor: '#D4E9D8'
			}
		},
		{
			when: (row) => row.isGift,
			style: {
				backgroundColor: '#F7DDDE'
			}
		}
	];
	async function getTransactions() {
		try {
			await axios
				.get(config.API_URL.TRANSACTIONS.GET_ALL_TRANSACTIONS, { headers: config.headers })
				.then(async (response) => {
					const fetchData = produce(data, (draft) => {
						draft.push(...response.data.data.results);
					});
					setData(fetchData);
					if (response.data.data.results.length > 0) {
						setIsLoaded(true);
					}
				});
			return;
		} catch (e) {
			console.log('Axios error: ', e);
		}
	}
	useEffect(() => {
		// Axios: fire the function
		getTransactions();
	}, []);

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
	if (isLoaded === false) {
		return <div className="wait">يرجى الانتظار ...</div>;
	}

	return (
		<div>
			{selected.length > 0 && (
				<CsvDownload
					filename="transactions.csv"
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
				title={''}
				columns={schema}
				data={filteredItems}
				fixedHeader
				pagination
				onSelectedRowsChange={(row) => setSelected(row.selectedRows)}
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
				persistTableHead
				selectableRowsHighlight
				direction={'rtl'}
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

export default Transactions;
