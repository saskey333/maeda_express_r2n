import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import CsvDownload from 'react-json-to-csv';
import produce from 'immer';
import '../../css/datatable.css';
import DriverDetails from './DriverDetails';
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
	/>
);

const Drivers = () => {
	const tableHieght = window.innerHeight - 320;
	const [ isLoaded, setIsLoaded ] = useState(false);
	const [ filterText, setFilterText ] = useState('');
	const [ resetPaginationToggle, setResetPaginationToggle ] = useState(false);
	const [ data, setData ] = useState([]);
	const [ selectedId, setSelectedId ] = useState([]);
	const [ selected, setSelected ] = useState([]);
	const filteredItems = data.filter(
		(item) =>
			item.name.toLowerCase().includes(filterText.toLowerCase()) ||
			item.phone.toLowerCase().includes(filterText.toLowerCase())
	);

	const toggleActivate = (id_number) => {
		const index = data.findIndex((i) => i.id_number === id_number);
		const toggle = produce(data, (draft) => {
			draft[index].isActive = !draft[index].isActive;
		});
		setData(toggle);
	};
	const conditionalRowStyles = [
		{
			when: (row) => selectedId.includes(row._id),
			style: {
				backgroundColor: '#C32E52',
				color: '#fff'
			}
		}
	];
	const getDrivers = async () => {
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
	};
	useEffect(() => {
		// Axios: fire the function
		getDrivers();
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
					filename="drivers.csv"
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
				fixedHeaderScrollHeight={tableHieght.toString() + 'px'}
				paginationPerPage={50}
				onSelectedRowsChange={(row) => setSelected(row.selectedRows)}
				paginationRowsPerPageOptions={[ 50, 100 ]}
				paginationResetDefaultPage={resetPaginationToggle}
				subHeader
				onRowExpandToggled={(toggleState, row) => [
					toggleState ? setSelectedId((p) => [ ...p, row._id ]) : setSelectedId(selectedId.filter((i) => i !== row._id))
				]}
				expandableRowsComponent={<DriverDetails toggleActivate={toggleActivate} data={(row) => row} />}
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
				expandableRows
				expandableRowsHideExpander
				expandOnRowClicked
				direction={'rtl'}
				customStyles={{
					headCells: {
						style: {
							fontWeight: 'bold',
							fontSize: 12,
							background: '#F9F9F9'
						}
					},
					rows: {
						style: {
							fontSize: 12
						}
					}
				}}
			/>
		</div>
	);
};

export default Drivers;
