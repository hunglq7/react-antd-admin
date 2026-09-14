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

export const useTonghopbienapStore = create<TonghopbienapState & TonghopbienapAction>((set) => ({
	loading: false,
	total: 0,

	fetchTonghopbienap: async () => {
		set({ loading: true })
		try {
			const response = await fetchTotalTonghopbienap()

			// Lấy ra giá trị number từ response.resultObj
			const totalValue = typeof response === "number" ? response : (response?.resultObj ?? 0)

			set({ total: totalValue, loading: false })

			// SỬA TẠI ĐÂY: Trả về totalValue (kiểu number) thay vì response (kiểu ApiResult)
			return totalValue
		} catch (error) {
			console.error("Error fetching tonghopbienap:", error)
			message.error("Lỗi khi lấy dữ liệu tổng hợp biến áp")
			set({ loading: false })
			return 0
		}
	},
}))
