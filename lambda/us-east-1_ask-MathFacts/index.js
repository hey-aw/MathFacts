// Math Facts, a math practice skill for Amazon Alexa
// Matt Anthes-Washburn
// Awesomely Done, LLC

const Alexa = require("ask-sdk")
const i18next = require("i18next")
const translations = require("./config/translations")

/**
 * Initialize i18next for localization
 *
 */
i18next.init({
	lng: "en",
	resources: translations,
	returnObjects: true,
}, (err, t) => {
  if (err) return console.log("something went wrong loading i18next", err)
  return t("key") // -> same as i18next.t

})


// Intents
// Launch
// Set Grade Level
// Request practice
// Answer
// Pause
// Stop/Cancel
// Summarize session
// Reminder

// Prompt
// Welcome to Math Facts. I can help you practice the the right operations for your grade level. What is your grade?
// GRADE_LEVEL
const LaunchRequestHandler = {
	canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest"
	},
	handle(handlerInput) {
		const welcome = i18next.t("WELCOME")
		const prompt = i18next.t("WELCOME_PROMPT")
		const speech = `${welcome} ${prompt}`
		const reprompt = i18next.t("WELCOME_REPROMPT")

		return handlerInput.responseBuilder
			.speak(speech)
			.reprompt(reprompt)
			.getResponse()
	}
}

const RequestPracticeHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
		handlerInput.requestEnvelope.request.intent.name === "RequestPracticeIntent"
	},
	handle(handlerInput) {
		// Check for operation type
		// If no operation type ask for it

		// Otherwise, Okay, {operation}. Let's get started.
		return handlerInput.responseBuilder
		.speak("okay, practice!")
		.getResponse()
	}
}

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
		LaunchRequestHandler,
		RequestPracticeHandler
	)
  .lambda()


// Your key operations in Grade 2 are addition and subtraction. Which would you like to practice?
// OPERATION

// Okay, addition. Let's go! What's 2 + 3?
// TERM_A, TERM_B

// if (TERM_A & TERM_B) && slot is a number (check to see if it's right), otherwise (I'm sorry, I didn't hear a number. Try saying the whole equation.)

// Reprompt
// You can say addition, subtraction, multiplication, or division.
