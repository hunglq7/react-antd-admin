import type { TonghopbienapItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

/* 获取 tổng hợp biến áp 列表 */
export async function fetchTonghopbienapList(): Promise<
	TonghopbienapItemType[]
> {
	const response = (await request
		.get("api/Tonghopbienap", { ignoreLoading: true })
		.json()) as TonghopbienapItemType[] | { data: TonghopbienapItemType[] };

	if (Array.isArray(response)) {
		return response;
	}

	return response?.data ?? [];
}

/* 新增 tổng hợp biến áp */
export function fetchAddTonghopbienapItem(data: TonghopbienapItemType) {
	return request
		.post("api/Tonghopbienap/Add", {
			json: data,
			ignoreLoading: true,
		})
		.json();
}

/* 修改 tổng hợp biến áp */
export function fetchUpdateTonghopbienapItem(data: TonghopbienapItemType) {
	return request
		.put("api/Tonghopbienap/Update", {
			json: data,
			ignoreLoading: true,
		})
		.json();
}

/* 删除 tổng hợp biến áp */
export function fetchDeleteTonghopbienapItem(id: number) {
	return request
		.delete(`api/Tonghopbienap/${id}`, { ignoreLoading: true })
		.json();
}

/* 批量删除 tổng hợp biến áp */
export function fetchDeleteTonghopbienapItems(ids: number[]) {
	return request
		.post("api/Tonghopbienap/DeleteSelect", {
			json: ids,
			ignoreLoading: true,
		})
		.json();
}
