import { request } from "#src/utils/request";

export interface PieDataType {
	value: number
	code: string
}
export function fetchPie(data: { by: string | number }) {
	return request
		.get("api/home/pie", { searchParams: data })
		.json<ApiResponse<PieDataType[]>>();
}

export function fetchLine(data: { range: string }) {
	return request
		.post("api/home/line", { json: data })
		.json<ApiResponse<string[]>>();
}
