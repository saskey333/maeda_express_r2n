const URL = 'http://localhost:5000';
const config = {
	SOCKET_URL: `${URL}/api/socket`,
	headers: {
		Authorization:
			'Bearer eyJhbGciOiJIUzI1NiJ9.NjA0Mjc1MjAyZDE4ZDEyZTUzM2ZmM2Uy.1O2bAkUCZiDp8bG-_U0rtdlEuZdsjgxraREHWXisCS0'
	},
	API_URL: {
		ORDERS: {
			GET_ALL_ORDERS: `${URL}/admin/api/v1/orders/?limit=1000&sort=-1`,
			GET_ORDERS_PAGE: `${URL}/admin/api/v1/orders/`,
			EXECUTE_ORDER: `${URL}/admin/api/v1/orders/execute/`,
			CANCEL_ORDER: `${URL}/admin/api/v1/orders/cancel/`,
			ASSIGN_ORDER: `${URL}/admin/api/v1/orders/assign/`,
			DRIVER_ASSIGN_ORDER: `${URL}/api/v1/orders/assign/`
		},
		DRIVERS: {
			ACTIVATE_DRIVER: `${URL}/admin/api/v1/drivers/activate/`,
			DEACTIVATE_DRIVER: `${URL}/admin/api/v1/drivers/deactivate/`,
			GET_ALL_DRIVERS: `${URL}/admin/api/v1/drivers/?sort=-1&limit=1000`,
			CREATE_DRIVER: `${URL}/admin/api/v1/drivers/register/`,
			UPDATE_DRIVER: `${URL}/admin/api/v1/drivers/update/`,
			SEND_MESSAGE: `${URL}/admin/api/v1/messages/`
		},
		TRANSACTIONS: {
			GET_ALL_TRANSACTIONS: `${URL}/admin/api/v1/transactions/?sort=-1&limit=1000`,
			CREATE_TRANSACTION: `${URL}/admin/api/v1/transactions/create/`
		}
	}
};

export default config;
