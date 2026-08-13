import type { ChucvuItemType } from "./types";
import { request } from "#src/utils/request";

/* Đọc bảng chức vụ */
export function fetchChucvuList() {
	return request
		.get<ChucvuItemType[]>("api/ChucVu", { ignoreLoading: true })
		.json();
}

/* Thêm chức vụ */
export function fetchAddChucvuItem(data: ChucvuItemType) {
	return request.post("api/ChucVu", {
		json: data,
		ignoreLoading: true,
	});
}

/* Cập nhật chức vụ */
export function fetchUpdateChucvuItem(data: ChucvuItemType) {
	return request.put("api/ChucVu/update", {
		json: data,
		ignoreLoading: true,
	});
}
/* Xóa một bản ghi */
export function fetchDeleteChucvuItem(id: number) {
	return request.delete(`api/ChucVu/${id}`, { ignoreLoading: true });
}

/* Xóa nhiều bản ghi */
export function fetchDeleteChucvuItems(ids: number[]) {
	return request.post("api/ChucVu/DeleteMultipale", {
		json: ids,
		ignoreLoading: true,
	});
}
