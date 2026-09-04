import type { UserInfoType } from "#src/api/user/types";

import { create } from "zustand";
import { fetchUserInfo } from "#src/api/user";

const initialState = {
	id: "",
	avatar: "",
	firstName: "",
	lastName: "",
	dob: "",
	username: "",
	email: "",
	phoneNumber: "",
	description: "",
	roles: [],
	// menus: [],
};

type UserState = UserInfoType;

interface UserAction {
	getUserInfo: () => Promise<UserInfoType>
	update: (user: Partial<UserInfoType>) => void
	reset: () => void
};

export const useUserStore = create<UserState & UserAction>()(

	set => ({
		...initialState,

		getUserInfo: async () => {
			const response = await fetchUserInfo();
			set({
				...response,
			});
			return response;
		},

		update: user => set(user),

		reset: () => {
			return set({
				...initialState,
			});
		},

	}),

);
