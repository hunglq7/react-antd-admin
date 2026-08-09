import type { TonghopRoleItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export async function fetchTonghoproleList(): Promise<TonghopRoleItemType[]> {
	const response = (await request
		.get("api/TonghopRole", { ignoreLoading: true })
		.json()) as TonghopRoleItemType[] | { data: TonghopRoleItemType[] };

	if (Array.isArray(response)) {
		return response;
	}

	return response?.data ?? [];
}

export function fetchAddTonghoproleItem(data: TonghopRoleItemType) {
	return request
		.post("api/TonghopRole/Add", {
			json: data,
			ignoreLoading: true,
		})
		.json()
		.catch(() => null);
}

export function fetchUpdateTonghoproleItem(data: TonghopRoleItemType) {
	return request
		.put("api/TonghopRole/Update", {
			json: data,
			ignoreLoading: true,
		})
		.json()
		.catch(() => null);
}

export function fetchDeleteTonghoproleItem(id: number) {
	return request
		.delete(`api/TonghopRole/${id}`, { ignoreLoading: true })
		.json()
		.catch(() => null);
}

export function fetchDeleteTonghoproleItems(ids: number[]) {
	return request
		.post("api/TonghopRole/DeleteSelect", {
			json: ids,
			ignoreLoading: true,
		})
		.json();
}
