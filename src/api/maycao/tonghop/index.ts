import type { MaycaoTonghopItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchTonghopmaycaoList() {
	return request
		.get<MaycaoTonghopItemType[]>("api/Tonghopmaycao", { ignoreLoading: true })
		.json();
}

export function fetchTonghopmaycaoById(id: number) {
	return request
		.get<MaycaoTonghopItemType>(`api/Tonghopmaycao/${id}`, {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddTonghopmaycaoItem(data: MaycaoTonghopItemType) {
	return request.post("api/Tonghopmaycao/Add", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateTonghopmaycaoItem(data: MaycaoTonghopItemType) {
	return request.put("api/Tonghopmaycao/update", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteTonghopmaycaoItem(id: number) {
	return request.delete(`api/Tonghopmaycao/${id}`, { ignoreLoading: true });
}

export function fetchDeleteTonghopmaycaoItems(ids: number[]) {
	return request.post("api/Tonghopmaycao/DeleteMultiple", {
		json: ids,
		ignoreLoading: true,
	});
}
