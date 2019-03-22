const i18next = require("i18next")

const Question = require("../app/Question")
const translations = require("../config/translations")

/**
 * Initialize i18next for localization
 *
 */
i18next.init({
	lng: "en-US",
	resources: translations,
	returnObjects: true,
}, (err, t) => {
	if (err) return console.log("something went wrong loading i18next", err)
	return t("key") // -> same as i18next.t

})

describe("Question constructor", () => {
	test("addition", () => {
		const question = new Question("addition")
		expect(question.solution).toEqual(question.slotA + question.slotB)
		expect(question.promptText).toEqual(`What is ${question.slotA} plus ${question.slotB}?`)
		expect(question.solutionText).toEqual(`${question.slotA} plus ${question.slotB} equals ${question.slotA + question.slotB}.`)
	})

	test("subtraction", () => {
		const newQuestion = new Question("subtraction")
		expect(newQuestion.solution).toEqual(newQuestion.slotA - newQuestion.slotB)
	})

	test("multiplication", () => {
		const newQuestion = new Question("multiplication")
		expect(newQuestion.solution).toEqual(newQuestion.slotA * newQuestion.slotB)
	})
	
	test("division", () => {
		const question = new Question("division")
		expect(question.solution).toEqual(question.slotA / question.slotB)
		expect(question.promptText).toEqual(`What is ${question.slotA} divided by ${question.slotB}?`)
		expect(question.solutionText).toEqual(`${question.slotA} divided by ${question.slotB} equals ${question.solution}.`)
	})

})
