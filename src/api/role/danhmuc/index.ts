import type { DanhmucRoleItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

/* Lấy dữ liệu */
export function fetchDanhmucRoleLiest() {
	return request
		.get<DanhmucRoleItemType[]>("api/DanhmucRole", {
			ignoreLoading: true,
		})
		.json();
}

/* Thêm mới */
export function fetchAddDanhmucRoleItem(data: DanhmucRoleItemType) {
	return request.post("api/DanhmucRole/Add", {
		json: data,
		ignoreLoading: true,
	});
}
/* Sửa */
export function fetchUpdateDanhmucRoleItem(data: DanhmucRoleItemType) {
	return request.put("api/DanhmucRole/Update", {
		json: data,
		ignoreLoading: true,
	});
}
/* Xóa */
export function fetchDeleteDanhmucRoleItem(id: number) {
	return request.delete(`api/DanhmucRole/${id}`, { ignoreLoading: true });
}
/* Xóa bản ghi đã chọn */
export function fetchDeleteMultipleDanhmucRoleItems(ids: number[]) {
	return request.post("api/DanhmucRole/DeleteSelect", {
		json: ids,
		ignoreLoading: true,
	});
}
