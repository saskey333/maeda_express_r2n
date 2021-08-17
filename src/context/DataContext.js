import React, { useState, createContext } from 'react';

export const DataContext = createContext();
const DataContextProvider = (props) => {
	const [ data, setData ] = useState([]);

	function storeData(i) {
		setData(i);
	}

	return <DataContext.Provider value={{ data, storeData }}>{props.children}</DataContext.Provider>;
};

export default DataContextProvider;
