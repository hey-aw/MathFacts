// Math Facts, a math practice skill for Amazon Alexa
// Matt Anthes-Washburn

var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('mathfacts');
var askNewQuestion = require("./Question");
var answer = require("./Answer");

app.launch(function(request, response) {
  response.clearSession();
  var reprompt = ("You can ask for addition, subtraction, multiplication, or division. Which operation would you like to practice?")
  response.say("What kind of problem would you like to practice?").reprompt(reprompt).shouldEndSession(false);
});

app.intent('requestPractice', {
    "slots": {
      "Operation": "MathType"
    },
    "utterances": ["{-|Operation}", "for {some|} {-|Operation} {problems|practice|facts|}", "give {me|us} some practice {-|Operation} {problems|facts}", "start {-|Operation}" , "start {-|Operation} {problems|practice|facts}", "practice {-|Operation}", "Give me some {-|Operation} facts", "for {-|Operation} {problems|practice|facts}", "for some {-|Operation}", "for {-|Operation} {problems|practice|facts}", "to practice some {-|Operation}"]
  },
  function(request, response) {
  	 var operation = request.slot('Operation');
  	 var type = request.session('type');
  	 var question = request.session("question");
  	 var operations = ["addition", "subtraction", "multiplication", "division"];

   	 	if (question) {
   	 		if (question.promptText) { // There is already a question being asked
			 		var prompt = ("I'm sorry, I didn't hear a number. Try repeating the whole fact.") + question.promptText;	
			 		var reprompt = ("If you want to stop, just say, 'stop.' " + question.promptText);
	  	 		response.say(prompt).reprompt(reprompt).shouldEndSession(false);
	  	 		return true;
  	 		}
  	 	} 
  	 	if (operations.indexOf(operation) == -1) { // The operation is not recognized
  	 		var reprompt = ("You can practice addition, subtraction, multiplication, or division. Which operation would you like to try?")
  	 		response.say("Can you repeat that? Would you like to practice addition, subtraction, multiplication, or division?").reprompt(reprompt).shouldEndSession(false);
  	 		return true;
			}

	 	// Otherwise , set the type and ask the question
	 	response.session('type', operation);
	 	var question = askNewQuestion(operation);
 		    // Save the question
		response.session("question", question);
		response.say("Okay, " + operation + ", let's get started.");
		var reprompt = ("Let me give you a chance to think. <break time='5s'/>" + question.promptText);
		response.say(question.promptText).reprompt(reprompt).shouldEndSession(false);	 			
  });


app.intent('answer', {
  "slots": {
    "Attempt": "AMAZON.NUMBER"
  },
  "utterances": ["{it's|is|that's|the answer is|the sum is|the product is|the result is} {-|Attempt}", "{1-19|20-144 by 12} {plus|take away|minus|times|multiplied by|divided by} {1-12} {is|equals|makes} {-|Attempt}"]
}, function(request, response) {
	var attempt = Number(request.slot("Attempt"));
	// console.log("Attempt: " + attempt);
	var question = response.session("question");
	var isAValidNumber = (attempt >= 0)
	if (!isAValidNumber) { // It's not a valid number
		var prompt = ("Sorry, I didn't hear a number. Try repeating the whole fact." + question.promptText);
		var reprompt = ("If you're all done, you can say stop. " + question.promptText);
		response.say(prompt).reprompt(reprompt).shouldEndSession(false);
		return true;
	}

	if (question) {
		if (question.promptText) {
				answer(request, response);
		}
	} else if (request.session('type')) {
		console.log("No question, but has a type.")
		response.say("Oops, you said a number, but I don't remember the question. Silly me! Let's try again.");
		var question = askNewQuestion(type);
		// ask the new question 
		response.say(question.promptText).reprompt(question.promptText).shouldEndSession(false);
		// save the new question
	  response.session("question", question);
		} else {
			var reprompt = ("You can practice addition, subtraction, multiplication, or division. Which operation would you like to try?")
			response.say("What kind of problem would you like to practice?").reprompt(reprompt).shouldEndSession(false);
		}
	});

function exitFunction(request, response) {
  response.clearSession();
};

app.sessionEnded(function(request, response) {
  exitFunction(request, response);
});

app.intent('AMAZON.StopIntent', function(request, response) {
  response.say("Okay, let's stop.");
  exitFunction(request, response);
});

app.intent('AMAZON.CancelIntent', function(request, response) {
  response.say("Okay, canceling.")
  exitFunction(request, response);
});

app.intent('AMAZON.HelpIntent', function(request, response) {

  var speechOutput = "Each time you open Math Facts, I'll ask you a few problems. Try asking for some addition problems.";
  var reprompt = "If you want to stop, you can say, 'stop.'"
  response.say(speechOutput).reprompt(reprompt).shouldEndSession(false);

});

// module.exports = answerIntentHandler;
module.exports = app;
