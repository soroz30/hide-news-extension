/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { useEffect, useState } from "react";
import Header from "./components/Header";
import WordsList from "./components/WordsList";
import AddWord from "./components/AddWord";
import AddWordInput from "./components/AddWordInput";
import AddWordButton from "./components/AddWordButton";
import HeaderButton from "./components/HeaderButton";
import WordItem from "./components/WordItem";
import { extensionApi, refreshActiveTab, WORDS, ACTIVE } from "./common";
import "./App.css";
const storage = extensionApi.storage.sync;

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
    refreshActiveTab();
  };

  const disableHiding = () => {
    storage.set({ active: false });
    setActive(false);
    refreshActiveTab();
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

    refreshActiveTab();
  };

  const removeWord = (word: string) => {
    const lowerCaseWord = word.toLowerCase();
    const updatedWords = words.filter((w) => w.toLowerCase() !== lowerCaseWord);
    setWords(updatedWords);
    storage.set({ words: updatedWords });

    refreshActiveTab();
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
      <Header button={<HeaderButton onClick={handleButtonClick} checked={active} />} />
      <WordsList>
        {words.map((word) => {
          return <WordItem key={word} word={word} onClick={() => removeWord(word)} />;
        })}
      </WordsList>
      <AddWord>
        <AddWordInput
          value={input}
          onChange={handleInputChange}
          placeholder={"Add a new word"}
          onKeyDown={handleKeyPress}
        />
        <AddWordButton onClick={addWord} />
      </AddWord>
    </div>
  );
};

export default App;
