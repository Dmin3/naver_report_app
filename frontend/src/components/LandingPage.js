import React, { useEffect } from 'react';
import "./LandingPage.css";
// onStart 함수를 props로 받아와 버튼 클릭 시 호출합니다.
const LandingPage = ({ onStart }) => {

  // useEffect는 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.
  useEffect(() => {
    // 컴포넌트가 마운트될 때 body 스크롤을 막습니다.
    document.body.style.overflow = 'hidden';

    // 마우스 라이트 효과
    const light = document.querySelector('.cursor-light');
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        if(light) light.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      });
    };
    document.addEventListener('mousemove', handleMouseMove);

    // 타이틀 텍스트 애니메이션
    const title = document.getElementById('main-title');
    if (title) {
      const text = title.innerText;
      title.innerHTML = '';
      text.split('').forEach((char, index) => {
          const span = document.createElement('span');
          span.innerHTML = char === ' ' ? '&nbsp;' : char;
          span.style.animationDelay = `${index * 0.05}s`;
          title.appendChild(span);
      });
    }

    // 배경 파티클 생성
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer) {
      const particleCount = 80;
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = `${Math.random() * 100}vw`;
          particle.style.width = '1.5px';
          particle.style.height = `${Math.random() * 20 + 10}px`;
          particle.style.animationDuration = `${Math.random() * 8 + 5}s`;
          particle.style.animationDelay = `${Math.random() * 10}s`;
          fragment.appendChild(particle);
      }
      particlesContainer.appendChild(fragment);
    }

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거하고 body 스크롤을 복원합니다.
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.overflow = 'auto';
    };
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행되도록 합니다。

  return (
    <>
   <div className="cursor-light"></div>
      <div className="particles" id="particles-container"></div>

      <div className="landing-container d-flex justify-content-center align-items-center vh-100 text-center" id="landingContainer">
        <div className="content-wrapper">
          <h1 id="main-title">AI가 분석한 네이버 쇼핑 트렌드</h1>
          <p>시장의 흐름을 예측하는 가장 확실한 방법. AI가 분석한 데이터 인사이트로 당신의 비즈니스를 확신을 더해보세요.</p>
          <button id="try-it-btn" onClick={onStart}>Try It</button>
        </div>
      </div>
    </>
  );
};

export default LandingPage;

