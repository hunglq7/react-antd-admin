// import type { TFunction } from "i18next";

export const getLanguageItems: () => any = (
	// t: TFunction<"translation", undefined>,
) => {
	return [
		{
			label: "Tiếng Việt",
			// Menu
			key: "zh-CN",
			// Select
			value: "zh-CN",
		},
		{
			label: "English",
			// Menu
			key: "en-US",
			// Select
			value: "en-US",
		},
	]
}
