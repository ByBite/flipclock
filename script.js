const units = ["hours", "minutes", "seconds"];
const cards = new Map(
  units.map((unit) => [unit, document.querySelector(`[data-unit="${unit}"]`)])
);
const fullscreenButton = document.querySelector(".fullscreen-button");

function pad(value) {
  return String(value).padStart(2, "0");
}

function readTime() {
  const now = new Date();

  return {
    hours: pad(now.getHours()),
    minutes: pad(now.getMinutes()),
    seconds: pad(now.getSeconds()),
  };
}

function setStaticValue(card, value) {
  setFaceValue(card.querySelector(".card-top"), value);
  setFaceValue(card.querySelector(".card-bottom"), value);
  setFaceValue(card.querySelector(".flip-top"), value);
  setFaceValue(card.querySelector(".flip-bottom"), value);
  card.dataset.value = value;
  card.dataset.nextValue = value;
}

function setFaceValue(face, value) {
  face.querySelector(".digit").textContent = value;
}

function flipTo(card, nextValue) {
  const currentValue = card.dataset.value;

  if (currentValue === nextValue || card.dataset.nextValue === nextValue) {
    return;
  }

  card.dataset.nextValue = nextValue;

  const top = card.querySelector(".card-top");
  const bottom = card.querySelector(".card-bottom");
  const flipTop = card.querySelector(".flip-top");
  const flipBottom = card.querySelector(".flip-bottom");

  setFaceValue(top, currentValue);
  setFaceValue(bottom, currentValue);
  setFaceValue(flipTop, currentValue);
  setFaceValue(flipBottom, nextValue);

  card.classList.remove("flipping");
  void card.offsetWidth;
  card.classList.add("flipping");

  window.setTimeout(() => {
    setFaceValue(top, nextValue);
  }, 360);

  window.setTimeout(() => {
    setFaceValue(top, nextValue);
    setFaceValue(bottom, nextValue);
    setFaceValue(flipTop, nextValue);
    setFaceValue(flipBottom, nextValue);
    card.dataset.value = nextValue;
    card.dataset.nextValue = nextValue;
    card.classList.remove("flipping");
  }, 760);
}

function renderClock(animated = true) {
  const time = readTime();

  units.forEach((unit) => {
    const card = cards.get(unit);

    if (!card.dataset.value || !animated) {
      setStaticValue(card, time[unit]);
      return;
    }

    flipTo(card, time[unit]);
  });
}

renderClock(false);

function updateFullscreenButton() {
  fullscreenButton.setAttribute(
    "aria-label",
    document.fullscreenElement ? "Wyjdź z pełnego ekranu" : "Pełny ekran"
  );
  fullscreenButton.title = document.fullscreenElement ? "Wyjdź z pełnego ekranu" : "Pełny ekran";
}

fullscreenButton.addEventListener("click", async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }

  await document.documentElement.requestFullscreen();
});

document.addEventListener("fullscreenchange", updateFullscreenButton);
updateFullscreenButton();

function tickOnSecond() {
  renderClock();

  const now = new Date();
  const delay = 1000 - now.getMilliseconds() + 20;
  window.setTimeout(tickOnSecond, delay);
}

tickOnSecond();
