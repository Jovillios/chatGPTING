let isProcessing = false;
let isTemplateLoaded = false;
var textarea;

function pastePromptToTextArea(prompt) {
  const text = `En tant que tuteur du parcours TING, tu seras là pour m'accompagner dans ma transition vers le statut d'ingénieur.e. Ce parcours est conçu pour m'aider à développer les compétences techniques et scientifiques nécessaires pour réussir en tant qu'ingénieur.e, mais également pour m'aider à acquérir les compétences sociales et relationnelles indispensables à la résolution des problèmes complexes auxquels je serai confronté.e.

Au sein du parcours TING, je bénéficierai d'un accompagnement personnalisé pour développer mon potentiel personnel et professionnel. Tu m'aideras à identifier les fonctions qui correspondent le mieux à mon profil et à choisir la culture d'entreprise qui me conviennes le mieux. Tu m'aideras également à sortir de ma zone de confort et à envisager les possibilités de carrière qui s'offrent à moi.

En tant que tuteur, tu seras là pour répondre à vos questions, me guider dans mon parcours et m'aider à atteindre mes objectifs. Tu seras là pour m'aider à réussir dans ma transition vers le statut d'ingénieur.e.

Prompt: ${prompt}`;
  textarea.value = text;
  isTemplateLoaded = true;
}

function pressEnter() {
  textarea.focus();
  const enterEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Enter",
    code: "Enter",
  });
  textarea.dispatchEvent(enterEvent);
}

function onSubmit(event) {
  if (event.shiftKey && event.key === "Enter") {
    return;
  }

  if (
    (event.type === "click" || event.key === "Enter") &&
    !isProcessing &&
    !isTemplateLoaded
  ) {
    isProcessing = true;

    try {
      let prompt = textarea.value;
      textarea.value = "";

      prompt = prompt.trim();

      if (prompt === "") {
        isProcessing = false;
        return;
      }
      pastePromptToTextArea(prompt);
      pressEnter();
      isProcessing = false;
    } catch (error) {
      isProcessing = false;
      showErrorMessage(error);
    }
  }
}

function showErrorMessage(e) {
  console.info("ChatGPTING error : ", e);
}

function updateTitleAndDescription() {
  const h1_title = document.evaluate(
    "//h1[text()='ChatGPT']",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  if (!h1_title) {
    return;
  }

  h1_title.textContent = "ChatGPTING";
}

function updateUI() {
  textarea = document.querySelector("textarea");
  if (!textarea) {
    return;
  }
  var textareaWrapper = textarea.parentNode;

  var btnSubmit = textareaWrapper.querySelector("button");

  textarea.addEventListener("keydown", onSubmit);

  btnSubmit.addEventListener("click", onSubmit);
}

function replaceImage() {
  var chatGPTIcon = document.querySelectorAll("svg.h-6.w-6");
  if (!chatGPTIcon) {
    return;
  }
  chatGPTIcon.forEach((icon) => {
    var img = document.createElement("img");
    img.src = chrome.runtime.getURL("icon.png");
    img.classList.add("h-6", "w-6");
    icon.replaceWith(img);
  });
}

const rootEl = document.querySelector('div[id="__next"]');

window.onload = () => {
  updateTitleAndDescription();
  updateUI();

  new MutationObserver(() => {
    try {
      updateTitleAndDescription();
      updateUI();
    } catch (e) {
      console.info("ChatGPTING : ", e.stack);
    }
  }).observe(rootEl, { childList: true });
};
