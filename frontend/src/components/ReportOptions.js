import React from 'react';
import DatePicker from 'react-datepicker';
import ButtonGroup from './ButtonGroup';

const ReportOptions = ({
  formState,
  setFormState,
  handleTimeUnitChange,
  handleAgeChange,
  handleGenderChange,
  timeUnitOptions,
  ageOptions,
  genderOptions,
}) => {
  return (
    <>
      {/* Date Range Picker */}
      <div className="mb-3">
        <label htmlFor="dateRange" className="form-label d-block mt-4">
          기간 선택
        </label>
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
    </>
  );
};

export default ReportOptions;
