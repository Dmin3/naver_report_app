import React, { useState, useEffect } from 'react';
import './CustomLoadingSpinner.css';

// 커스텀 로딩 스피너 컴포넌트
function CustomLoadingSpinner() {
  // 타이머를 위한 state와 effect를 다시 추가했습니다.
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // 1초마다 seconds state를 1씩 증가시키는 인터벌
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="custom-spinner-container">
      {/* SVG를 이용한 원형 스피너 */}
      <div className="custom-spinner-wrapper">
        <svg
          viewBox="0 0 60 60"
          className="custom-spinner"
        >
          {/* 배경 원 */}
          <circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="5"
          />
          {/* 움직이는 원 */}
          <circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#007bff"
            strokeWidth="5"
            className="custom-spinner-circle"
          />
        </svg>

        {/* 시간 표시 텍스트를 다시 추가했습니다. */}
        <div className="custom-spinner-timer">
          {seconds}s
        </div>
      </div>
    </div>
  );
}

export default CustomLoadingSpinner;

