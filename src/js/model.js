import { COUNTRIES } from "./config.js";

export const state = {
  active: 1,
  quiz: {},
  score: 0,
};

export const updateState = function (activeNum, increaseScore) {
  state.active += activeNum;
  if (increaseScore) state.score++;
};

const generateQuestion = async function (num) {
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${
      COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    }`
  );
  const [data] = await res.json();

  if (num === 1) {
    return (state.quiz[`question${num}`] = {
      question: `What is the capital of ${data.name.common} ?`,
      answer: data.capital[0],
      country: data.name.common,
    });
  } else if (num === 2) {
    return (state.quiz[`question${num}`] = {
      question: `Which country does this flag represent ?`,
      img: data.flags.svg,
      alt:
        "The flag" + data.flags.alt.split("The flag of " + data.name.common)[1],
      answer: data.name.common,
      country: data.name.common,
    });
  } else if (num === 3) {
    return (state.quiz[`question${num}`] = {
      question: `What is one of the many languages that people speak in ${data.name.common} ?`,
      answer: Object.values(data.languages)[
        Math.floor(Math.random() * Object.entries(data.languages).length)
      ],
      country: data.name.common,
    });
  } else if (num == 4) {
    return (state.quiz[`question${num}`] = {
      question: `Which part of ${data.region} does ${data.name.common} lie in ?`,
      answer: data.subregion,
      country: data.name.common,
    });
  } else if (num === 5) {
    return (state.quiz[`question${num}`] = {
      question: `What is the timezone of ${data.name.common} ?`,
      answer: data.timezones[Math.floor(Math.random() * data.timezones.length)],
      country: data.name.common,
    });
  }
};

export const resetQuiz = function () {
  state.active = 1;
  state.quiz = {};
  state.score = 0;
};

export const generateQuiz = async function () {
  await generateQuestion(1);
  await generateQuestion(2);
  await generateQuestion(3);
  await generateQuestion(4);
  await generateQuestion(5);
};
