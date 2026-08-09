import type { PhongbanItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

/* 获取 phòng ban 列表 */
export function fetchPhongbanList() {
	return request
		.get<PhongbanItemType[]>("api/Phongban", { ignoreLoading: true })
		.json();
}

/* 新增 phòng ban */
export function fetchAddPhongban(data: PhongbanItemType) {
	return request.post("api/Phongban", { json: data, ignoreLoading: true });
}

/* 修改 phòng ban */
export function fetchUpdatePhongban(data: PhongbanItemType) {
	return request.put("api/Phongban", {
		json: data,
		ignoreLoading: true,
	});
}

/* 删除 phòng ban */
export async function fetchDeletePhongban(id: number) {
	await request.delete(`api/Phongban/${id}`, { ignoreLoading: true });
}
