/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { ADD, REMOVE, ENABLE, DISABLE, WORDS } from "../content-script/main";

import { useState } from "react";
import "./App.css";

const App = () => {
  const [words, setWords] = useState(["wojn", "ukra", "covid"]);
  const [active, setActive] = useState(true);
  const [input, setInput] = useState("");

  const hideUnwanted = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const id = tabs[0].id;

      if (id) {
        chrome.tabs.sendMessage(id, { type: ENABLE, data: { wordsToHide: words } }, function () {
          setActive(true);
        });
      }
    });
  };

  const showUnwanted = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const id = tabs[0].id;

      if (id) {
        chrome.tabs.sendMessage(id, { type: DISABLE, data: { wordsToShow: words } }, function () {
          setActive(false);
        });
      }
    });
  };

  const addWord = () => {
    const newWord = input;
    setInput("");
    setWords([...words, newWord]);
    if (!words.includes(newWord) && newWord) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const id = tabs[0].id;

        if (id) {
          chrome.tabs.sendMessage(id, { type: ADD, data: { newWord } });
        }
      });
    }
  };

  const removeWord = (word: string) => {
    const currentWords = words.filter((w) => w !== word);
    setWords(currentWords);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const id = tabs[0].id;

      if (id) {
        chrome.tabs.sendMessage(id, { type: REMOVE, data: { removeWord: word } });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Hide unwanted news</p>
      </header>
      <div>
        <ul id="wordsList">
          {words.map((word) => {
            return (
              <li key={word}>
                {word}{" "}
                <span onClick={() => removeWord(word)} style={{ cursor: "pointer" }}>
                  X
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <input id="addWordInput" value={input} onChange={handleInputChange} />
        <button id="buttonAdd" onClick={addWord}>
          Add Word
        </button>
      </div>
      <div>
        <button id="buttonShow" onClick={showUnwanted}>
          Show Links
        </button>
      </div>
      <div>
        <button id="buttonHide" onClick={hideUnwanted}>
          Hide Links
        </button>
      </div>
    </div>
  );
};

export default App;
