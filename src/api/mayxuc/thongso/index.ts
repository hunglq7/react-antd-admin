import type { ThongsokythuatmayxucItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchThongsokythuatmayxucList() {
	return request
		.get<ThongsokythuatmayxucItemType[]>("api/Thongsokythuatmayxuc", { ignoreLoading: true })
		.json();
}

export function fetchAddThongsokythuatmayxucItem(
	data: ThongsokythuatmayxucItemType,
) {
	return request.post("api/Thongsokythuatmayxuc", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateThongsokythuatmayxucItem(
	data: ThongsokythuatmayxucItemType,
) {
	return request.put("api/Thongsokythuatmayxuc/update", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteThongsokythuatmayxucItem(id: number) {
	return request.delete(`api/Thongsokythuatmayxuc/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteThongsokythuatmayxucItems(ids: number[]) {
	return request.post("api/Thongsokythuatmayxuc/delete-multiple", {
		json: ids,
		ignoreLoading: true,
	});
}
