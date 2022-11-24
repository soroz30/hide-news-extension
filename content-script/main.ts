import "./links.css";
import { extensionApi, WORDS, ACTIVE } from "../src/common";

type StorageItems = {
  active: boolean | undefined;
  words: string[] | undefined;
};

const storage = extensionApi.storage.sync;
const hideLinkClassName = "fearlessHideLink";

const nodesToCheck = ["span", "div", "li", "th", "td", "dt", "dd", "a"];

const clearHiddenLinks = () => {
  const hiddenLinks = document.querySelectorAll(`.${hideLinkClassName}`);
  for (let i = 0; i < hiddenLinks.length; i++) {
    hiddenLinks[i].className = hiddenLinks[i].className.replace(hideLinkClassName, "");
  }
};

const isWordInText = (text: string, words: string[]) => {
  return words.some((word: string) => text.includes(word));
};

const addClassName = (node: HTMLElement) => {
  node.className += node.className ? ` ${hideLinkClassName}` : hideLinkClassName;
};

const handleNodeLink = (nodeLink: HTMLAnchorElement, words: string[]) => {
  const innerText = nodeLink.innerText?.toLowerCase();

  if (!innerText) {
    return (nodeLink.className = nodeLink.className.replace(/fearlessHideLink/g, ""));
  }
  const wordInText = isWordInText(innerText, words);

  if (wordInText) {
    const fearlessHideLink = nodeLink.className.includes(hideLinkClassName);
    if (!fearlessHideLink) {
      addClassName(nodeLink);
    }
  } else {
    nodeLink.className = nodeLink.className.replace(/fearlessHideLink/g, "");
  }
};

const refreshHiddenLinks = () => {
  storage.get([WORDS, ACTIVE], (items) => {
    const { words, active } = items as StorageItems;

    if (!words) {
      return clearHiddenLinks();
    }

    const nodes = document.querySelectorAll("a");
    if (active) {
      const lowerCaseWords = words.map((word) => word.toLowerCase());
      const filteredWords = filterSameStartWords(lowerCaseWords);

      for (let i = 0; i < nodes.length; i++) {
        const nodeLink = nodes[i];
        handleNodeLink(nodeLink, filteredWords);
      }
    } else {
      clearHiddenLinks();
    }
  });
};

const observerConfig = {
  childList: true,
  subtree: true,
  characterData: true,
};

const handleNewNode = (node: HTMLElement, words: string[]) => {
  const nodeName = node.nodeName.toLowerCase();
  const nodeTypeToCheck = nodesToCheck.includes(nodeName);

  if (!nodeTypeToCheck) {
    return;
  }

  const innerText = node.innerText?.toLowerCase();

  if (!innerText) {
    return;
  }

  const bannedWordInText = isWordInText(innerText, words);

  if (!bannedWordInText) {
    return;
  }

  const notHiddenLink = nodeName === "a" && !node.className.includes(hideLinkClassName);

  if (notHiddenLink) {
    addClassName(node);
  } else {
    const closestLink = node.closest("a");
    const notHiddenParentLink = closestLink && !closestLink.className.includes(hideLinkClassName);
    if (notHiddenParentLink) {
      addClassName(closestLink);
    }
  }
};

const observeNodesMutations = (words: string[]) => {
  const observer = new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      const addedNodes = mutations[i].addedNodes;

      for (let y = 0; y < addedNodes.length; y++) {
        const addedNode = addedNodes[y] as HTMLElement;
        const childNodes = addedNode.childNodes;

        for (let k = 0; k < childNodes.length; k++) {
          const childNode = childNodes[k] as HTMLElement;
          handleNewNode(childNode, words);
        }
      }
    }
  });

  observer.observe(document, observerConfig);
};

const filterSameStartWords = (words: string[]) => {
  if (!words) {
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
    if (!words || !active) {
      return;
    }
    const lowerCaseWords = words.map((word) => word.toLowerCase());
    const filteredWords = filterSameStartWords(lowerCaseWords);
    observeNodesMutations(filteredWords);
  });
};

setTimeout(() => {
  refreshHiddenLinks();
}, 500);

extensionApi.runtime.onMessage.addListener(function () {
  refreshHiddenLinks();
  return true;
});

handlePageStart();
