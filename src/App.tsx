/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { ADD, REMOVE, ENABLE, DISABLE, WORDS } from "../content-script/main";

import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [words, setWords] = useState<string[]>([]);
  const [active, setActive] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    chrome.storage.sync.get({ words, active }, (items) => {
      const { words, active } = items;
      setWords(words);
      setActive(active);
    });
  }, []);

  const activateHiding = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const id = tabs[0].id;

      if (id) {
        chrome.tabs.sendMessage(id, { type: ENABLE, data: { wordsToHide: words } });
        setActive(true);
        chrome.storage.sync.set({ active: true });
      }
    });
  };

  const disableHiding = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const id = tabs[0].id;

      if (id) {
        chrome.tabs.sendMessage(id, { type: DISABLE, data: { wordsToShow: words } }, function () {
          // setActive(false);
        });
        setActive(false);
        chrome.storage.sync.set({ active: false });
      }
    });
  };

  const addWord = () => {
    const newWord = input;
    setInput("");
    const updatedWords = [...words, newWord];
    setWords(updatedWords);
    chrome.storage.sync.set({ words: updatedWords });
    if (!words.includes(newWord) && newWord) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const id = tabs[0].id;

        if (id) {
          chrome.tabs.sendMessage(id, { type: ADD, data: { newWord, active } });
        }
      });
    }
  };

  const removeWord = (word: string) => {
    const updatedWords = words.filter((w) => w !== word);
    setWords(updatedWords);
    chrome.storage.sync.set({ words: updatedWords });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const id = tabs[0].id;

      if (id) {
        chrome.tabs.sendMessage(id, { type: REMOVE, data: { removeWord: word, active } });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img className="fearlessLogo" src="/logo.png" alt="Fear Less Logo" />
        <div className="hidingButton" onClick={() => (active ? disableHiding() : activateHiding())}>
          <input type="checkbox" checked={active} />
          <label className="hidingButtonLabel">Hiding Active</label>
        </div>
      </header>
      <div className="hiddenWords">
        <p>Your muted words:</p>
        <ul className="wordsList">
          {words.map((word) => {
            return (
              <li className="wordItem" key={word}>
                {word}{" "}
                <span onClick={() => removeWord(word)} style={{ cursor: "pointer" }}>
                  X
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="addWord">
        <input className="addWordInput" value={input} onChange={handleInputChange} />
        <button className="buttonAdd" onClick={addWord}>
          Add Word
        </button>
      </div>
    </div>
  );
};

export default App;
