import type { NhatkymaycaoItemType } from "#src/api/maycao/nhatky/types"
import { request } from "#src/utils/request"

export function fetchNhatkymaycaoListByTonghopId(id: number) {
	return request
		.get<NhatkymaycaoItemType>(`api/Nhatkymaycao/tonghop/${id}`, {
			ignoreLoading: true,
		})
		.json()
}

export function fetchAddNhatkymaycaoItem(data: NhatkymaycaoItemType) {
	return request.post("api/Nhatkymaycao", {
		json: data,
		ignoreLoading: true,
	})
}

export function fetchUpdateNhatkymaycaoItem(
	id: number,
	data: NhatkymaycaoItemType,
) {
	return request.put(`api/Nhatkymaycao/${id}`, {
		json: data,
		ignoreLoading: true,
	})
}

export function fetchDeleteNhatkymaycaoItem(id: number) {
	return request.delete(`api/Nhatkymaycao/${id}`, { ignoreLoading: true })
}

export function fetchDeleteNhatkymaycaoItems(ids: number[]) {
	return request.post("api/Nhatkymaycao/delete-multiple", {
		json: ids,
		ignoreLoading: true,
	})
}
