/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { ADD, REMOVE, ENABLE, DISABLE, WORDS, ACTIVE } from "../content-script/main";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import WordsList from "./components/WordsList";
import AddWord from "./components/AddWord";
import "./App.css";

const sendToTabs = (message: any) => {
  chrome.tabs.query({}, function (tabs) {
    for (let i = 0; i < tabs.length; ++i) {
      const id = tabs[i].id;
      if (id) {
        chrome.tabs.sendMessage(id, message, () => {
          if (!window.chrome.runtime.lastError) {
            /* empty */
          }
        });
      }
    }
  });
};

const App = () => {
  const [words, setWords] = useState<string[]>([]);
  const [active, setActive] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    chrome.storage.sync.get([WORDS, ACTIVE], (items) => {
      const { words, active } = items;

      if (words) {
        setWords(words);
      }
      setActive(active);
    });
  }, []);

  const activateHiding = () => {
    chrome.storage.sync.set({ active: true });
    setActive(true);
    sendToTabs({ type: ENABLE, data: { wordsToHide: words } });
  };

  const disableHiding = () => {
    chrome.storage.sync.set({ active: false });
    setActive(false);
    sendToTabs({ type: DISABLE, data: { wordsToShow: words } });
  };

  const addWord = () => {
    const newWord = input.toLowerCase();
    setInput("");

    if (words.includes(newWord) || !newWord) {
      return;
    }

    const updatedWords = [...words, newWord];
    setWords(updatedWords);
    chrome.storage.sync.set({ words: updatedWords });

    if (active) {
      sendToTabs({ type: ADD, data: { newWord } });
    }
  };

  const removeWord = (word: string) => {
    const updatedWords = words.filter((w) => w !== word);
    setWords(updatedWords);
    chrome.storage.sync.set({ words: updatedWords });

    if (active) {
      sendToTabs({ type: REMOVE, data: { removeWord: word } });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleButtonClick = () => {
    active ? disableHiding() : activateHiding();
  };

  return (
    <div className="App">
      <Header>
        <div className="hidingButton" onClick={handleButtonClick}>
          <input type="checkbox" checked={active} />
          <label className="hidingButtonLabel">Hiding Active</label>
        </div>
      </Header>
      <WordsList>
        {words.map((word) => {
          return (
            <li className="wordItem" key={word}>
              {word}{" "}
              <span className="wordRemove" onClick={() => removeWord(word)} style={{ cursor: "pointer" }}>
                X
              </span>
            </li>
          );
        })}
      </WordsList>
      <AddWord>
        <input className="addWordInput" value={input} onChange={handleInputChange} placeholder={"Add a new word"} />
        <button className="buttonAdd" onClick={addWord}>
          Add
        </button>
      </AddWord>
    </div>
  );
};

export default App;
