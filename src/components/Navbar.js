import React, { useState } from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import useStore from '../store';
import '../css/navbar.css';
export default function Navbar() {
	const location = useLocation();
	// const path = location.pathname;
	const [ active, setActive ] = useState(null);
	const [ express, setExpress ] = useState(true);
	// if (path !== '/' && active === null) {
	// 	return <Redirect to="/" />;
	// }
	return (
		<nav className="navbar">
			<ul className="menu-list">
				<Link
					to={{
						pathname: '/orders',
						state: {
							load: true
						}
					}}
					onClick={() => [ setActive('orders') ]}
				>
					<li className={`list ${active === 'orders' && 'active'} ${active === null && 'active'}`}>كشف الطلبات</li>
				</Link>
				<Link to="/drivers" onClick={() => setActive('drivers')}>
					<li className={`list ${active === 'drivers' && 'active'}`}>المشتركين</li>
				</Link>
				<Link to="/drivers/new" onClick={() => setActive('new_driver')}>
					<li className={`list ${active === 'new_driver' && 'active'}`}>اضافة مندوب</li>
				</Link>
				<Link to="/transactions" onClick={() => setActive('statement')}>
					<li className={`list ${active === 'statement' && 'active'}`}>عمليات الصرف</li>
				</Link>
				<Link to="/offers" onClick={() => setActive('offers')}>
					<li className={`list ${active === 'offers' && 'active'}`}>ادارة العروض</li>
				</Link>
			</ul>
			<div className={`activation ${!express && 'disableExpress'}`} onClick={() => setExpress(!express)}>
				{express ? 'التوصيل نشط' : 'التوصيل مغلق'}
			</div>
		</nav>
	);
}
