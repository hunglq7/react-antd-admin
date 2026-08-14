import type { MaycaoDanhmucItemType } from "./types.ts";
import { request } from "#src/utils/request";

export function fetchMaycaoDanhmucList() {
	return request
		.get<MaycaoDanhmucItemType[]>("api/Danhmucmaycao", { ignoreLoading: true })
		.json();
}

export function fetchAddMaycaoDanhmucItem(data: MaycaoDanhmucItemType) {
	return request.post("api/Danhmucmaycao/add", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateMaycaoDanhmucItem(data: MaycaoDanhmucItemType) {
	return request.put("api/Danhmucmaycao/update", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteMaycaoDanhmucItem(id: number) {
	return request.delete(`api/Danhmucmaycao/${id}`, { ignoreLoading: true });
}

export function fetchDeleteMaycaoDanhmucItems(ids: number[]) {
	return request.post("api/Danhmucmaycao/DeleteMultipale", {
		json: ids,
		ignoreLoading: true,
	});
}
