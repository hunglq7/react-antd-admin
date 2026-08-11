export interface NhatkymayxucItemType {
	id?: number
	tonghopmayxucId?: number
	ngaythang?: string
	donVi?: string
	viTri?: string
	trangThai?: string
	ghiChu?: string
}

export interface NhatkymayxucCreatePayload {
	tonghopmayxucId: number
	ngaythang?: string
	donVi?: string
	viTri?: string
	trangThai?: string
	ghiChu?: string
}

export interface NhatkymayxucUpdatePayload extends NhatkymayxucItemType { }
