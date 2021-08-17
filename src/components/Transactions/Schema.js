import moment from 'moment';

const schema = [
	{
		name: 'المندوب',
		selector: 'driver_name',
		sortable: true,
		style: {
			padding: 0
		}
	},
	{
		name: 'القيمة',
		selector: (row) => `${row.amount.toFixed(2)}`,
		sortable: true,
		width: '200px',
		style: {
			padding: 0
		}
	},
	{
		name: 'العملية',
		selector: (row) => `${row.isFee ? 'رسوم مائدة' : row.isCharge ? 'قيمة شحن' : 'قيمة غير مستردة'}`,
		sortable: true,
		wrap: true,
		width: '200px',
		style: {
			padding: 0
		}
	},
	{
		name: 'التاريخ و الوقت',
		selector: (row) => `${row.created_at !== null ? moment(row.created_at).locale('ar').format('LL ~ h:m A') : '...'}`,
		sortable: true,
		wrap: true,
		width: '300px',
		style: {
			padding: 0
		}
	}
];

export default schema;
