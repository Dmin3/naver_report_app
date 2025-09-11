import React from 'react';
import DatePicker from 'react-datepicker';
import ButtonGroup from './ButtonGroup';

const ReportForm = ({
  handleSubmit,
  selectedGroupLabel,
  handleCategory1Change,
  categoryGroups,
  formState,
  handleCategory2Change,
  selectedGroup,
  setFormState,
  timeUnitOptions,
  handleTimeUnitChange,
  ageOptions,
  handleAgeChange,
  genderOptions,
  handleGenderChange,
  apiState,
  seconds,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {/* Category Selectors */}
      <div className="mb-3">
        <div className="row">
          <div className="col">
            <label htmlFor="category1Selector" className="form-label">1차 분류</label>
            <select
              id="category1Selector"
              className="form-select"
              value={selectedGroupLabel}
              onChange={handleCategory1Change}
            >
              {categoryGroups.map(group => (
                <option key={group.label} value={group.label}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label htmlFor="category2Selector" className="form-label">2차 분류</label>
            <select
              id="category2Selector"
              className="form-select"
              value={formState.categoryId}
              onChange={handleCategory2Change}
              required
            >
              {selectedGroup.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-text mt-2">
          네이버 데이터랩 쇼핑인사이트의 <a href="https://developers.naver.com/docs/serviceapi/datalab/shopping/shopping.md#%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC-%EC%BD%94%EB%93%9C" target="_blank" rel="noopener noreferrer">카테고리 코드</a>를 선택하세요.
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="mb-3">
        <label htmlFor="dateRange" className="form-label d-block">기간 선택</label>
        <div className="d-flex align-items-center">
          <DatePicker
            selected={formState.startDate}
            onChange={(date) => setFormState(prev => ({ ...prev, startDate: date }))}
            selectsStart
            startDate={formState.startDate}
            endDate={formState.endDate}
            className="form-control"
          />
          <span className="mx-2">~</span>
          <DatePicker
            selected={formState.endDate}
            onChange={(date) => setFormState(prev => ({ ...prev, endDate: date }))}
            selectsEnd
            startDate={formState.startDate}
            endDate={formState.endDate}
            minDate={formState.startDate}
            className="form-control"
          />
        </div>
        <div className="form-text mt-2">
          최대 기간 선택은 <strong>1년</strong> 입니다.
        </div>
      </div>

      
      <ButtonGroup
        label="기간 선택 2"
        name="timeunit"
        options={timeUnitOptions}
        type="radio"
        selectedValue={formState.timeUnit}
        onChange={handleTimeUnitChange}
        ariaLabel="TimeUnit"
      />

      <ButtonGroup
        label="연령대 선택"
        name="age"
        options={ageOptions}
        type="checkbox"
        selectedValue={formState.ages}
        onChange={handleAgeChange}
        ariaLabel="Age group"
      />

      <ButtonGroup
        label="성별 선택"
        name="gender"
        options={genderOptions}
        type="radio"
        selectedValue={formState.gender}
        onChange={handleGenderChange}
        ariaLabel="Gender"
      />

      {/* Submit Button */}
      <div className="d-grid">
        <button type="submit" className="btn btn-primary btn-lg" disabled={apiState.isLoading}>
          {apiState.isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              보고서 생성 중...({seconds}s)
            </>
            
          ) : '보고서 생성하기'}
        </button>
        
      </div>
    </form>
  );
};

export default ReportForm;
