/* eslint-env node, jest */
const MathFacts = require("../index")

const { handler } = MathFacts
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
	event.request =
		{
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
							"resolutionsPerAuthority": [
								{
									"authority": "string",
									"status": {
										"code": "string"
									},
									"values": [
										{
											"value": {
												"name": "string",
												"id": "string"
											}
										}
									]
								}
							]
						}
					}
				}
			}
		}
	return event
}

describe("Launch Request", () => {
	test("it says welcome", (done) => {
		const event = new Event
		event.request.type = "LaunchRequest"
		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) {
				console.error(error)
			}
			expect(result.response.outputSpeech.ssml).toContain("Welcome to Math Facts. I can help you practice the the right operations for your grade level. What kind of operation would you like to practice?")
			expect(result.response.reprompt.outputSpeech.ssml).toContain("You can ask for addition, subtraction, multiplication, or division. Which operation would you like to practice?")
			return done()
		}

		// Call the handler
		handler(event, context, callback)

	})
})

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
			"question": {
				"operation": "addition",
				"solution": 7,
				"promptText": "What is 5 plus 2?",
				"solutionText": "5 plus 2 equals 7."
			}
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
			"question": {
				"operation": "addition",
				"solution": 7,
				"promptText": "What is 5 plus 2?",
				"solutionText": "5 plus 2 equals 7."
			}
		}

		// Congratulate and present with a new question
		const outputSpeech = `That's not quite it. ${event.session.attributes.question.solutionText} Let's try saying that together three times. ${event.session.attributes.question.solutionText} ${event.session.attributes.question.solutionText} ${event.session.attributes.question.solutionText} What is`

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
				"questionsAttempted": 3,
				"questionsCorrect": 3,
				"question": {
					"operation": "addition",
					"solution": 7,
					"promptText": "What is 5 plus 2?",
					"solutionText": "5 plus 2 equals 7."
				}
			}

			// Congratulate and present with a new question
			const outputSpeech = `That's it! ${event.session.attributes.question.solutionText} What is`

			// Define callback
			expect.hasAssertions()

			const callback = (error, result) => {
				if (error) return done.fail(error)
				expect(result.sessionAttributes.questionsAttempted).toEqual(4)
				expect(result.sessionAttributes.questionsCorrect).toEqual(4)
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
				"questionsAttempted": 3,
				"questionsCorrect": 3,
				"question": {
					"operation": "addition",
					"solution": 7,
					"promptText": "What is 5 plus 2?",
					"solutionText": "5 plus 2 equals 7."
				}
			}

			// Congratulate and present with a new question
			const outputSpeech = "That's not quite it. 5 plus 2 equals 7. Let's try saying that together three times. 5 plus 2 equals 7. 5 plus 2 equals 7. 5 plus 2 equals 7."

			// Define callback
			expect.hasAssertions()

			const callback = (error, result) => {
				if (error) return done.fail(error)
				expect(result.sessionAttributes.questionsAttempted).toEqual(4)
				expect(result.sessionAttributes.questionsCorrect).toEqual(3)
				expect(result.response.outputSpeech.ssml).toContain(outputSpeech)
				return done()
			}

			// Call the handler
			handler(event, context, callback)
		})

		test("fifth question, correct", (done) => {
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
				"questionsCorrect": 3,
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
				expect(result.response.outputSpeech.ssml).toContain("You got 4 correct out of 5. Nice work! Keep practicing!")
				expect(result.response.card.title).toEqual("Addition Practice")
				return done()
			}

			// Call the handler
			handler(event, context, callback)
		})
		test("fifth question, perfect", (done) => {
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

		test("fifth question, incorrect", (done) => {
			const event = new IntentRequestEvent
			event.request.intent.name = "AttemptIntent"
			event.request.intent.slots.ATTEMPT = {
				"name": "ATTEMPT",
				"value": "99",
				"confirmationStatus": "NONE",
				"source": "USER"
			}
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
				expect(result.sessionAttributes.questionsAttempted).toEqual(0)
				expect(result.sessionAttributes.questionsCorrect).toEqual(0)
				expect(result.response.card.title).toEqual("Subtraction Practice")
				expect(result.response.outputSpeech.ssml).toContain("You got 4 correct out of 5. Nice work! Keep practicing!")
				return done()
			}

			// Call the handler
			handler(event, context, callback)
		})
	})
})

describe("Practice Request", () => {
	test("it starts practice", done => {
		const event = new IntentRequestEvent
		event.request.intent.name = "RequestPracticeIntent"
		event.request.intent.slots.OPERATION = {
			name: "OPERATION",
			value: "addition",
			resolutions: {
				resolutionsPerAuthority: [
					{
						authority: "amzn1.er-authority.echo-sdk.amzn1.echo-sdk-ams.app.5b53e310-2e93-486f-a362-314651d627f4.Custom_Operation",
						status: {
							code: "ER_SUCCESS_MATCH"
						},
						values: [
							{
								value: {
									name: "addition",
									id: "2b2ae8740b2b5403b5075bd7cbc6ceaa"
								}
							}
						]
					}
				]
			},
			confirmationStatus: "NONE",
			source: "USER"
		}

		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) return done.fail(error)
			expect(result.response.outputSpeech.ssml).toContain("OK, addition. Let's get started! What is")
			expect(result.response.reprompt.outputSpeech.ssml).toContain("<speak>Let me give you a chance to think. <break time='5s'/> What is")
			return done()
		}

		// Call the handler
		handler(event, context, callback)
	})
	test("when the operation isn't recognized, it asks again", (done) => {
		const event = new IntentRequestEvent
		event.request = {
			"type": "IntentRequest",
			"requestId": "amzn1.echo-api.request.16adcf15-f318-4601-aba7-41256aa5cc42",
			"timestamp": "2019-03-22T17:21:47Z",
			"locale": "en-US",
			"intent": {
				"name": "RequestPracticeIntent",
				"confirmationStatus": "NONE",
				"slots": {
					"OPERATION": {
						"name": "OPERATION",
						"value": "camel",
						"resolutions": {
							"resolutionsPerAuthority": [
								{
									"authority": "amzn1.er-authority.echo-sdk.amzn1.echo-sdk-ams.app.5b53e310-2e93-486f-a362-314651d627f4.Custom_Operation",
									"status": {
										"code": "ER_SUCCESS_NO_MATCH"
									}
								}
							]
						},
						"confirmationStatus": "NONE",
						"source": "USER"
					}
				}
			},
			"dialogState": "COMPLETED"
		}


		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) return done.fail(error)
			expect(result.response.outputSpeech.ssml).toContain("I'm sorry, that's not something I can do right now, but I'm learning every day, just like you! You can say addition, subtraction, multiplication or division.")
			expect(result.response.reprompt.outputSpeech.ssml).toEqual("<speak>You can say addition, subtraction, multiplication or division.</speak>")
			return done()
		}

		// Call the handler
		handler(event, context, callback)
	})

})

describe("Help Intent", () => {
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

describe("Stop Intent", () => {
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


describe("Cancel Intent", () => {
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

describe("Fallback Intent", () => {
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