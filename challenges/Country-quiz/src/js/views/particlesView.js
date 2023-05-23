"use strict";

import colors from "../../css/exports.module.css";

import { hexToRGB } from "../helpers";

const container = document.querySelector(".container");

class Shape {
  constructor() {
    this._shape = document.createElement("div");
    this._shape.classList.add("backdrop__shape");
    container.insertAdjacentElement("beforeend", this._shape);
    return this._shape;
  }
}

const onAnimationEnd = async function () {
  this.remove();
  const newShape = new Shape();
  setShapes.call(newShape);
  newShape.addEventListener("animationend", onAnimationEnd);
};

const setShapes = async function () {
  const hwRandom = Math.random();

  const direction = this.previousSibling?.style?.left ? `right` : `left`;
  this.setAttribute(
    "style",
    `${direction}:${Math.round(Math.random() * 100)}%`
  );

  const colorWhite = hexToRGB(colors.colorWhite);

  if (hwRandom > 0.7) {
    this.style.boxShadow = `0 0 1.5rem 0.4rem rgba(${+colorWhite.r}, ${+colorWhite.g}, ${+colorWhite.b}, 0.4)`;
  } else {
    this.style.background = `rgba(${+colorWhite.r}, ${+colorWhite.g}, ${+colorWhite.b}, 0.4)`;
  }
  this.style.width = `${Math.round(hwRandom * 5)}rem`;
  this.style.height = `${Math.round(hwRandom * 5)}rem`;
  this.style.animationDuration = `${Math.floor(Math.random() * 15)}s`;
};

export const setupBackdrop = function () {
  return new Promise(function (resolve) {
    Array.from({ length: 25 }, async () => {
      let shape = new Shape();
      setShapes.call(shape);
      shape.style.animationDelay = `${Math.floor(Math.random() * 5)}s`;
      shape = shape.addEventListener("animationend", onAnimationEnd);
      resolve();
    });
  });
};
