import type {
	NhatkymayxucItemType,
	NhatkymayxucUpdatePayload,
} from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchNhatkymayxucListByTonghopId(id: number) {
	return request
		.get<NhatkymayxucItemType>(`api/Nhatkymayxuc/tonghop/${id}`, {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddNhatkymayxucItem(data: NhatkymayxucItemType) {
	return request.post("api/Nhatkymayxuc", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateNhatkymayxucItem(
	id: number,
	data: NhatkymayxucUpdatePayload,
) {
	return request.put(`api/Nhatkymayxuc/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteNhatkymayxucItem(id: number) {
	return request.delete(`api/Nhatkymayxuc/${id}`, { ignoreLoading: true });
}

export function fetchDeleteNhatkymayxucItems(ids: number[]) {
	return request.post("api/Nhatkymayxuc/delete-multiple", {
		json: ids,
		ignoreLoading: true,
	});
}
