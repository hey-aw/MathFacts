module.exports = {
	extends: ["airbnb-base", "prettier"],
	parserOptions: {
		ecmaVersion: 8,
		sourceType: "module"
	},
	parser: "babel-eslint",
	plugins: ["prettier"],
	env: {
		es6: true,
		jest: true
	},
	rules: {
		"no-unused-vars": ["error", { varsIgnorePattern: "[iI]gnored" }],
		semi: ["error", "never"],
		"no-extra-semi": "error",
		quotes: ["error", "double"],
		"no-console": "off",
    "prefer-destructuring": ["error", {
      "VariableDeclarator": {
        "array": true,
        "object": true
      },
      "AssignmentExpression": {
        "array": false,
        "object": false
      }
    }, {
      "enforceForRenamedProperties": false
		}],
		camelcase: "error"
  }
}
