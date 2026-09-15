import { fetchTonghopmaycaoCount } from "#src/api/maycao/tonghop"
import { create } from "zustand"
import { message } from "../utils/static-antd"

interface TonghopmaycaoState {
	loading: boolean
	total: any
}

interface TonghopmaycaoAction {
	fetchTonghopmaycaoCount: () => Promise<any>
}
const initialState: TonghopmaycaoState = {
	loading: false,
	total: 0,
}

export const useTonghopmaycaoStore = create<TonghopmaycaoState & TonghopmaycaoAction>((set) => ({
	...initialState,
	fetchTonghopmaycaoCount: async () => {
		set({ loading: true })
		try {
			const response = await fetchTonghopmaycaoCount()
			set({ total: response, loading: false })
			// SỬA TẠI ĐÂY: Trả về totalValue (kiểu number) thay vì response (kiểu ApiResult)
			return response
		} catch (error) {
			console.error("Lỗi gọi fetchTonghopmaycaoCount:", error)
			message.error("Lỗi hệ thống")
			set({ loading: false })
			return 0
		}
	},
}))
