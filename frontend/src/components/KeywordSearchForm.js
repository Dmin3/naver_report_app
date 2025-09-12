import React from 'react';

const KeywordSearchForm = ({ handleSubmit, keyword, setKeyword }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label htmlFor="keyword" className="form-label">
          검색어
        </label>
        <div className="input-group mt-1">
          <input
            type="text"
            className="form-control"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            검색
          </button>
        </div>
      </div>
    </form>
  );
};

export default KeywordSearchForm;
