import type { MaycaoThongsoItemType } from "./types";
import { request } from "#src/utils/request";

export function fetchThongsokythuatmaycaoList() {
	return request
		.get<MaycaoThongsoItemType[]>("api/Thongsokythuatmaycao", { ignoreLoading: true })
		.json();
}

export function fetchAddThongsokythuatmaycaoItem(
	data: MaycaoThongsoItemType,
) {
	return request.post("api/Thongsokythuatmaycao", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateThongsokythuatmaycaoItem(
	data: MaycaoThongsoItemType,
) {
	return request.put("api/Thongsokythuatmaycao/update", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteThongsokythuatmaycaoItem(id: number) {
	return request.delete(`api/Thongsokythuatmaycao/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteThongsokythuatmaycaoItems(ids: number[]) {
	return request.post("api/Thongsokythuatmaycao/DeleteMultiple", {
		json: ids,
		ignoreLoading: true,
	});
}
