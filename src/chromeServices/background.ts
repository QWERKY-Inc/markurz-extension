// document.title = "Deepform!";

var word = /[Dd]eepform/,
  queue = [document.body],
  curr;
while (!!(curr = queue.pop())) {
  if (!curr.textContent?.match(word)) continue;
  for (var i = 0; i < curr.childNodes.length; ++i) {
    switch (curr.childNodes[i].nodeType) {
      case Node.TEXT_NODE: // 3
        if (curr.childNodes[i].textContent?.match(word)) {
          curr.innerHTML = `<a target="_blank" style="text-decoration: underline; color: orange" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">${curr.childNodes[i].textContent}</a>`;
        }
        break;
      case Node.ELEMENT_NODE: // 1
        // @ts-ignore
        queue.push(curr.childNodes[i]);
        break;
    }
  }
}

export {};
