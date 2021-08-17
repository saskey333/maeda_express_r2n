import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/style.css';
import Select from '../Forms/Select';
import config from '../../config/Config';
toast.configure();

function signupDriver() {
	return new Promise((resolve) => {
		setTimeout(resolve, 1000);
	});
}

const NewDriver = () => {
	const initialState = {
		name: '',
		phone: '',
		idNumber: '',
		day: '',
		month: '',
		year: '',
		carNumber: '',
		image: ''
	};

	// States
	const [ { name, phone, idNumber, day, month, year, carNumber, image }, setState ] = useState(initialState);

	const clearState = () => {
		setState({ ...initialState });
	};
	const onChange = (e) => {
		const { name, value } = e.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};
	// Select component Handler
	const [ selectValues, setSelectValues ] = useState([]);
	const selectHandler = (e) => {
		const filteredValues = selectValues.filter((i) => i.id !== e.id);
		setSelectValues([ ...filteredValues, e ]);
	};
	const onSubmit = async () => {
		if (selectValues.length < 4) {
			toast.error('يرجى تعبئة جميع الحقول', { position: toast.POSITION.BOTTOM_LEFT });
			return;
		}
		let identity = selectValues.find((e) => e.model === 'IdentityTypeId');
		let car_type = selectValues.find((e) => e.model === 'carType');
		let region = selectValues.find((e) => e.model === 'region');
		let city = selectValues.find((e) => e.model === 'city');

		let car_type_id = car_type.value;
		let car_type_label = car_type.label;
		let identity_type_id = identity.value;
		let identity_type = identity.label;

		let region_id = region.value;
		let region_name = region.label;
		let cityId = city.value;
		let cityName = city.label;
		const data = {
			name: name,
			phone: phone,
			id_number: idNumber,
			date_of_birth: day + '/' + month + '/' + year,
			car_type: car_type_label,
			car_type_id: car_type_id,
			car_number: carNumber,
			identity_type: identity_type,
			identity_type_id: identity_type_id,
			region: region_name,
			region_id: region_id,
			city: cityName,
			city_id: cityId,
			driver_image: image
		};
		console.log(data);

		await axios
			.post(config.API_URL.DRIVERS.CREATE_DRIVER, data, { headers: config.headers })
			.then((response) => {
				signupDriver().then(clearState);
				toast('تم تسجيل المندوب بنجاح', { position: toast.POSITION.BOTTOM_LEFT });
				console.log(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div className="new_driver_container">
			<h3>تسجيل مندوب جديد</h3>
			<div className="row">
				<label>اسم المندوب</label>
				<input type="text" value={name} name="name" onChange={onChange} />
			</div>
			<div className="row">
				<label>رقم الجوال</label>
				<input type="text" className="center" value={phone} name="phone" onChange={onChange} />
			</div>
			<div className="row">
				<label>نوع الهوية</label>
				<Select
					id={1}
					model="IdentityTypeId"
					selectHandler={selectHandler}
					data={[
						{
							label: 'هوية وطنية',
							value: 'NV25GlPuOnQ='
						},
						{
							label: 'اقامة',
							value: 'oIcaYzeDfQQ='
						}
					]}
					label={'اختر ...'}
				/>
			</div>
			<div className="row">
				<label>الهوية الوطنية / الاقامة</label>
				<input type="text" className="center" value={idNumber} name="idNumber" onChange={onChange} />
			</div>
			<div className="row">
				<label>تاريخ الميلاد</label>
				<input type="text" className="input60" placeholder="DD" value={day} name="day" onChange={onChange} />
				<input type="text" className="input60" placeholder="MM" value={month} name="month" onChange={onChange} />
				<input type="text" className="input80" placeholder="YYYY" value={year} name="year" onChange={onChange} />
			</div>
			<div className="row">
				<label>نوع المركبة</label>
				<Select
					id={2}
					model="carType"
					selectHandler={selectHandler}
					data={[
						{
							label: 'نقل خاص',
							value: 'NV25GlPuOnQ='
						},
						{
							label: 'نقل عام',
							value: 'Nap4gA1tyeY='
						}
					]}
					label={'اختر ...'}
				/>
			</div>
			<div className="row">
				<label>رقم المركبة</label>
				<input type="text" className="center" value={carNumber} name="carNumber" onChange={onChange} />
			</div>
			<div className="row">
				<label>المنطقة الرئيسية</label>
				<Select
					id={3}
					model="region"
					selectHandler={selectHandler}
					data={[
						{
							label: 'المنطقة الشرقية',
							value: 'rAy9UhMUw6Y='
						}
					]}
					label={'اختر ...'}
				/>
			</div>
			<div className="row">
				<label>مدينة العمل</label>
				<Select
					id={4}
					model="city"
					selectHandler={selectHandler}
					data={[
						{
							label: 'سيهات',
							value: 'w1V6rte0qXA='
						},
						{
							label: 'القطيف',
							value: 'i07AZC3Axw4='
						}
					]}
					label={'اختر ...'}
				/>
			</div>
			<div className="row">
				<label>صورة المندوب</label>
				<input type="text" className="ltr" value={image} name="image" onChange={onChange} />
			</div>
			<button className="registerBtn" onClick={onSubmit}>
				تسجيل
			</button>
		</div>
	);
};
export default NewDriver;
