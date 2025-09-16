import React ,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import ProductReport from './components/ProductReport';
import KeywordReport from './components/KeywordReport';
import LandingPage from './components/LandingPage';
import './App.css';


function App() {
  // 랜딩 페이지를 보여줄지 여부를 결정하는 state
  const [showLanding, setShowLanding] = useState(true);

  // 'Try It' 버튼이 클릭되면 호출될 함수
  const handleStart = () => {
    // fade-out 애니메이션을 위해 CSS 클래스를 추가하고
    const landingContainer = document.querySelector('.landing-container');
    if (landingContainer) {
        landingContainer.classList.add('fade-out');
    }

    // 애니메이션 시간(0.8초) 후에 state를 변경하여 메인 앱을 보여줍니다.
    setTimeout(() => {
        setShowLanding(false);
    }, 800);
  };

  // showLanding이 true이면 LandingPage 컴포넌트만 렌더링합니다.
  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <Router>
      <div className="App container">
        <header className="app-header">
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
