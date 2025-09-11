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
          <h1>네이버 쇼핑 트렌드 PDF 보고서 생성기</h1>
          <p className="lead">카테고리와 기간을 선택하여 트렌드 보고서를 생성하세요.</p>
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
