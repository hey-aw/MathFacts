// Math Facts, a math practice skill for Amazon Alexa
// Matt Anthes-Washburn
// Awesomely Done, LLC

const Alexa = require("ask-sdk-core")
const { DynamoDbPersistenceAdapter } = require("ask-sdk-dynamodb-persistence-adapter")
const i18next = require("i18next")
const translations = require("./config/translations.js")
const handlers = require("./app/mathFactsHandlers")

const dynamoDbPersistenceAdapter = new DynamoDbPersistenceAdapter({ tableName : "ask-math-facts-user-table"})

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

exports.handler = Alexa.SkillBuilders.custom()
	.addRequestHandlers(
		handlers.LaunchRequestHandler,
		handlers.SetGradeLevelHandler,
		handlers.RequestPracticeHandler,
		handlers.AttemptAnswerHandler,
		handlers.HelpIntentHandler,
		handlers.StopIntentHandler,
		handlers.FallBackHandler
	)
	.withPersistenceAdapter(dynamoDbPersistenceAdapter)
	.addRequestInterceptors(
		handlers.LocaleInterceptor
	)
	.lambda()