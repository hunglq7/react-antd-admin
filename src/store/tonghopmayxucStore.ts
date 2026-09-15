import { fetchTonghopmayxucCount } from "#src/api/mayxuc/tonghop"
import { create } from "zustand"
import { message } from "../utils/static-antd"

interface TonghopmayxucState {
	loading: boolean
	total: any
}

interface TonghopmayxucAction {
	fetchTonghopmayxucCount: () => Promise<any>
}
const initialState: TonghopmayxucState = {
	loading: false,
	total: 0,
}

export const useTonghopmayxucStore = create<TonghopmayxucState & TonghopmayxucAction>((set) => ({
	...initialState,
	fetchTonghopmayxucCount: async () => {
		set({ loading: true })
		try {
			const response = await fetchTonghopmayxucCount()

			set({ total: response, loading: false })
			// SỬA TẠI ĐÂY: Trả về totalValue (kiểu number) thay vì response (kiểu ApiResult)
			return response
		} catch (error) {
			console.error("Lỗi gọi fetchTonghopmayxucCount:", error)
			message.error("Lỗi hệ thống")
			set({ loading: false })
			return 0
		}
	},
}))
