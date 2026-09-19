import loadCurrencies, { getValues } from "./api.js";

// -------------------- DOM ELEMENTS --------------------

const main = document.querySelector("main");
const section = document.querySelector("main section");

const optionContainer = document.querySelectorAll(".currency");
const resultContainer = document.querySelector(".Resultbox");

const resultBtn = document.getElementById("resultBtn");
const reverseBtn = document.getElementById("reverseBtn");

let currencyFactor = {};

// -------------------- LOADER --------------------

function showLoader() {
  section.style.background = "rgba(0, 0, 0, 0.5)";

  const loaderCreation = `
    <div class="loader-container">
      <svg class="hexagon" viewBox="0 0 100 100">

        <defs>
          <clipPath id="hexClip">
            <polygon points="
              50,10
              85,30
              85,70
              50,90
              15,70
              15,30
            " />
          </clipPath>
        </defs>

        <image
          href="assets/images/loader.jpg"
          x="10"
          y="11"
          width="80"
          height="80"
          preserveAspectRatio="xMidYMid slice"
          clip-path="url(#hexClip)"
        />

        ${[
          [50, 10, 85, 30],
          [85, 30, 85, 70],
          [85, 70, 50, 90],
          [50, 90, 15, 70],
          [15, 70, 15, 30],
          [15, 30, 50, 10]
        ]
          .map(
            ([x1, y1, x2, y2], index) => `
              <line
                class="hex-line line-${index + 1}"
                x1="${x1}" y1="${y1}"
                x2="${x2}" y2="${y2}"
              />
            `
          )
          .join("")}

      </svg>
    </div>
  `;

  main.insertAdjacentHTML("beforeend", loaderCreation);

  document.querySelectorAll(".hex-line").forEach((line) => {
    line.style.animationName = 'glow';
    line.style.animationDuration = '1.8s';
    line.style.animationIterationCount = 'infinite';
  });
}

function hideLoader() {
  section.style.background = "";

  document.querySelector(".loader-container")?.remove();
}

// -------------------- INITIALIZATION --------------------

async function init() {
  showLoader();

  try {
    const data = await loadCurrencies();
    const currencyCode = Object.keys(data);

    optionContainer.forEach((select) => {
      currencyCode.forEach((code) => {
        const option = new Option(code, code);
        select.appendChild(option);
      });
    });

    currencyFactor = await getValues(currencyCode);

  } finally {
    hideLoader();
  }
}

init();

// -------------------- CONVERSION --------------------

resultBtn.addEventListener("click", () => {
  resultBtn.disabled = true;

  try {
    const [from, to] = getChoice();

    if (from == null || to == null) return;

    const amount = document.getElementById("amount").value;
    const precision = document.getElementById("precision").value;

    if (amount === "") {
      alert("Enter an amount greater than 0");
      return;
    }

    if (precision > 5) {
      alert("Precision max limit is 5");
      return;
    }

    const rate = from === to ? 1 : currencyFactor[from][to];

    const result = (rate * amount).toFixed(precision);

    document.querySelector(".result").textContent = result;
    resultContainer.classList.remove("hide");

  } finally {
    resultBtn.disabled = false;
  }
});

// -------------------- REVERSE CURRENCY --------------------

reverseBtn.addEventListener("click", () => {
  const [from, to] = getChoice();

  optionContainer[0].value = to;
  optionContainer[1].value = from;
});

// -------------------- GET CURRENCY CHOICES --------------------

function getChoice() {
  return Array.from(optionContainer, (element) => element.value);
}