export const ADD = "add";
export const REMOVE = "remove";
export const ENABLE = "enable";
export const DISABLE = "disable";
export const WORDS = "words";

let active: boolean | null;

const getAllLinks = () => {
  return Array.from(document.querySelectorAll("a"));
};

const getLinksByWord = (word: string) => {
  const allLinks = getAllLinks();
  return allLinks.filter((el) => {
    const textContent = el.textContent;
    if (textContent) {
      return textContent.toLowerCase().includes(word);
    }
  });
};

const getLinksByWordsArray = (words: string[]) => {
  const allLinks = getAllLinks();
  return allLinks.filter((el) => {
    const textContent = el.textContent?.toLowerCase();
    if (textContent) {
      return words.find((word) => textContent.includes(word));
    }
  });
};

const hideLinks = (links: HTMLAnchorElement[]) => {
  links.forEach((link) => {
    link.style.visibility = "hidden";
  });
};

function showLinks(links: HTMLAnchorElement[]) {
  links.forEach((link) => {
    link.style.visibility = "visible";
  });
}

function handleRequest(request: any) {
  const { type, data } = request;

  switch (type) {
    case ADD: {
      const { newWord } = data;
      const newLinks = getLinksByWord(newWord);

      if (active) {
        showLinks(newLinks);
      }
      break;
    }
    case REMOVE: {
      const { removeWord } = data;
      if (active) {
        const links = getLinksByWord(removeWord);
        hideLinks(links);
      }
      break;
    }
    case ENABLE: {
      const { wordsToHide } = data;
      const linksToHide = getLinksByWordsArray(wordsToHide);
      hideLinks(linksToHide);
      active = true;
      break;
    }
    case DISABLE: {
      const { wordsToShow } = data;
      const linksToShow = getLinksByWordsArray(wordsToShow);
      showLinks(linksToShow);
      active = false;
      break;
    }
    default:
      break;
  }
}

chrome.runtime.onMessage.addListener(function (request) {
  handleRequest(request);
  return true;
});
