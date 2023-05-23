"use strict";

import { setupBackdrop } from "./views/particlesView.js";

import QuizView from "./views/quizView.js";

import * as model from "./model.js";

const controlState = function (activeNum = 1, increaseScore) {
  model.updateState(activeNum, increaseScore);
  QuizView.selectAnswerHandler(model.state);
};

const quizBase = async function () {
  QuizView.render(model.state);
  QuizView.render(model.state, 2);
  QuizView.render(model.state, 3);
  QuizView.render(model.state, 4);
  QuizView.render(model.state, 5);
  QuizView.render(model.state, 6);
  QuizView.addHandlerSelectAnswer(model.state, controlState);
  QuizView.addHandlerNextQuest(model.state);
  QuizView.addHandlerTryAgain(retryQuiz);
};

const retryQuiz = async function () {
  model.resetQuiz();
  await model.generateQuiz();
  quizBase();
  QuizView.flipTechniqueHeader();
};

const init = async function () {
  Promise.resolve().then(setupBackdrop);

  await model.generateQuiz();
  quizBase();
  QuizView.flipTechniqueHeader();
};

init();
