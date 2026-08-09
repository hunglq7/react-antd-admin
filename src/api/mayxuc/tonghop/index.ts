import type { TonghopmayxucItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchTonghopmayxucList() {
	return request
		.get<TonghopmayxucItemType[]>("api/Tonghopmayxuc", { ignoreLoading: true })
		.json();
}

export function fetchTonghopmayxucById(id: number) {
	return request
		.get<TonghopmayxucItemType>(`api/Tonghopmayxuc/${id}`, {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddTonghopmayxucItem(data: TonghopmayxucItemType) {
	return request.post("api/Tonghopmayxuc/Add", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateTonghopmayxucItem(data: TonghopmayxucItemType) {
	return request.put("api/Tonghopmayxuc/update", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteTonghopmayxucItem(id: number) {
	return request.delete(`api/Tonghopmayxuc/${id}`, { ignoreLoading: true });
}

export function fetchDeleteTonghopmayxucItems(ids: number[]) {
	return request.post("api/Tonghopmayxuc/DeleteMultiple", {
		json: ids,
		ignoreLoading: true,
	});
}
