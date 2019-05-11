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
		const {
			locale
		} = handlerInput.requestEnvelope.request
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
		return new Promise((resolve) => {
			const welcome = i18next.t("WELCOME")
			const prompt = i18next.t("WELCOME_PROMPT")
			const speech = `${welcome} ${prompt}`
			const reprompt = i18next.t("WELCOME_REPROMPT")

			// Set up persistent attributes
			// handlerInput.attributesManager.getPersistentAttributes()
			// 	.then((attributes) => {
			// 		const persistentAttributes = attributes || {}
			// 		console.log(`persistent attributes: ${JSON.stringify(persistentAttributes)}`)
			// 		// Increment session count
			// 		let { sessionCount } = persistentAttributes
			// 		console.log(`persisted session count: ${sessionCount}`)
			// 		if (sessionCount) {
			// 			welcome = i18next.t("WELCOME_BACK")
			// 			sessionCount += 1
			// 		} else {
			// 			sessionCount = 1
			// 		}
			// 		console.log(`new session count: ${sessionCount}`)
			// 		persistentAttributes.sessionCount = sessionCount
			// 		handlerInput.attributesManager.setPersistentAttributes(persistentAttributes)
			// 		console.log(`new session attributes: ${JSON.stringify(persistentAttributes)}`)
			// 	})
			// 	.then(() => {
			// 		// Welcome and ask for the operation
			// 		resolve(handlerInput.responseBuilder
			// 			.speak(speech)
			// 			.reprompt(reprompt)
			// 			.getResponse()
			// 		)
			// 	})
			// 	.catch((error) => {
			// 		reject(error)
			// 	})
			resolve(handlerInput.responseBuilder
				.speak(speech)
				.reprompt(reprompt)
				.getResponse()
			)
		})
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
		const {
			slots
		} = handlerInput.requestEnvelope.request.intent // Safe because canHandle checked that it's an intent request



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
		question.turn = 0

		// Set up players
		question.playerCurrent = 0 // TODO: support multiplayer
		question.players = {
			operation
		}

		// Store the problem in the session
		sessionAttributes.question = question
		// Say the problem

		// Say, Okay, {operation}. Let's get started.
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes)

		// Prompt the question
		const prompt = i18next.t("PRACTICE_PROMPT", {
			operation
		})
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
		if (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
			handlerInput.requestEnvelope.request.intent.name === "AttemptIntent") {
			const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
			return sessionAttributes.question
		}
		return false
	},
	handle(handlerInput) {
		let playerCurrent
		let speech
		let reprompt
		let attemptValue

		const {
			slots
		} = handlerInput.requestEnvelope.request.intent
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
		const {
			question,
			players,
			playerIndex
		} = sessionAttributes

		// Set up current player
		if (players && players[playerIndex]) {
			playerCurrent = players[playerIndex]
		}

		if (!playerCurrent) {
			playerCurrent = {
				operation: question.operation,
				score: 0,
				turnCount: 0
			}
		}

		// Is it correct?

		// Get the vale of the spoken attempt
		if (slots && slots.ATTEMPT && slots.ATTEMPT.resolutions && slots.ATTEMPT.resolutionsPerAuthority) {
			attemptValue = parseInt(slots.ATTEMPT.resolutions.resolutionsPerAuthority[0].values[0].value, 10)
		} else if (slots && slots.ATTEMPT && slots.ATTEMPT.value) {
			attemptValue = parseInt(slots.ATTEMPT.value, 10)
		}


		// If the attempt is correct
		if (attemptValue === question.solution) {
			speech = `${i18next.t("ATTEMPT_CORRECT")} ${question.solutionText}`

			playerCurrent.score += 1



		} else { // attempt is incorrect
			// Prompt with repetition
			speech = `${i18next.t("ATTEMPT_INCORRECT")} ${question.solutionText}`



			// Add try again only if single player
			const tryAgainString = `${i18next.t("ATTEMPT_INCORRECT_PROMPT")} ${question.solutionText} ${question.solutionText} ${question.solutionText}`


			if (players && players.length < 2) {
				speech = `${speech} ${tryAgainString}`
			}
		}


		// Check to see if this player gets another question

		// If turn count is not at turn limit

		// Ask another question

		// Contingue (turn count is at turn limit)

		// Check to see who should get the next question

		// If currently player 1 and there are two players, give to player 2

		// If currently player 2, check the score

		// If there is a winner, call it

		// If there is a tie, set lightning mode and go back to player 1




		// If questions attempted is still below the limit
		if (playerCurrent.turnCount < QUESTION_LIMIT) {

			// Ask new question
			const newQuestion = new Question(question.operation)
			playerCurrent.turnCount += 1
			sessionAttributes.question = newQuestion
			sessionAttributes.players[playerIndex] = playerCurrent

			speech = `${speech} ${newQuestion.promptText}`
			reprompt = `${i18next.t("PRACTICE_REPROMPT")} ${sessionAttributes.question.promptText}`
			handlerInput.responseBuilder
				.withShouldEndSession(false)

		} else {
			// Summarize session and prompt for more practice or goodbye
			const summary = i18next.t("SUMMARY", {
				questionsCorrect: playerCurrent.score,
				questionsAttempted: playerCurrent.turnCount
			})
			const ratio = playerCurrent.score / playerCurrent.turnCount
			if (ratio > 0.8) {
				const congratsArray = i18next.t("CONGRATULATIONS")
				const congrats = congratsArray[Math.floor(Math.random() * congratsArray.length)]
				speech = `${summary} ${congrats} ${i18next.t("RETRY_PROMPT", question.operation)}`
			} else {
				const congrats = i18next.t("CONGRATULATIONS_MEH")
				speech = `${summary} ${congrats} ${i18next.t("RETRY_PROMPT", question.operation)}`
			}
			reprompt = i18next.t("RETRY_REPROMPT")

			// Present card
			const cardTitle = i18next.t("CARDTITLES")[question.operation]
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
		return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
			handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
	},
	handle(handlerInput) {

		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
		const {
			question
		} = sessionAttributes
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
		return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
			intentNames.includes(handlerInput.requestEnvelope.request.intent.name)
	},
	handle(handlerInput) {

		// Save persisistent attributes
		// handlerInput.attributesManager.getPersistentAttributes()
		// 	.then((attributes) => {
		// 		console.log(`attributes I'm going to save ${JSON.stringify(attributes)}`)
		// 		handlerInput.attributesManager.savePersistentAttributes(attributes)
		// 	})
		// 	.catch((error) => {
		// 		console.error(error)
		// 	})

		return handlerInput.responseBuilder
			.speak(i18next.t("GOODBYE"))
			.withShouldEndSession(true)
			.getResponse()
	}
}

/**
 * Session ended request
 */
// exports.SessionEndedHandler = {
// 	canHandle(handlerInput) {
// 		return handlerInput.requestEnvelope.request.type === "SessionEndedRequest"
// 	},
// 	handle(handlerInput) {
// 		return handlerInput.attributesManager.savePersistentAttributes()
// 	}
// }


/**
 * Fallback Intent
 */
exports.FallBackHandler = {
	canHandle() {
		return true
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
		const {
			question
		} = sessionAttributes
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