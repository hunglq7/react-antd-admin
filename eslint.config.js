import antfu from "@antfu/eslint-config"

export default antfu({
	react: true,
	ignores: ["README.md", "docs/**", "src/router/README.md"],
	rules: {
		"style/quotes": ["error", "double"],
		// --- TẮT TẤT CẢ RULE DẤU CHẤM PHẨY ---
		"style/semi": "off",
		"semi": "off",
		"@typescript-eslint/semi": "off",
		"style/member-delimiter-style": "off",
		// --------------------------------------
		"style/indent": ["error", "tab"],
		"jsonc/indent": ["error", "tab"],
		"style/no-tabs": "off",
		"style/jsx-indent-props": ["error", "tab"],
		"react-hooks/exhaustive-deps": "off",
		"react-refresh/only-export-components": "off",
		"react-hooks-extra/no-direct-set-state-in-use-effect": "off",
		"react/no-clone-element": "off",
		"react/no-use-context": "off",
		"react/no-forward-ref": "off",
		"react/jsx-key-before-spread": "off",
		"react/prefer-use-state-lazy-initialization": "off",
		"react-web-api/no-leaked-resize-observer": "off",
		"jsdoc/check-param-names": "off",
		"jsdoc/check-alignment": "off",
		"jsdoc/require-returns-check": "off",
		"style/no-mixed-spaces-and-tabs": "off",
	},
})
