import React from 'react';

const KeywordSearchForm = ({ handleSubmit, keyword, setKeyword }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="keyword" className="form-label">
          검색어
        </label>
        <input
          type="text"
          className="form-control"
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
        />
      </div>
      {/* The submit is implicitly handled by the form's onSubmit */}
    </form>
  );
};

export default KeywordSearchForm;
