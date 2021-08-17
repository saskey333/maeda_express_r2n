import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiveOrders from './components/Orders/LiveOrders';
import Orders from './components/Orders/Orders';
import Receipt from './components/Receipt/Receipt';
import Drivers from './components/Drivers/Drivers';
import newDriver from './components/Drivers/NewDriver';
import editDriver from './components/Drivers/EditDriver';
import DataContextProvider from './context/DataContext';
import Transactions from './components/Transactions/Transactions';
import Offers from './components/Offers/Offers';
function App() {
	return (
		<Router>
			<DataContextProvider>
				<Navbar />
				<Switch>
					<Route path="/" exact component={Orders} />
					<Route path="/orders" exact component={Orders} />
					<Route path="/orders/live" exact component={LiveOrders} />
					<Route path="/orders/:id" component={Receipt} />
					<Route path="/drivers" exact component={Drivers} />
					<Route path="/drivers/new" component={newDriver} />
					<Route path="/drivers/edit/:id" component={editDriver} />
					<Route path="/transactions" exact component={Transactions} />
					<Route path="/offers" exact component={Offers} />
				</Switch>
			</DataContextProvider>
		</Router>
	);
}

export default App;
