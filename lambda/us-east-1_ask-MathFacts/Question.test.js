  'use strict';

  var chai = require('chai');

  var chaiAsPromised = require('chai-as-promised');

  chai.use(chaiAsPromised);

  var expect = chai.expect;
  var should = chai.should();

  // var MathFacts = require('../index.js');
  var Alexa = require('alexa-app');
  chai.config.includeStack = true;

  var askNewQuestion = require("./Question");

  describe('askNewQuestion', function() {
    context("when requesting an addition problem", function() {
      var question = askNewQuestion("addition");
      it("returns a type of addition", function () {
        var type = question.type;
        type.should.equal("addition");
      });
      describe("slotA", function() {
        it("is a number between 1 and 10", function() {
          question.slotA.should.be.at.least(1);
          question.slotA.should.not.be.above(10);
        })
      })
      describe("slotB", function() {
        it("is a number between 1 and 10", function() {
          question.slotB.should.be.at.least(1);
          question.slotB.should.not.be.above(10);
        })
      })
      describe("promptText", function() {
        it("Asks 'What is slotA + slotB?'", function() {
          question.promptText.should.equal("What is " + question.slotA + " plus " + question.slotB + "?");
        })
      })
    })

    context("when requesting a subtraction problem", function() {
      var question = askNewQuestion("subtraction");
      it("returns a type of subtraction", function () {
        question.type.should.equal("subtraction");
      });
      describe("slotA", function() {
        it("is always a number between 1 and 10 (repeat 100 times)", function() {
          for (var i = 100; i >= 0; i--) {
            var question = new askNewQuestion("subtraction");
            question.slotA.should.be.at.least(1);
            question.slotA.should.not.be.above(10);
          }
        })
      })
      describe("slotB", function() {
        it("is a always a number between 1 and slotA (repeat 100 times)", function() {
          for (var i = 100; i >= 0; i--) {
            var question = new askNewQuestion("subtraction");
            question.slotB.should.be.at.least(1);
            question.slotB.should.not.be.above(question.slotA);
          }
        })
      })
      describe("promptText", function() {
        it("Asks 'What is slotA take away slotB?'", function() {
          question.promptText.should.equal("What is " + question.slotA + " take away " + question.slotB + "?");
        })
      })
    })

    context("when requesting a multiplication problem", function() {
      var question = askNewQuestion("multiplication");
      it("returns a type of multiplication", function () {
        question.type.should.equal("multiplication");
      });
      describe("slotA", function() {
        it("always is a number between 1 and 12 (100 tests)", function() {
          for (var i = 100; i >= 0; i--) {
            var question = new askNewQuestion("multiplication");
            question.slotA.should.be.at.least(1);
            question.slotA.should.not.be.above(12);
          }
        })
      })

      describe("slotB", function() {
        it("always is a number between 1 and 12 (100 tests)", function() {
          for (var i = 100; i >= 0; i--) {
            var question = new askNewQuestion("multiplication");
            question.slotB.should.be.at.least(1);
            question.slotB.should.not.be.above(12);
          }
        })
      })

      describe("promptText", function() {
        it("Asks 'What is slotA times slotB?'", function() {
          question.promptText.should.equal("What is " + question.slotA + " times " + question.slotB + "?");
        })
      })
    })
    context("When requesting a division problem", function() {
      var question = askNewQuestion("division");

      it("Should return a type of division", function() {
        question.type.should.equal("division");
      })
      describe("slotA", function() {
        it("Should not be zero", function() {
          for (var i = 100; i >= 0; i--) {
            var question = new askNewQuestion("division");
            question.slotA.should.not.equal(0);
            // question.slotA.should.not.be.above(12);
          }
        })
      })

      describe("slotB", function() {
        it("Divides slotA evenly", function() {
          for (var i = 100; i >= 0; i--) {
            var question = new askNewQuestion("division");
            (question.slotA%question.slotB).should.equal(0);
          }
        })
      })

      describe("promptText", function() {
        it("Asks 'What is slotA divided by slotB?'", function() {
          question.promptText.should.equal("What is " + question.slotA + " divided by " + question.slotB + "?");
        })
      })
    })
  })
