/* eslint-disable func-names */
const i18next = require("i18next")

module.exports = function (operation){
	const question = {
		operation,
		solution: 0,
		promptText: "",
		solutionText: ""
	}
	// Set up the question based on type
	let slotA
	let slotB
	let solution
	let promptText
	let solutionText
	switch (operation) {
		case "addition":
			slotA = Math.floor((Math.random() * 9) + 1)
			slotB = Math.floor((Math.random() * 9) + 1)
			solution = slotA + slotB
			promptText = i18next.t("QUESTION_ADDITION", {slotA, slotB})
			solutionText = i18next.t("SOLUTION_ADDITION", {slotA, slotB, solution})
			break
		case "subtraction":
			slotA = Math.floor((Math.random() * 9) + 1)
			slotB = Math.floor((Math.random() * slotA) + 1)
			solution = slotA - slotB
			promptText = i18next.t("QUESTION_SUBTRACTION", {slotA, slotB})
			solutionText = i18next.t("SOLUTION_SUBTRACTION", {slotA, slotB, solution})
			break
		case "multiplication":
			slotA = Math.floor((Math.random() * 12) + 1)
			slotB = Math.floor((Math.random() * 12) + 1)
			solution = slotA * slotB
			promptText = i18next.t("QUESTION_MULTIPLICATION", {slotA, slotB})
			solutionText = i18next.t("SOLUTION_MULTIPLICATION", {slotA, slotB, solution})
			break
		case "division":
			slotB = Math.floor((Math.random() * 12) + 1)
			solution = Math.floor((Math.random() * 12) + 1)
			slotA = (slotB * solution)
			promptText = i18next.t("QUESTION_DIVISION", {slotA, slotB})
			solutionText = i18next.t("SOLUTION_DIVISION", {slotA, slotB, solution})
			break
		default:
	}
	question.slotA = slotA
	question.slotB = slotB
	question.solution = solution
	question.promptText = promptText
	question.solutionText = solutionText
	return question
}