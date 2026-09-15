import { fetchTotalTonghopbienap } from "#src/api/bienap/tonghop"
import { create } from "zustand"
import { message } from "../utils/static-antd"

interface TonghopbienapState {
	loading: boolean
	total: number
}

interface TonghopbienapAction {
	fetchTonghopbienap: () => Promise<number>
}
const initialState: TonghopbienapState = {
	loading: false,
	total: 0,
}

export const useTonghopbienapStore = create<TonghopbienapState & TonghopbienapAction>((set) => ({
	...initialState,
	fetchTonghopbienap: async () => {
		set({ loading: true })
		try {
			const response = await fetchTotalTonghopbienap()

			set({ total: response.data, loading: false })
			// SỬA TẠI ĐÂY: Trả về totalValue (kiểu number) thay vì response (kiểu ApiResult)
			return response.data
		} catch (error) {
			console.error("Error fetching tonghopbienap:", error)
			message.error("Lỗi khi lấy dữ liệu tổng hợp biến áp")
			set({ loading: false })
			return 0
		}
	},
}))
