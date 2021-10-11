module.exports = {
	env: {
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'@vue/typescript/recommended',
		'@vue/prettier/@typescript-eslint',
		'plugin:prettier/recommended',
		'@vue/prettier',
		'prettier',
	],
	rules: {
		indent: 0,
		'max-len': 0,
		'prettier/prettier': 0,
		'vue/valid-define-props': 2,
		'vue/valid-define-emits': 2,
		'vue/html-indent': 0,
		'vue/max-attributes-per-line': 0,
		'vue/html-self-closing': 0,
		'@typescript-eslint/no-non-null-assertion': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,
	},
	globals: {
		defineProps: 'readonly',
		defineEmits: 'readonly',
		defineExpose: 'readonly',
		withDefaults: 'readonly',
	},
}
