import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/style.css';
import Select from '../Forms/Select';
import config from '../../config/Config';
toast.configure();

const EditDriver = (props) => {
	let history = useHistory();
	const [ data, setData ] = useState({});

	useEffect(
		() => {
			if (!data) return;
			setData(props.location.data);
			if (props.location.data) {
				updateInitial();
			}

			const selectedData = [
				{
					label: data.identity_type,
					value: data.identity_type_id,
					id: 1,
					model: 'IdentityTypeId'
				},
				{ label: data.car_type, value: data.car_type_id, id: 2, model: 'carType' },
				{ label: data.region, value: data.region_id, id: 3, model: 'region' },
				{ label: data.city, value: data.city_id, id: 4, model: 'city' }
			];

			// initialize select form
			selectedData.map((o, index) => {
				selectHandler(selectedData[index]);
			});
		},
		[ data ]
	);

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
	const updateInitial = async () => {
		let dateOfBith = props.location.data.date_of_birth;
		dateOfBith = dateOfBith.split('/');
		await setState({
			name: data.name,
			phone: data.phone,
			idNumber: data.id_number,
			day: dateOfBith[0],
			month: dateOfBith[1],
			year: dateOfBith[2],
			carNumber: data.car_number,
			image: data.driver_image
		});
	};

	// States
	const [ { name, phone, idNumber, day, month, year, carNumber, image }, setState ] = useState(initialState);
	const [ selectValues, setSelectValues ] = useState([]);

	const onChange = (e) => {
		const { name, value } = e.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};

	const selectHandler = (e) => {
		setSelectValues((prevValues) => [ ...prevValues.filter((i) => i.id !== e.id), e ]);
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

		await axios
			.patch(config.API_URL.DRIVERS.UPDATE_DRIVER + data.id_number, data, { headers: config.headers })
			.then((response) => {
				toast('تم تحديث البيانات بنجاح', { position: toast.POSITION.BOTTOM_LEFT });

				history.push('/drivers');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getS3 = (attachmentId) => {
		const url = [
			`https://maeda-express-attachments.s3.me-south-1.amazonaws.com/${attachmentId}-0.png`,
			`https://maeda-express-attachments.s3.me-south-1.amazonaws.com/${attachmentId}-1.png`,
			`https://maeda-express-attachments.s3.me-south-1.amazonaws.com/${attachmentId}-2.png`,
			`https://maeda-express-attachments.s3.me-south-1.amazonaws.com/${attachmentId}-3.png`,
			`https://maeda-express-attachments.s3.me-south-1.amazonaws.com/${attachmentId}-4.png`
		];
		return url.map((i, index) => <img className="attachmentImage" src={i} />);
	};
	return (
		<div className="new_driver_container">
			<h3>تعديل بيانات المندوب</h3>
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
					label={data.identity_type}
				/>
			</div>
			<div className="row">
				<label>الهوية الوطنية / الاقامة</label>
				<input type="text" disabled={true} className="center" value={idNumber} name="idNumber" onChange={onChange} />
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
					label={data.car_type}
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
					label={data.region}
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
					label={data.city}
				/>
			</div>
			<div className="row">
				<label>صورة المندوب</label>
				<input type="text" className="ltr" value={image} name="image" onChange={onChange} />
			</div>
			<div className="row">
				<label style={{ marginBottom: 20, marginTop: 20 }}>الوثائق المرفقة</label>
				<div>{getS3(data.attachment_id)}</div>
			</div>
			<button className="registerBtn" onClick={onSubmit}>
				حفظ
			</button>
		</div>
	);
};
export default EditDriver;
