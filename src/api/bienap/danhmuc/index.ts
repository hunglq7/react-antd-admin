import type { BienapItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

/* 获取 biến áp 列表 */
export function fetchBienapList() {
	return request
		.get<BienapItemType[]>("api/DanhmucBienap", { ignoreLoading: true })
		.json();
}

/* 新增 biến áp */
export function fetchAddBienapItem(data: BienapItemType) {
	return request.post("api/DanhmucBienap/Add", {
		json: data,
		ignoreLoading: true,
	});
}

/* 修改 biến áp */
export function fetchUpdateBienapItem(data: BienapItemType) {
	return request.put("api/DanhmucBienap/Update", {
		json: data,
		ignoreLoading: true,
	});
}

/* 删除 biến áp */
export function fetchDeleteBienapItem(id: number) {
	return request.delete(`api/DanhmucBienap/${id}`, { ignoreLoading: true });
}

/* 批量删除 biến áp */
export function fetchDeleteBienapItems(ids: number[]) {
	return request.post("api/DanhmucBienap/DeleteSelect", {
		json: ids,
		ignoreLoading: true,
	});
}
