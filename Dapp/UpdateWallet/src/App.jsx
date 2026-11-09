import React from 'react';
import { Routes, Route } from "react-router-dom"
import 'antd/dist/antd.css';
import './App.css';
import Home from "./Home"
import About from "./About"
import Contact from "./Contact"
import Walletconnect from "./Walletconnect"
import './App.css';

import local from "./utils/local.json";
import en_US from "./locales/en_US";
import zh_CN from "./locales/zh_CN";

let language = {};
switch(local["local"]) {
  case "en_US":
    // 英语 美式
    language = en_US;
    break;
  case "zh_CN":
    // 简体中文
    language = zh_CN;
    break;
  default:
    language = en_US;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/:tokenID" element={ <Home language={language} /> } />
        <Route path="walletconnect/:tokenID" element={ <Walletconnect language={language} /> } />
        <Route path="about" element={ <About/> } />
        <Route path="contact" element={ <Contact/> } />
      </Routes>
    </div>
  )
}

export default App