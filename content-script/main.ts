import "./links.css";
import { extensionApi, WORDS, ACTIVE, REFRESH } from "../src/common";

type StorageItems = {
  active: boolean | undefined;
  words: string[] | undefined;
};

const storage = extensionApi.storage.sync;
const dataAttributeName = "data-goodnewsonly";

const nodesToCheck = ["span", "div", "li", "th", "td", "dt", "dd", "a"];

const clearHiddenLinks = () => {
  const hiddenLinks = document.querySelectorAll(`a[${dataAttributeName}="true"]`);
  for (let i = 0; i < hiddenLinks.length; i++) {
    hiddenLinks[i].removeAttribute(dataAttributeName);
  }
};

const addAttribute = (node: HTMLElement) => {
  node.setAttribute(dataAttributeName, "true");
};

const removeAttribute = (node: HTMLElement) => {
  node.removeAttribute(dataAttributeName);
};

const handleNodeLink = (nodeLink: HTMLAnchorElement, wordsRegex: RegExp) => {
  const innerText = nodeLink.innerText?.normalize().toLowerCase();

  if (!innerText) {
    return removeAttribute(nodeLink);
  }

  const wordInText = wordsRegex.test(innerText);

  if (wordInText) {
    addAttribute(nodeLink);
  } else {
    removeAttribute(nodeLink);
  }
};

const refreshHiddenLinks = () => {
  storage.get([WORDS, ACTIVE], (items) => {
    const { words, active } = items as StorageItems;

    if (!words || words.length === 0 || !active) {
      return clearHiddenLinks();
    }

    const nodes = document.querySelectorAll("a");
    const lowerCaseWords = words.map((word) => word.toLowerCase());
    const filteredWords = filterSameStartWords(lowerCaseWords);
    const wordsRegex = new RegExp(filteredWords.join("|"), "i");

    for (let i = 0; i < nodes.length; i++) {
      const nodeLink = nodes[i];
      handleNodeLink(nodeLink, wordsRegex);
    }
  });
};

const observerConfig = {
  childList: true,
  subtree: true,
  characterData: true,
};

const handleNewNode = (node: HTMLElement, wordsRegex: RegExp) => {
  const nodeName = node.nodeName.toLowerCase();
  const nodeTypeToCheck = nodesToCheck.includes(nodeName);

  if (!nodeTypeToCheck) {
    return;
  }

  const innerText = node.innerText?.normalize().toLowerCase();

  if (!innerText) {
    return;
  }

  const bannedWordInText = wordsRegex.test(innerText);

  if (!bannedWordInText) {
    return;
  }

  if (nodeName === "a") {
    addAttribute(node);
  } else {
    const closestLink = node.closest("a");
    if (closestLink) {
      addAttribute(closestLink);
    }
  }
};

const observeNodesMutations = (wordsRegex: RegExp) => {
  const observer = new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      const addedNodes = mutations[i].addedNodes;

      for (let y = 0; y < addedNodes.length; y++) {
        const addedNode = addedNodes[y] as HTMLElement;
        const childNodes = addedNode.childNodes;

        for (let k = 0; k < childNodes.length; k++) {
          const childNode = childNodes[k] as HTMLElement;
          handleNewNode(childNode, wordsRegex);
        }
      }
    }
  });

  observer.observe(document, observerConfig);
};

const filterSameStartWords = (words: string[]) => {
  if (!words || words.length === 0) {
    return [];
  }

  let redundantWords: string[] = [];

  words.forEach((word) => {
    const lowerCaseWord = word.toLowerCase();
    const filteredWords = words.filter((w) => w.toLowerCase().startsWith(lowerCaseWord) && w.length > word.length);
    if (filteredWords.length) {
      redundantWords = [...redundantWords, ...filteredWords];
    }
  });

  return words.filter((word) => {
    const redundantWord = redundantWords.includes(word);
    if (!redundantWord) {
      return true;
    }
  });
};

const handlePageStart = () => {
  storage.get([WORDS, ACTIVE], (items) => {
    const { words, active } = items as StorageItems;
    if (!words || words.length === 0 || !active) {
      return;
    }
    const lowerCaseWords = words.map((word) => word.toLowerCase());
    const filteredWords = filterSameStartWords(lowerCaseWords);
    const wordsRegex = new RegExp(filteredWords.join("|"), "i");
    observeNodesMutations(wordsRegex);
  });
};

setTimeout(() => {
  refreshHiddenLinks();
}, 300);

extensionApi.runtime.onMessage.addListener((request) => {
  if (request.message === REFRESH) {
    refreshHiddenLinks();
  }
  return true;
});

handlePageStart();
