import type { TaikhoanItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchTaikhoanList() {
	return request
		.get<TaikhoanItemType[]>("api/Users/getall", { ignoreLoading: true })
		.json();
}

export function fetchAddTaikhoan(data: TaikhoanItemType) {
	return request
		.post("api/Users", {
			json: data,
			ignoreLoading: true,
		});
}

export function fetchUpdateTaikhoan(id: number, data: TaikhoanItemType) {
	return request
		.put(`api/Users/${id}`, {
			json: data,
			ignoreLoading: true,
		})
}

export function fetchDeleteTaikhoan(id: number) {
	return request
		.delete(`api/Users/${id}`, {
			json: id,
			ignoreLoading: true,
		});
}

export function fetchDeleteMutipleTaikhoan(ids: number[]) {
	return request
		.delete("api/Users/DeleteMultipale", {
			json: ids,
			ignoreLoading: true,
		});
}
