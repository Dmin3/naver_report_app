import React from 'react';
import './KeywordReport.css';

const KeywordSelector = ({
  relatedKeywords,
  choicedKeywords,
  handleChoiceKeyword,
  handleReset,
  error,
}) => {
  return (
    <>
      <div className="keyword-badge-container">
        {relatedKeywords.map((keyword, idx) => (
          <span
            key={idx}
            className="keyword-badge"
            onClick={() => handleChoiceKeyword(keyword)}
          >
            # {keyword}
          </span>
        ))}
      </div>
      <div className="input-group">
        <input
          className="keyword-input"
          type="text"
          placeholder="키워드를 클릭해주세요!!"
          value={choicedKeywords.join(" ")}
          readOnly
        />
        <button type="button" className="reset-button" onClick={handleReset}>
          초기화
        </button>
      </div>
      {error && (
        <div className="text-danger small mb-3 mt-2">{error}</div>
      )}
    </>
  );
};

export default KeywordSelector;
