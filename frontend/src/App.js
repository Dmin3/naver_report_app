import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import ProductReport from './components/ProductReport';
import KeywordReport from './components/KeywordReport';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App container mt-5">
        <header className="text-center mb-5">
          <h1>네이버 쇼핑 트렌드 분석 AI</h1>
          <p className="lead">궁금한 키워드나 카테고리를 입력하고, AI가 찾아낸 숨겨진 시장 트렌드를 발견해 보세요.</p>
        </header>

        <div className="card p-4">
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">상품</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/keyword">검색어</NavLink>
            </li>
          </ul>
          <Routes>
            <Route path="/" element={<ProductReport />} />
            <Route path="/keyword" element={<KeywordReport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
