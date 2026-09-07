import antfu from "@antfu/eslint-config"

export default antfu(
	{
		react: true,
		ignores: ["README.md", "docs/**", "src/router/README.md"],

		// Keep formatting consistent across editors and CI.
		stylistic: {
			indent: "tab",
			quotes: "double",
			semi: false,
		},
	},
	{
		// Project-specific rule overrides.
		rules: {
			"react-hooks/exhaustive-deps": "off",
			"react-refresh/only-export-components": "off",
			"react-hooks-extra/no-direct-set-state-in-use-effect": "off",
			"react/no-direct-set-state-in-use-effect": "off",
			"react-dom/no-direct-set-state-in-use-effect": "off",
			"react-web-api/no-direct-set-state-in-use-effect": "off",
			"react-no-clone-element": "off",
			"react/no-use-context": "off",
			"react/no-forward-ref": "off",
			"react/jsx-key-before-spread": "off",
			"react/prefer-use-state-lazy-initialization": "off",
			"react-web-api/no-leaked-resize-observer": "off",
			"jsdoc/check-param-names": "off",
			"jsdoc/check-alignment": "off",
			"jsdoc/require-returns-check": "off",
			"style/multiline-ternary": "off",
			"style/operator-linebreak": "off",
			"style/arrow-parens": "off",
			"antfu/if-newline": "off",
			"react-hooks/set-state-in-effect": "off",
			"style/brace-style": "off",
			"style/semi": "off",
			"style/quote-props": "off",
			"@typescript-eslint/semi": "off",
			"style/member-delimiter-style": "off",
			"@typescript-eslint/member-delimiter-style": "off",
		},
	},
)
