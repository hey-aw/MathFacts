/* eslint-env node, jest */
const MathFacts = require("../index")

const {
	handler
} = MathFacts
const context = {} // Lambda context we don't need
function Event() {
	return ({
		version: "1.0",
		session: {
			new: true,
			sessionId: "amzn1.echo-api.session.ID",
			application: {
				applicationId: "amzn1.ask.skill.ID"
			},
			attributes: {},
			user: {
				userID: "userID",
				accessToken: "accessToken",
				permissions: {}
			}
		},
		context: {
			System: {
				device: {
					deviceId: "string",
					supportedInterfaces: {
						AudioPlayer: {}
					}
				},
				application: {
					applicationId: "amzn1.ask.skill.[unique-value-here]"
				},
				user: {
					userId: "amzn1.ask.account.[unique-value-here]",
					accessToken: "Atza|AAAAAAAA...",
					permissions: {
						consentToken: "ZZZZZZZ..."
					}
				},
				apiEndpoint: "https://api.amazonalexa.com",
				apiAccessToken: "AxThk..."
			},
			AudioPlayer: {
				playerActivity: "PLAYING",
				token: "audioplayer-token",
				offsetInMilliseconds: 0
			}
		},
		request: {},
	})
}

function IntentRequestEvent() {
	const event = new Event
	event.request = {
		"type": "IntentRequest",
		"requestId": "string",
		"timestamp": "string",
		"dialogState": "string",
		"locale": "string",
		"intent": {
			"name": "string",
			"confirmationStatus": "string",
			"slots": {
				"SlotName": {
					"name": "string",
					"value": "string",
					"confirmationStatus": "string",
					"resolutions": {
						"resolutionsPerAuthority": [{
							"authority": "string",
							"status": {
								"code": "string"
							},
							"values": [{
								"value": {
									"name": "string",
									"id": "string"
								}
							}]
						}]
					}
				}
			}
		}
	}
	return event
}


/**
 * Attempt
 */
describe("Attempt Intent", () => {
	test("addition, correct", (done) => {
		const event = new IntentRequestEvent
		event.request.intent.name = "AttemptIntent"
		event.request.intent.slots.ATTEMPT = {
			"name": "ATTEMPT",
			"value": "7",
			"confirmationStatus": "NONE",
			"source": "USER"
		}
		event.session.attributes = {
			question: {
				operation: "addition",
				solution: 7,
				promptText: "What is 5 plus 2?",
				solutionText: "5 plus 2 equals 7."
			},
			playerIndex: 0,
			players: [{
					operation: "addition",
					turnCount: 2,
					score: 1
				},
				{
					operation: "multiplication",
					turnCount: 2,
					score: 2
				}
			]
		}

		// Congratulate and present with a new question
		const outputSpeech = `That's it! ${event.session.attributes.question.solutionText} What is`

		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) {
				console.error(error)
			}
			expect(result.response.outputSpeech.ssml).toContain(outputSpeech)
			return done()
		}

		// Call the handler
		handler(event, context, callback)


	})
	test("addition, incorrect", (done) => {
		const event = new IntentRequestEvent
		event.request.intent.name = "AttemptIntent"
		event.request.intent.slots.ATTEMPT = {
			"name": "ATTEMPT",
			"value": "11",
			"confirmationStatus": "NONE",
			"source": "USER"
		}
		event.session.attributes = {
			question: {
				operation: "addition",
				solution: 7,
				promptText: "What is 5 plus 2?",
				solutionText: "5 plus 2 equals 7."
			},
			playerIndex: 0,
			players: [{
					operation: "addition",
					turnCount: 2,
					score: 1
				},
				{
					operation: "multiplication",
					turnCount: 2,
					score: 2
				}
			]
		}

		// Congratulate and present with a new question
		const outputSpeech = `That's not quite it. ${event.session.attributes.question.solutionText} What is`

		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) {
				console.error(error)
			}
			expect(result.response.outputSpeech.ssml).toContain(outputSpeech)
			return done()
		}

		// Call the handler
		handler(event, context, callback)


	})
	describe("Questions attempted", () => {
		test("fourth question, correct", (done) => {
			const event = new IntentRequestEvent
			event.request.intent.name = "AttemptIntent"
			event.request.intent.slots.ATTEMPT = {
				"name": "ATTEMPT",
				"value": "7",
				"confirmationStatus": "NONE",
				"source": "USER"
			}
			event.session.attributes = {
				question: {
					operation: "addition",
					solution: 7,
					promptText: "What is 5 plus 2?",
					solutionText: "5 plus 2 equals 7."
				},
				playerIndex: 0,
				players: [{
						operation: "addition",
						turnCount: 3,
						score: 3
					},
					{
						operation: "multiplication",
						turnCount: 2,
						score: 2
					}
				]
			}

			// Congratulate and present with a new question
			const outputSpeech = `That's it! ${event.session.attributes.question.solutionText} What is`

			// Define callback
			expect.hasAssertions()

			const callback = (error, result) => {
				if (error) return done.fail(error)
				expect(result.sessionAttributes.players[0].turnCount).toEqual(4)
				expect(result.sessionAttributes.players[0].score).toEqual(4)
				expect(result.response.outputSpeech.ssml).toContain(outputSpeech)
				return done()
			}

			// Call the handler
			handler(event, context, callback)
		})

		test("fourth question, incorrect", (done) => {
			const event = new IntentRequestEvent
			event.request.intent.name = "AttemptIntent"
			event.request.intent.slots.ATTEMPT = {
				"name": "ATTEMPT",
				"value": "99",
				"confirmationStatus": "NONE",
				"source": "USER"
			}
			event.session.attributes = {
				question: {
					operation: "addition",
					solution: 7,
					promptText: "What is 5 plus 2?",
					solutionText: "5 plus 2 equals 7."
				},
				playerIndex: 0,
				players: [{
						operation: "addition",
						turnCount: 3,
						score: 3
					},
					{
						operation: "multiplication",
						turnCount: 2,
						score: 2
					}
				]
			}
			// Congratulate and present with a new question
			const outputSpeech = "<speak>That's not quite it. 5 plus 2 equals 7. What is "

			// Define callback
			expect.hasAssertions()

			const callback = (error, result) => {
				if (error) return done.fail(error)
				expect(result.sessionAttributes.players[0].turnCount).toEqual(4)
				expect(result.sessionAttributes.players[0].score).toEqual(3)
				expect(result.response.outputSpeech.ssml).toContain(outputSpeech)
				return done()
			}

			// Call the handler
			handler(event, context, callback)
		})

		test.skip("fifth question, winner", (done) => {
			const event = new IntentRequestEvent
			event.request.intent.name = "AttemptIntent"
			event.request.intent.slots.ATTEMPT = {
				"name": "ATTEMPT",
				"value": "7",
				"confirmationStatus": "NONE",
				"source": "USER"
			}
			event.session.attributes = {
				question: {
					operation: "addition",
					solution: 7,
					promptText: "What is 5 plus 2?",
					solutionText: "5 plus 2 equals 7."
				},
				playerIndex: 1,
				players: [{
						operation: "addition",
						turnCount: 5,
						score: 4
					},
					{
						operation: "multiplication",
						turnCount: 4,
						score: 4
					}
				]
			}

			// Define callback
			expect.hasAssertions()

			const callback = (error, result) => {
				if (error) return done.fail(error)
				expect(result.sessionAttributes.players[1].turnCount).toEqual(5)
				expect(result.sessionAttributes.players[1].score).toEqual(5)
				expect(result.response.outputSpeech.ssml).toContain("Player 2, you win!")
				expect(result.response.card.title).toEqual("Addition Practice")
				return done()
			}

			// Call the handler
			handler(event, context, callback)
		})
		test.skip("fifth question, tie, lightning mode", (done) => {
			const event = new IntentRequestEvent
			event.request.intent.name = "AttemptIntent"
			event.request.intent.slots.ATTEMPT = {
				"name": "ATTEMPT",
				"value": "7",
				"confirmationStatus": "NONE",
				"source": "USER"
			}
			event.session.attributes = {
				"questionsAttempted": 4,
				"questionsCorrect": 4,
				"question": {
					"operation": "addition",
					"solution": 7,
					"promptText": "What is 5 plus 2?",
					"solutionText": "5 plus 2 equals 7."
				}
			}

			// Define callback
			expect.hasAssertions()

			const callback = (error, result) => {
				if (error) return done.fail(error)
				expect(result.sessionAttributes.questionsAttempted).toEqual(0)
				expect(result.sessionAttributes.questionsCorrect).toEqual(0)
				expect(result.response.outputSpeech.ssml).toContain("You got 5 correct out of 5.")
				expect(result.response.outputSpeech.ssml).not.toContain("Keep practicing")
				return done()
			}

			// Call the handler
			handler(event, context, callback)
		})
	})
})


describe.skip("Help Intent", () => {
	test("When no question in the session, responds to Help Intent Request", (done) => {
		const event = new IntentRequestEvent
		event.request.intent.name = "AMAZON.HelpIntent"
		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) return done.fail(error)
			expect(result.response.outputSpeech.ssml).toContain("You can say addition, subtraction, multiplication or division.")
			return done()
		}

		// Call the handler
		handler(event, context, callback)
	})

	test("When there is a question in the session, repeats the question.", (done) => {
		const event = new IntentRequestEvent
		event.request.intent.name = "AMAZON.HelpIntent"

		event.session.attributes = {
			"questionsAttempted": 4,
			"questionsCorrect": 4,
			"question": {
				"operation": "subtraction",
				"solution": 3,
				"promptText": "What is 5 take away 2?",
				"solutionText": "5 take away 2 equals 3."
			}
		}
		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) {
				console.error(error)
			}
			expect(result.response.outputSpeech.ssml).toContain("I'll repeat the question. What is 5 take away 2?")
			return done()
		}

		// Call the handler
		handler(event, context, callback)
	})
})


describe.skip("Stop Intent", () => {
	test("Says goodbye and closes the session", (done) => {
		const event = new IntentRequestEvent
		event.request.intent.name = "AMAZON.StopIntent"

		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) return done.fail(error)
			expect(result.response.outputSpeech.ssml).toEqual("<speak>Goodbye.</speak>")
			return done()
		}

		// Call the handler
		handler(event, context, callback)
	})
})


describe.skip("Cancel Intent", () => {
	test("Cancel Intent Says goodbye and closes the session", (done) => {
		const event = new IntentRequestEvent
		event.request.intent.name = "AMAZON.CancelIntent"

		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) return done.fail(error)
			expect(result.response.outputSpeech.ssml).toEqual("<speak>Goodbye.</speak>")
			return done()
		}

		// Call the handler
		handler(event, context, callback)
	})
})

describe.skip("Fallback Intent", () => {
	test("When no question, fallback intent replies with fallback prompt", (done) => {
		const event = new IntentRequestEvent
		event.request.intent.name = "AMAZON.FallbackIntent"

		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) return done.fail(error)
			expect(result.response.outputSpeech.ssml).toEqual("<speak>I'm sorry, that's not something I can do right now, but I'm learning every day, just like you! You can say addition, subtraction, multiplication or division.</speak>")
			return done()
		}

		// Call the handler
		handler(event, context, callback)
	})

	test("When there is a question, fallback intent replies and repeats the question", (done) => {
		const event = new IntentRequestEvent
		event.request.intent.name = "AMAZON.FallbackIntent"

		event.session.attributes = {
			"questionsAttempted": 4,
			"questionsCorrect": 4,
			"question": {
				"operation": "subtraction",
				"solution": 3,
				"promptText": "What is 5 take away 2?",
				"solutionText": "5 take away 2 equals 3."
			}
		}

		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) return done.fail(error)
			expect(result.response.outputSpeech.ssml).toEqual("<speak>I'm sorry, that's not something I can do right now, but I'm learning every day, just like you! What is 5 take away 2?</speak>")
			return done()
		}

		// Call the handler
		handler(event, context, callback)
	})

})