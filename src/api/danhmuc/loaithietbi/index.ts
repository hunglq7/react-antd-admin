import type { LoaithietbiItemType } from "./types";
import { request } from "#src/utils/request";

/* Đọc bảng loại thiết bị */
export function fetchLoaithietbiList() {
	return request
		.get<LoaithietbiItemType[]>("api/Loaithietbi", { ignoreLoading: true })
		.json();
}

/* Thêm loại thiết bị */
export function fetchAddLoaithietbiItem(data: LoaithietbiItemType) {
	return request.post("api/Loaithietbi", {
		json: data,
		ignoreLoading: true,
	});
}

/* Cập nhật loại thiết bị */
export function fetchUpdateLoaithietbiItem(data: LoaithietbiItemType) {
	return request.put("api/Loaithietbi/update", {
		json: data,
		ignoreLoading: true,
	});
}
/* Xóa một bản ghi */
export function fetchDeleteLoaithietbiItem(id: number) {
	return request.delete(`api/Loaithietbi/${id}`, { ignoreLoading: true });
}

/* Xóa nhiều bản ghi */
export function fetchDeleteLoaithietbiItems(ids: number[]) {
	return request.post("api/Loaithietbi/DeleteSelected", {
		json: ids,
		ignoreLoading: true,
	});
}
