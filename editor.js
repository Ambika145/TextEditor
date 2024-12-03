let undoStack = [];
let redoStack = [];
let selectedText = null; 
document.getElementById("addTextBtn").addEventListener("click", () => {
  const canvas = document.getElementById("canvas");
  const textElement = document.createElement("div");
  textElement.classList.add("text-element");
  textElement.contentEditable = true;
  textElement.innerHTML = "Click to edit text!";
  textElement.style.left = "50px";
  textElement.style.top = "50px";
  textElement.style.fontSize = "16px";
  canvas.appendChild(textElement);
  saveHistory();
  enableDrag(textElement);

  
  textElement.addEventListener("click", () => {
    selectText(textElement);
  });
});

document.getElementById("fontSelector").addEventListener("change", (e) => {
  const font = e.target.value;
  if (selectedText) {
    selectedText.style.fontFamily = font;
    saveHistory();
  }
});

document.getElementById("increaseFont").addEventListener("click", () => {
  if (selectedText) {
    let currentSize = parseInt(window.getComputedStyle(selectedText).fontSize);
    currentSize += 2;
    selectedText.style.fontSize = `${currentSize}px`;
    updateFontSizeValue(currentSize); 
    saveHistory();
  }
});

document.getElementById("decreaseFont").addEventListener("click", () => {
  if (selectedText) {
    let currentSize = parseInt(window.getComputedStyle(selectedText).fontSize);
    currentSize -= 2;
    selectedText.style.fontSize = `${currentSize}px`;
    updateFontSizeValue(currentSize); 
    saveHistory();
  }
});

document.getElementById("boldBtn").addEventListener("click", () => {
  if (selectedText) {
    selectedText.style.fontWeight =
      selectedText.style.fontWeight === "bold" ? "normal" : "bold";
    saveHistory();
  }
});

document.getElementById("italicBtn").addEventListener("click", () => {
  if (selectedText) {
    selectedText.style.fontStyle =
      selectedText.style.fontStyle === "italic" ? "normal" : "italic";
    saveHistory();
  }
});

document.getElementById("underlineBtn").addEventListener("click", () => {
  if (selectedText) {
    selectedText.style.textDecoration =
      selectedText.style.textDecoration === "underline" ? "none" : "underline";
    saveHistory();
  }
});

document.getElementById("undoBtn").addEventListener("click", () => {
  if (undoStack.length > 0) {
    const lastState = undoStack.pop();
    redoStack.push(cloneState(lastState)); 
    restoreState(lastState);
  }
});

document.getElementById("redoBtn").addEventListener("click", () => {
  if (redoStack.length > 0) {
    const nextState = redoStack.pop();
    undoStack.push(cloneState(nextState)); 
    restoreState(nextState);
  }
});

function enableDrag(textElement) {
  interact(textElement).draggable({
    onmove(event) {
      const target = event.target;
      const canvas = document.getElementById("canvas");
      const canvasRect = canvas.getBoundingClientRect();
      let newX = (parseFloat(target.style.left) || 0) + event.dx;
      let newY = (parseFloat(target.style.top) || 0) + event.dy;

      newX = Math.max(0, Math.min(newX, canvasRect.width - target.offsetWidth));
      newY = Math.max(
        0,
        Math.min(newY, canvasRect.height - target.offsetHeight)
      );

      target.style.left = `${newX}px`;
      target.style.top = `${newY}px`;
      saveHistory();
    },
  });
}

function saveHistory() {
  const state = [];
  document.querySelectorAll(".text-element").forEach((text) => {
    state.push({
      textContent: text.innerHTML,
      fontSize: text.style.fontSize,
      fontFamily: text.style.fontFamily,
      fontWeight: text.style.fontWeight,
      fontStyle: text.style.fontStyle,
      textDecoration: text.style.textDecoration,
      position: { left: text.style.left, top: text.style.top },
    });
  });

  undoStack.push(state);

  redoStack = [];

  if (undoStack.length > 20) {
    undoStack.shift();
  }
}

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function restoreState(state) {
  const canvas = document.getElementById("canvas");
  canvas.innerHTML = ""; 

  state.forEach((item) => {
    const textElement = document.createElement("div");
    textElement.classList.add("text-element");
    textElement.contentEditable = true;
    textElement.innerHTML = item.textContent;
    textElement.style.fontSize = item.fontSize;
    textElement.style.fontFamily = item.fontFamily;
    textElement.style.fontWeight = item.fontWeight;
    textElement.style.fontStyle = item.fontStyle;
    textElement.style.textDecoration = item.textDecoration;
    textElement.style.left = item.position.left;
    textElement.style.top = item.position.top;
    canvas.appendChild(textElement);

    enableDrag(textElement);
    textElement.addEventListener("click", () => selectText(textElement));
  });
}

function selectText(textElement) {
  selectedText = textElement;
  const currentSize = parseInt(window.getComputedStyle(textElement).fontSize);
  updateFontSizeValue(currentSize);
}

function updateFontSizeValue(size) {
  const fontSizeDisplay = document.getElementById("fontSizeDisplay");
  fontSizeDisplay.textContent = size + "px"; 
}
