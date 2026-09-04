import type { DonviItemType } from "./types";
import { request } from "#src/utils/request";

/* Đọc bảng chức vụ */
export function fetchDonviList() {
	return request
		.get<DonviItemType[]>("api/Donvi", { ignoreLoading: true })
		.json();
}

/* Thêm chức vụ */
export function fetchAddDonviItem(data: DonviItemType) {
	return request.post("api/Donvi", {
		json: data,
		ignoreLoading: true,
	});
}

/* Cập nhật chức vụ */
export function fetchUpdateDonviItem(data: DonviItemType) {
	return request.put("api/Donvi/update", {
		json: data,
		ignoreLoading: true,
	});
}
/* Xóa một bản ghi */
export function fetchDeleteDonviItem(id: number) {
	return request.delete(`api/Donvi/${id}`, { ignoreLoading: true });
}

/* Xóa nhiều bản ghi */
export function fetchDeleteDonviItems(ids: number[]) {
	return request.post("api/Donvi/DeleteMultipale", {
		json: ids,
		ignoreLoading: true,
	});
}
