import type { MayxucItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchMayxucList() {
	return request
		.get<MayxucItemType[]>("api/Mayxuc", { ignoreLoading: true })
		.json();
}

export function fetchAddMayxucItem(data: MayxucItemType) {
	return request.post("api/Mayxuc/add", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateMayxucItem(data: MayxucItemType) {
	return request.put("api/Mayxuc/update", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteMayxucItem(id: number) {
	return request.delete(`api/Mayxuc/${id}`, { ignoreLoading: true });
}

export function fetchDeleteMayxucItems(ids: number[]) {
	return request.post("api/Mayxuc/delete-multiple", {
		json: ids,
		ignoreLoading: true,
	});
}
