import moment from 'moment';
const restaurant_name = (row) => <span title={row.restaurant_city}>{row.restaurant_name}</span>;
const customer_name = (row) => <span title={row.customer_city}>{row.customer_name}</span>;
const payments = [
	{
		cash: {
			title: 'كاش'
		},
		online: {
			title: 'اونلاين'
		},
		points: {
			title: 'نقاط مائدة'
		}
	}
];

const statusOptions = [
	{
		success: 'ناجحة',
		canceled: 'طلب ملغي',
		waiting: 'معلق',
		ongoing: 'بالطريق للزبون'
	}
];
const status = statusOptions[0];
const schema = [
	{
		name: 'الطلب',
		selector: 'order_number',
		sortable: true,
		style: {
			padding: 0
		}
	},
	{
		name: 'المندوب',
		selector: (row) => `${row.driver_name !== null ? row.driver_name : 'بإنتظار القبول'}`,
		sortable: true,
		width: '200px',
		style: {
			padding: 0
		}
	},
	{
		name: 'المطعم',
		selector: 'restaurant_name',
		sortable: true,
		wrap: true,
		width: '200px',
		style: {
			padding: 0
		},
		cell: restaurant_name
	},
	{
		name: 'الزبون',
		selector: 'customer_name',
		sortable: true,
		wrap: true,
		width: '200px',
		style: {
			padding: 0
		},
		cell: customer_name
	},
	{
		name: 'رقم الهاتف',
		selector: 'customer_phone',
		sortable: true,
		wrap: true,
		width: '130px',
		style: {
			padding: 0
		}
	},
	{
		name: 'تاريخ الطلب',
		selector: (row) => `${moment(row.created_at).calendar('L')}`,
		sortable: true,
		wrap: true,
		width: '130px',
		style: {
			padding: 0
		}
	},
	{
		name: 'وقت الطلب',
		selector: (row) => `${moment(row.created_at).format('h:m A')}`,
		sortable: true,
		wrap: true,
		width: '130px',
		style: {
			direction: 'ltr',
			justifyContent: 'flex-end',
			padding: 0
		}
	},
	{
		name: 'وقت القبول',
		width: '130px',
		selector: (row) => `${row.assigned_at !== null ? moment(row.assigned_at).format('h:m A') : '...'}`,
		sortable: true,
		wrap: true,
		style: {
			direction: 'ltr',
			justifyContent: 'flex-end',
			padding: 0
		}
	},
	{
		name: 'وقت الانهاء',
		width: '130px',
		selector: (row) => `${row.delivery_time !== null ? moment(row.delivery_time).format('h:m A') : '...'}`,
		sortable: true,
		wrap: true,
		style: {
			direction: 'ltr',
			justifyContent: 'flex-end',
			padding: 0
		}
	},
	{
		name: 'طريقة الدفع',
		width: '130px',
		selector: (row) =>
			`${row.payment_method === 'Cash'
				? payments[0].cash.title
				: row.payment_method === 'Card'
					? payments[0].online.title
					: row.payment_method === 'Points' && payments[0].points.title}`,
		sortable: true,
		style: {
			padding: 0
		}
	},
	{
		name: 'قيمة التوصيل',
		selector: 'delivery_cost',
		sortable: true,
		width: '130px',
		style: {
			padding: 0
		}
	},
	{
		name: 'مجانا',
		selector: (row) => `${row.isFreeExpress === true ? 'نعم' : 'لا'}`,
		sortable: true,
		width: '50px',
		style: {
			padding: 0
		}
	},
	{
		name: 'الحالة',
		selector: (row) =>
			`${row.isDelivered
				? status.success
				: row.isCanceled ? status.canceled : row.driver_name ? status.ongoing : status.waiting}`,
		sortable: true,
		width: '180px',
		style: {
			padding: 0
		}
	}
];

export default schema;
