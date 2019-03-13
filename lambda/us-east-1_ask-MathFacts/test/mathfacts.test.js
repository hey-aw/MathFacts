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
		context: {},
		request: {}
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

describe("LaunchRequest", () => {
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
			done()
		}

		// Call the handler
		handler(event, context, callback)

	})
})

describe("Practice Request", () => {
	test("it says practice", (done) => {
		const event = new IntentRequestEvent
		event.request.intent.name = "RequestPracticeIntent"

		// Define callback
		expect.hasAssertions()

		const callback = (error, result) => {
			if (error) {
				console.error(error)
			}
			expect(result.response.outputSpeech.ssml).toContain("practice!")
			done()
		}

		// Call the handler
		handler(event, context, callback)


	})
})