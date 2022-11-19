/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { WORDS, ACTIVE } from "../content-script/main";

import { useEffect, useState } from "preact/hooks";
import Header from "./components/Header";
import WordsList from "./components/WordsList";
import AddWord from "./components/AddWord";
import "./App.css";
const storage = chrome.storage.sync;

const notifyTabs = () => {
  chrome.tabs.query({}, function (tabs) {
    for (let i = 0; i < tabs.length; ++i) {
      const id = tabs[i].id;
      if (id) {
        chrome.tabs.sendMessage(id, "refresh", () => {
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
    storage.get([WORDS, ACTIVE], (items) => {
      const { words, active } = items;

      if (words) {
        setWords(words);
      }
      setActive(active);
    });
  }, []);

  const activateHiding = () => {
    storage.set({ active: true });
    setActive(true);
    notifyTabs();
  };

  const disableHiding = () => {
    storage.set({ active: false });
    setActive(false);
    notifyTabs();
  };

  const addWord = () => {
    const newWord = input.toLowerCase();
    setInput("");

    if (words.includes(newWord) || !newWord) {
      return;
    }

    const updatedWords = [...words, newWord];
    setWords(updatedWords);
    storage.set({ words: updatedWords });

    notifyTabs();
  };

  const removeWord = (word: string) => {
    const updatedWords = words.filter((w) => w !== word);
    setWords(updatedWords);
    storage.set({ words: updatedWords });

    notifyTabs();
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
