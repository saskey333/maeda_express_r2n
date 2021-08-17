import create from 'zustand';

const useStore = create((set) => ({
	sensor: 1,
	orders: [],
	setSensor: () => set((state) => ({ sensor: !state.sensor })),
	setOrders: (order) => set(() => ({ orders: order }))
}));

export default useStore;
