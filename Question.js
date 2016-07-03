// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;


module.exports = function (type) {
    var question = {
      type: type,
      slotA: 0,
      slotB: 0,
      solution: 0,
      promptText: "",
      solutionText: ""
    }
    // Set up the question based on type
    switch (type) {
      case "addition":
        question.slotA = Math.floor((Math.random() * 9)+1);
        question.slotB = Math.floor((Math.random() * 9)+1);
        question.solution = question.slotA + question.slotB;
        question.promptText = "What is " + question.slotA + " plus " + question.slotB + "?";
        question.solutionText = (question.slotA + " plus " + question.slotB + " equals " + question.solution + ".");
        break;
      case "subtraction":
        question.slotA = Math.floor((Math.random() * 9)+1);
        question.slotB = Math.floor((Math.random() * question.slotA)+1);
        question.solution = question.slotA - question.slotB;
        question.promptText = "What is " + question.slotA + " take away " + question.slotB + "?";
        question.solutionText = (question.slotA + " take away " + question.slotB + " equals " + question.solution + ".");
        break;
      case "multiplication":
        question.slotA = Math.floor((Math.random() * 12) + 1);
        question.slotB = Math.floor((Math.random() * 12) + 1);
        question.solution = question.slotA * question.slotB;
        question.promptText = "What is " + question.slotA + " times " + question.slotB + "?";
        question.solutionText = (question.slotA + " times " + question.slotB + " equals " + question.solution + ".");
        break;
      case "division":
        var denominator = Math.floor((Math.random() * 12) + 1);
        question.slotB = Math.floor((Math.random() * 12) + 1);
        question.slotA = question.slotB * denominator;
        question.solution = question.slotA / question.slotB;
        question.promptText = "What is " + question.slotA + " divided by " + question.slotB + "?";
        question.solutionText = (question.slotA + " divided by " + question.slotB + " equals " + question.solution + ".");
        break;
      default:
        // var stop = true
        //                  response.say ("I heard the type was " +type);

        // response.say("Oops! I got confused. What kind of problem would you like to practice?").shouldEndSession(false);
    }
    return question;
  };

