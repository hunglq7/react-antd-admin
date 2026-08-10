import type { PhanQuyenItemType } from "./types";
import { request } from "#src/utils/request";

export function fetchPhanQuyenList() {
	return request.get<PhanQuyenItemType[]>("api/Roles", { ignoreLoading: true }).json();
}

export function fetchPhanQuyenById(id: number) {
	return request.get<PhanQuyenItemType>(`api/Roles/${id}`, { ignoreLoading: true }).json();
}
export function fetchAddPhanQuyen(data: PhanQuyenItemType) {
	return request.post("api/Roles", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdatePhanQuyen(id: number, data: PhanQuyenItemType) {
	return request.put(`api/Roles/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeletePhanQuyen(id: number) {
	return request.delete(`api/Roles/${id}`, {
		json: id,
		ignoreLoading: true,
	});
}

export function fetchDeletePhanQuyenItems(ids: number[]) {
	return request.delete("api/Roles/DeleteMultipale", {
		json: ids,
		ignoreLoading: true,
	});
}
