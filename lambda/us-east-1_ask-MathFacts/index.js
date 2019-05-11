// Math Facts, a math practice skill for Amazon Alexa
// Matt Anthes-Washburn
// Awesomely Done, LLC

const Alexa = require("ask-sdk")
const i18next = require("i18next")
const translations = require("./config/translations.js")
const handlers = require("./app/mathFactsHandlers")

// const ENV_NAME = process.env.ENV_NAME || "TEST"
// const TABLE_NAME = `MathFactsUserTable${ENV_NAME}`

/**
 * Initialize i18next for localization
 *
 */
i18next.init({
	lng: "en-US",
	fallbackLng: "en-US",
	resources: translations,
	returnObjects: true,
}, (err, t) => {
	if (err) return console.log("something went wrong loading i18next", err)
	return t("key") // -> same as i18next.t
})

exports.handler = Alexa.SkillBuilders.standard()
	.addRequestHandlers(
		handlers.LaunchRequestHandler,
		handlers.RequestPracticeHandler,
		handlers.AttemptAnswerHandler,
		handlers.HelpIntentHandler,
		handlers.StopIntentHandler,
		// handlers.SessionEndedHandler,
		handlers.FallBackHandler
	)
	.addRequestInterceptors(
		handlers.LocaleInterceptor
	)
	// .withTableName(TABLE_NAME)
	// .withAutoCreateTable(true)
	.lambda()