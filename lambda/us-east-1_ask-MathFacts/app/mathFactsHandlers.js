const i18next = require("i18next")
const Question = require("./Question")

// Configuration variables
const QUESTION_LIMIT = 5
const SMALL_IMAGE_URL = "https://s3.amazonaws.com/awzone/Math-Facts-Icons/ASK+Standard+Card+Small.png"
const LARGE_IMAGE_URL = "https://s3.amazonaws.com/awzone/Math-Facts-Icons/ASK+Standard+Card+Large.png"

/**
 * Locale Interceptor
 * sets the locale based on the request
 * @param  {Object} handlerInput
 */
exports.LocaleInterceptor = {
	async process(handlerInput) {
		// Set the language to the request locale
		const { locale } = handlerInput.requestEnvelope.request
		i18next.changeLanguage(locale)
	}
}

/**
 * Launch Request
 */
exports.LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "LaunchRequest"
	},
	handle(handlerInput) {
		const welcome = i18next.t("WELCOME")
		const prompt = i18next.t("WELCOME_PROMPT")
		const speech = `${welcome} ${prompt}`
		const reprompt = i18next.t("WELCOME_REPROMPT")

		// Welcome and ask for the operation
		return handlerInput.responseBuilder
			.speak(speech)
			.reprompt(reprompt)
			.getResponse()
	}
}

/**
 * Practice Operations Request
 */
exports.RequestPracticeHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
			handlerInput.requestEnvelope.request.intent.name === "RequestPracticeIntent"
	},
	handle(handlerInput) {
		let operation
		const allowedOperations = ["addition", "subtraction", "multiplication", "division"]

		// Automatic dialog delegation is enabled
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
		// Find out the operation requested
		const { slots } = handlerInput.requestEnvelope.request.intent // Safe because canHandle checked that it's an intent request

		

		// Set the operation
		if (slots.OPERATION && allowedOperations.includes(slots.OPERATION.value)) {
			operation = slots.OPERATION.value
		} else {
			return handlerInput.responseBuilder
			.speak(`${i18next.t("FALLBACK_INTENT")} ${i18next.t("HELP_PROMPT")}`)
			.reprompt(i18next.t("HELP_PROMPT"))
			.withShouldEndSession(false)
			.getResponse()
		}

		// Get the first problem
		const question = new Question(operation)

		// Store the problem in the session
		sessionAttributes.question = question
		// Say the problem

		// Say, Okay, {operation}. Let's get started.
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes)

		// Prompt the question
		const prompt = i18next.t("PRACTICE_PROMPT", { operation })
		const speech = `${prompt} ${question.promptText}`
		const reprompt = `${i18next.t("PRACTICE_REPROMPT")} ${question.promptText}`

		return handlerInput.responseBuilder
			.speak(speech)
			.reprompt(reprompt)
			.withShouldEndSession(false)
			.getResponse()
	}
}

/**
 * Attempt Answer Intent
 */
exports.AttemptAnswerHandler = {
	canHandle(handlerInput) {
		if (handlerInput.requestEnvelope.request.type === "IntentRequest"
			&& handlerInput.requestEnvelope.request.intent.name === "AttemptIntent") {
			const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
			return sessionAttributes.question
		}
		return false
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
		const { question, question: { operation } } = sessionAttributes
		const { slots } = handlerInput.requestEnvelope.request.intent

		let speech
		let reprompt
		let attemptValue
		let questionsAttempted
		let questionsCorrect

		// Get the vale of the spoken attempt
		if (slots && slots.ATTEMPT && slots.ATTEMPT.resolutions && slots.ATTEMPT.resolutionsPerAuthority) {
			attemptValue = parseInt(slots.ATTEMPT.resolutions.resolutionsPerAuthority[0].values[0].value, 10)
		} else if (slots && slots.ATTEMPT && slots.ATTEMPT.value) {
			attemptValue = parseInt(slots.ATTEMPT.value, 10)
		}

		questionsCorrect = sessionAttributes.questionsCorrect || 0

		// If the attempt is correct
		if (attemptValue === question.solution) {
			speech = `${i18next.t("ATTEMPT_CORRECT")} ${question.solutionText}`

			// Increment questions correct
			questionsCorrect += 1
			sessionAttributes.questionsCorrect = questionsCorrect
		} else { // attempt is incorrect
			// Prompt with repetition
			speech = `${i18next.t("ATTEMPT_INCORRECT")} ${question.solutionText} ${i18next.t("ATTEMPT_INCORRECT_PROMPT")} ${question.solutionText} ${question.solutionText} ${question.solutionText}`
		}

		// Increment questionsAttempted
		questionsAttempted = sessionAttributes.questionsAttempted || 0
		questionsAttempted += 1
		sessionAttributes.questionsAttempted = questionsAttempted

		// If questions attempted is still below the limit
		if (questionsAttempted < QUESTION_LIMIT) {
			// Ask new question
			const newQuestion = new Question(operation)
			sessionAttributes.question = newQuestion
			speech = `${speech} ${newQuestion.promptText}`
			reprompt = `${i18next.t("PRACTICE_REPROMPT")} ${sessionAttributes.question.promptText}`
			handlerInput.responseBuilder
				.withShouldEndSession(false)

		} else {
			// Summarize session and prompt for more practice or goodbye
			const summary = i18next.t("SUMMARY", { questionsCorrect, questionsAttempted })
			const ratio = questionsCorrect / questionsAttempted
			if (ratio > 0.8) {
				const congratsArray = i18next.t("CONGRATULATIONS")
				const congrats = congratsArray[Math.floor(Math.random() * congratsArray.length)]
				speech = `${summary} ${congrats} ${i18next.t("RETRY_PROMPT", { operation })}`
			} else {
				const congrats = i18next.t("CONGRATULATIONS_MEH")
				speech = `${summary} ${congrats} ${i18next.t("RETRY_PROMPT", { operation })}`
			}
			reprompt = i18next.t("RETRY_REPROMPT")

			// Present card
			const cardTitle = i18next.t("CARDTITLES")[operation]
			handlerInput.responseBuilder
				.withStandardCard(cardTitle, summary, SMALL_IMAGE_URL, LARGE_IMAGE_URL)
				.withShouldEndSession(true)

			// Clear session
			sessionAttributes.questionsAttempted = 0
			sessionAttributes.questionsCorrect = 0
			delete sessionAttributes.question
		}

		// Save session attributes
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes)

		return handlerInput.responseBuilder
			.speak(speech)
			.reprompt(reprompt)
			.getResponse()
	}
}

/**
 * Help Intent
 * Built-in
 */
exports.HelpIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "IntentRequest"
			&& handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
	},
	handle(handlerInput) {

		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
		const {question} = sessionAttributes
		if (question) {
			handlerInput.responseBuilder
			.speak(`${i18next.t("REPEAT")} ${question.promptText}`)
		} else {
			handlerInput.responseBuilder
			.speak(i18next.t("HELP_PROMPT"))
		}
		return handlerInput.responseBuilder
			.getResponse()
	}
}

/**
 * Stop or Cancel or Navigate Home
 * Built-in intents
 */
exports.StopIntentHandler = {
	canHandle(handlerInput) {
		const intentNames = [
			"AMAZON.StopIntent",
			"AMAZON.CancelIntent",
			"AMAZON.NavigateHomeIntent"
		]
		return handlerInput.requestEnvelope.request.type === "IntentRequest"
		&& intentNames.includes(handlerInput.requestEnvelope.request.intent.name)

	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(i18next.t("GOODBYE"))
			.withShouldEndSession(true)
			.getResponse()
	}
}

/**
 * Fallback Intent
 */
exports.FallBackHandler = {
	canHandle() {
		return true
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
		const {question} = sessionAttributes
		if (question) {
			handlerInput.responseBuilder
			.speak(`${i18next.t("FALLBACK_INTENT")} ${question.promptText}`)
			.reprompt(question.promptText)
		} else {
			handlerInput.responseBuilder
			.speak(`${i18next.t("FALLBACK_INTENT")} ${i18next.t("HELP_PROMPT")}`)
			.reprompt(i18next.t("HELP_PROMPT"))
		}

		return handlerInput.responseBuilder
			.getResponse()
	}
}


