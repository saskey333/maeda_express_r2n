import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
const Select = (props) => {
	const data = props.data || [];
	const id = props.id || null;
	const model = props.model || null;
	const [ label, setLabel ] = useState(null);
	const [ hover, setHover ] = useState(null);
	const [ toggle, setToggle ] = useState(false);

	function useOuterClick(callback) {
		const innerRef = useRef();
		const callbackRef = useRef();

		useEffect(() => {
			callbackRef.current = callback;
		}, []);

		useEffect(() => {
			document.addEventListener('click', handleClick);
			return () => document.removeEventListener('click', handleClick);

			function handleClick(e) {
				if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target)) {
					callbackRef.current(e);
				}
			}
		}, []);

		return innerRef;
	}

	const innerRef = useOuterClick(() => {
		setToggle(false);
	});
	return (
		<div
			style={{
				display: 'inline-block',
				background: '#fff'
			}}
			ref={innerRef}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: 200,
					height: 35,
					alignItems: 'center',
					border: '1px solid #ccc',
					position: 'relative',
					paddingLeft: 10,
					paddingRight: 10,
					fontSize: 12,
					userSelect: 'none',
					cursor: 'pointer'
				}}
				onClick={() => setToggle(!toggle)}
			>
				<div>
					{label === null ? props.label || '___' : label}
					<span
						style={{
							position: 'absolute',
							left: 10,
							color: '#000'
						}}
					>
						<FiChevronDown size={18} color={'#bbb'} />
					</span>
				</div>
				{toggle && (
					<ul
						style={{
							listStyle: 'none',
							padding: 0,
							margin: 0,
							position: 'absolute',
							background: '#fff',
							width: 200,
							top: 33,
							right: -1,
							border: '1px solid #ccc',
							zIndex: 9,
							overflow: 'auto',
							overflowX: 'hidden',
							maxHeight: 300
						}}
					>
						{data.map((i, index) => (
							<li
								onMouseEnter={() => {
									setHover(index);
								}}
								onMouseLeave={() => {
									setHover(null);
								}}
								style={{
									display: 'flex',
									alignItems: 'center',
									paddingLeft: 10,
									paddingRight: 10,
									height: 35,
									borderBottom: '1px solid #ccc',
									backgroundColor: hover === index ? '#f2f2f2' : '#fff'
								}}
								onClick={() => [
									setLabel(i.label),
									props.selectHandler({ label: i.label, value: i.value, id, model })
								]}
							>
								{i.label}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};
export default Select;
