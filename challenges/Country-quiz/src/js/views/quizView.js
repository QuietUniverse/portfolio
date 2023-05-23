import { promisifiedTimeout, hexToRGB } from "../helpers.js";

import { rapidFire } from "./confettiView.js";

import { ANSWER_OBSERVER, fillerData } from "../config.js";

import colors from "../../css/exports.module.css";

class QuizView {
  #parentEl = document.querySelector("main");
  #data = {
    active: 1,
    score: 0,
  };

  #firstHeaderEl;
  #lastHeaderEl;

  constructor() {
    const headerEl = document.querySelector("header");

    this.#firstHeaderEl = headerEl.getBoundingClientRect();
  }

  update(data) {
    this.#data.active = data.active;
    this.#data.score = data.score;
  }

  render(data, sr = 1) {
    this.#data = data;
    const html = sr === 6 ? this.renderScoreCard(sr) : this.renderQuiz(sr);

    if (sr === 1) {
      this.#parentEl.insertAdjacentHTML("afterbegin", html);
    } else {
      this.#parentEl.insertAdjacentHTML("afterend", html);
    }
  }

  renderScoreCard(sr) {
    return `
    <div class="quiz__score-card quiz--next" data-sr="${sr}">
            <p class="quiz__score-message">You have scored</p>
            <span class="quiz__score">${this.#data.score}</span>
            <div class="svg-container">
              <div class="try-again__btn">
                <svg
                  class="try-again__icon"
                  align="center"
                  viewBox="0 0 140 100"
                >
                  <use
                    xlink:href="./src/css/sprite.svg#icon-curved-arrow"
                  ></use>
                </svg>
              </div>

              <svg
                class="earth-love__icon"
                align="center"
                viewBox="0 0 800 200"
              >
                <use xlink:href="./src/css/sprite.svg#earth-leaf"></use>
              </svg>
            </div>
          </div>
    `;
  }

  renderQuiz(sr) {
    const randNum = Math.floor(Math.random() * 4);
    const centeredCount = this.#data.quiz[`question${sr}`].country;
    const filler = fillerData[centeredCount.toLowerCase()][sr];

    const options = Array.from({ length: 4 }, (_, i) =>
      i === randNum
        ? this.#data.quiz[`question${sr}`].answer
        : i < randNum
        ? filler[i]
        : filler[--i]
    );

    return `
    <div class="quiz${
      sr === this.#data.active ? " quiz--active" : " quiz--next"
    }" data-sr="${sr}">
    <p class="quiz__question">${this.#data.quiz[`question${sr}`].question}${
      sr === 2
        ? `<img src='${
            this.#data.quiz[`question${sr}`].img
          }' class='quiz__flag' alt='${this.#data.quiz[`question${sr}`].alt}'>`
        : ""
    }</p>
    <article class="quiz__container">
    ${options
      .map(
        (value, i) => `
    <div class="quiz__answer" data-option="${i}">
        <label for="${i}">${value}</label>
        <input
          class="quiz__answer-rbtn"
          type="radio"
          name="answer"
          value="${value.toLowerCase()}"
          id="${i + "-" + value.toLowerCase()}"
        />
    </div>
    `
      )
      .join("")}
    </article>
  </div> 
    `;
  }

  addHandlerTryAgain(handler) {
    document
      .querySelector(".try-again__btn")
      .addEventListener("click", function () {
        const allQuiz = document.querySelectorAll(".quiz");
        document.querySelector(".quiz__score-card").remove();
        allQuiz.forEach((quiz) => quiz.remove());
        handler();
      });
  }

  async nextQuestHandler(e) {
    e.preventDefault();

    const mainEl = document.querySelector("main");

    if (e.target.classList.contains("quiz--prev")) {
      const newActiveEl = document.querySelector(
        `.quiz${this.#data.active === 6 ? "__score-card" : ""}[data-sr='${
          this.#data.active
        }']`
      );
      newActiveEl.classList.remove("quiz--next");
      newActiveEl.classList.add("quiz--active");

      mainEl.insertAdjacentElement("beforebegin", e.target);
    }

    if (e.target.classList.contains("quiz--active")) {
      mainEl.appendChild(e.target);
      if (this.#data.active === 6) {
        rapidFire();
      }
    }
  }

  addHandlerNextQuest() {
    const quiz = document.querySelectorAll(".quiz");

    document
      .querySelector(".quiz__score-card")
      .addEventListener("transitionend", this.nextQuestHandler.bind(this));

    quiz.forEach((quiz) =>
      quiz.addEventListener("transitionend", this.nextQuestHandler.bind(this))
    );
  }

  selectAnswerHandler(data) {
    this.update(data);
  }

  addHandlerSelectAnswer(data, handler) {
    const ansContainer = document.querySelectorAll(".quiz__container");

    ansContainer.forEach((container) => {
      container.addEventListener("click", async function (e) {
        e.preventDefault();

        const answer =
          e.target.dataset.option ||
          e.target.id ||
          e.target.getAttribute("for");
        if (!answer) return;

        const quizAnswers = Array.from(
          e.target.closest(".quiz__container").querySelectorAll(".quiz__answer")
        );

        quizAnswers.forEach((v) =>
          v.classList.add("quiz__answer--disable-activity")
        );

        const radBtn =
          e.target.closest(".quiz__answer-rbtn") ||
          e.target.querySelector(".quiz__answer-rbtn") ||
          e.target.parentElement.querySelector(".quiz__answer-rbtn");
        radBtn.checked = true;

        const quizAnswer = e.target.closest(".quiz__answer");
        const correctAnswer =
          data.quiz[`question${data.active}`].answer.toLowerCase();

        let increaseScore = false;

        if (correctAnswer === radBtn.value) {
          increaseScore = true;
          quizAnswer.style.backgroundColor = colors.colorPrimaryDark;
          quizAnswer.classList.add("quiz__answer--correct");
        } else {
          const [correctEl] = quizAnswers.filter(
            (answerEl) =>
              answerEl.querySelector(".quiz__answer-rbtn").value ===
              correctAnswer
          );
          const colorWhite = hexToRGB(colors.colorWhite);

          quizAnswer.style.backgroundColor = `rgba(${colorWhite.r},${colorWhite.g}, ${colorWhite.b}, 0.5);`;
          quizAnswer.classList.add("quiz__answer--incorrect");

          correctEl.style.backgroundColor = colors.colorPrimaryDark;
          correctEl.classList.add("quiz__answer--correct");
        }

        if (data.active >= 2 && data.active !== data.score) {
          if (
            (data.active - 1 === data.score && !increaseScore) ||
            data.active - 1 !== data.score
          ) {
            handler(6 - data.active, increaseScore);
          } else {
            handler(1, increaseScore);
          }
        } else {
          handler(1, increaseScore);
        }

        document.querySelector(".quiz__score").textContent = data.score;

        await promisifiedTimeout(ANSWER_OBSERVER);

        this.parentElement.classList.add("quiz--prev");
        this.parentElement.classList.remove("quiz--active");
      });
    });
  }

  flipTechniqueHeader() {
    const headerEl = document.querySelector("header");
    this.#lastHeaderEl = headerEl.getBoundingClientRect();

    const deltaX = this.#firstHeaderEl.left - this.#lastHeaderEl.left;
    const deltaY = this.#firstHeaderEl.top - this.#lastHeaderEl.top;

    headerEl.animate(
      [
        {
          transformOrigin: "top left",
          transform: `
            translate(${deltaX}px, ${deltaY}px)
          `,
        },
        {
          transformOrigin: "top left",
          transform: "none",
        },
      ],
      {
        duration: 600,
        easing: "ease-in-out",
        fill: "both",
      }
    );
  }
}

export default new QuizView();
