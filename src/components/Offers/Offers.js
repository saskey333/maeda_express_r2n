import React, { useState } from 'react';
import '../../css/offers.css';
const Offers = () => {
	const [ tab, setTab ] = useState('all');
	return (
		<div className="container">
			<div className="offerHeader">
				<div
					className="offerTab"
					onClick={() => setTab('all')}
					style={{ backgroundColor: tab === 'all' ? '#fff' : null }}
				>
					العروض
				</div>
				<div
					className="offerTab-2"
					onClick={() => setTab('new')}
					style={{ backgroundColor: tab === 'new' ? '#fff' : null }}
				>
					اضافة عرض
				</div>
			</div>
		</div>
	);
};

export default Offers;
