export const ADD = "add";
export const REMOVE = "remove";
export const ENABLE = "enable";
export const DISABLE = "disable";
export const ACTIVE = "active";
export const WORDS = "words";
import "./links.css";
const storage = chrome.storage.sync;

const nodesTypes = ["span", "div", "li", "th", "td", "dt", "dd", "a"];

const clearHiddenLinks = () => {
  const hiddenLinks = document.querySelectorAll(".fearlessHideLink");
  for (let i = 0; i < hiddenLinks.length; i++) {
    hiddenLinks[i].className = hiddenLinks[i].className.replace("fearlessHideLink", "");
  }
};

const isWordInText = (text: string, words: string[]) => {
  return words.some((word: string) => text.includes(word));
};

const handleNodeLink = (nodeLink: HTMLAnchorElement, words: string[]) => {
  const textContent = nodeLink.textContent?.toLowerCase();

  if (!textContent) {
    return (nodeLink.className = nodeLink.className.replace(/fearlessHideLink/g, ""));
  }
  const wordInText = isWordInText(textContent, words);

  if (wordInText) {
    const fearlessHideLink = nodeLink.className.includes("fearlessHideLink");
    if (!fearlessHideLink) {
      nodeLink.className += " fearlessHideLink";
    }
  } else {
    nodeLink.className = nodeLink.className.replace(/fearlessHideLink/g, "");
  }
};

const refreshHiddenLinks = () => {
  storage.get([WORDS, ACTIVE], (items) => {
    const { words, active } = items;
    const nodes = document.querySelectorAll("a");
    if (active) {
      for (let i = 0; i < nodes.length; i++) {
        const nodeLink = nodes[i];
        handleNodeLink(nodeLink, words);
      }
    } else {
      clearHiddenLinks();
    }
  });
};

const observerConfig = {
  childList: true,
  subtree: true,
};

const checkNewNode = (node: HTMLElement, words: string[]) => {
  const nodeName = node.nodeName.toLowerCase();
  const nodeTypeToCheck = nodesTypes.includes(nodeName);

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

  const notHiddenLink = nodeName === "a" && !node.className.includes("fearlessHideLink");

  if (notHiddenLink) {
    node.className += " fearlessHideLink";
  } else {
    const closestLink = node.closest("a");
    const notHiddenParentLink = closestLink && !closestLink.className.includes("fearlessHideLink");
    if (notHiddenParentLink) {
      closestLink.className += " fearlessHideLink";
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
          checkNewNode(childNode, words);
        }
      }
    }
  });

  observer.observe(document, observerConfig);
};

const handlePageStart = () => {
  storage.get([WORDS, ACTIVE], (items) => {
    const { words, active } = items;

    if (active) {
      observeNodesMutations(words);
    }
  });
};

setTimeout(() => {
  refreshHiddenLinks();
}, 500);

chrome.runtime.onMessage.addListener(function () {
  refreshHiddenLinks();
  return true;
});

handlePageStart();
