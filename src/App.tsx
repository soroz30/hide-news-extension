/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { useEffect, useState } from "preact/hooks";
import Header from "./components/Header";
import WordsList from "./components/WordsList";
import AddWord from "./components/AddWord";
import "./App.css";
import { extensionApi, getSvgUrl, WORDS, ACTIVE } from "./common";
import check from "./assets/images/check@3x.svg";
import plus from "./assets/images/plus@3x.svg";
const storage = extensionApi.storage.sync;

const notifyActiveTabs = () => {
  extensionApi.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const id = tabs[0].id;
    if (id) {
      extensionApi.tabs.sendMessage(id, "refresh", () => {
        if (!extensionApi.runtime.lastError) {
          /* empty */
        }
      });
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
    notifyActiveTabs();
  };

  const disableHiding = () => {
    storage.set({ active: false });
    setActive(false);
    notifyActiveTabs();
  };

  const addWord = () => {
    const newWord = input;
    const lowerCaseWord = newWord.toLowerCase();
    setInput("");

    const lowerKeyWords = words.map((word) => word.toLowerCase());
    if (lowerKeyWords.includes(lowerCaseWord) || !newWord) {
      return;
    }

    const updatedWords = [...words, newWord];
    setWords(updatedWords);
    storage.set({ words: updatedWords });

    notifyActiveTabs();
  };

  const removeWord = (word: string) => {
    const lowerCaseWord = word.toLowerCase();
    const updatedWords = words.filter((w) => w.toLowerCase() !== lowerCaseWord);
    setWords(updatedWords);
    storage.set({ words: updatedWords });

    notifyActiveTabs();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addWord();
    }
  };

  const handleButtonClick = () => {
    active ? disableHiding() : activateHiding();
  };

  return (
    <div className="App">
      <Header>
        <div className="hidingButton" onClick={handleButtonClick}>
          <input className="checkbox-input" id="hiding" type="checkbox" checked={active} />
          <label className="checkbox" htmlFor="hiding">
            <span>
              <img src={`${getSvgUrl(check)}`} alt="active" />
            </span>
            <span className="hidingButtonLabel">Hiding Active</span>
          </label>
        </div>
      </Header>
      <WordsList>
        {words.map((word) => {
          return (
            <li className="wordItem" key={word}>
              {word}{" "}
              <span className="wordRemove" onClick={() => removeWord(word)} style={{ cursor: "pointer" }}>
                <a href="#" className="close"></a>
              </span>
            </li>
          );
        })}
      </WordsList>
      <AddWord>
        <input
          className="addWordInput"
          value={input}
          onChange={handleInputChange}
          placeholder={"Add a new word"}
          onKeyDown={handleKeyPress}
        />
        <button className="buttonAdd" onClick={addWord}>
          <img src={`${getSvgUrl(plus)}`} alt="plus" />
          <span className="buttonAddLabel">Add</span>
        </button>
      </AddWord>
    </div>
  );
};

export default App;
