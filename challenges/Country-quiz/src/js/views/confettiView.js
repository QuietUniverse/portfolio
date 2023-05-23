import confetti from "canvas-confetti";

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

var count = 200;
var defaults = {
  shapes: ["circle"],
  colors: ["#ffec99", "#c086ff", "#86e5ff", "#9dd436", "#86ffda"],
  origin: { y: 0.35 },
  gravity: 1,
};

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

export const rapidFire = function () {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    drift: randomInRange(-1, 1),
  });
  fire(0.2, {
    spread: 60,
    ticks: 350,
    drift: randomInRange(-1, 1),
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    ticks: 700,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    ticks: 500,
    scalar: 0.6,
  });
};
