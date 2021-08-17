import moment from 'moment';

const schema = [
	{
		name: 'CODE',
		selector: (row) => row.passKey.toUpperCase(),
		style: {
			with: 100
		}
	},
	{
		name: 'اسم المندوب',
		selector: 'name',
		sortable: true
	},
	{
		name: 'السجل المدني',
		selector: 'id_number'
	},
	{
		name: 'الجوال',
		selector: 'phone'
	},
	{
		name: 'المدينة',
		selector: 'city',
		sortable: true
	},
	{
		name: 'تاريخ الاشتراك',
		selector: (row) => `${moment(row.registration_date).calendar('L')}`,
		sortable: true
	},
	{
		name: 'الحالة',
		selector: (row) => `${row.isActive ? 'نشط' : 'غير نشط'}`,
		sortable: true
	}
];

export default schema;
