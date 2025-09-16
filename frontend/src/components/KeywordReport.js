import React, { useState, useEffect } from "react";
import CustomLoadingSpinner from "./CustomLoadingSpinner";
import "react-datepicker/dist/react-datepicker.css";
import "./KeywordReport.css";
import KeywordSearchForm from "./KeywordSearchForm";
import KeywordSelector from "./KeywordSelector";
import ReportOptions from "./ReportOptions";
import ReportResult from "./ReportResult";

function KeywordReport() {
  // --- State Variables ---
  const [formState, setFormState] = useState({
    keyword: "",
    choicedKeywords: [],
    startDate: new Date('2025-01-01'),
    endDate: new Date(),
    ages: [],
    gender: "",
    timeUnit: "date",
  });

  const [apiState, setApiState] = useState({
    isLoading: { keywords: false, report: false },
    error: { keywords: null, report: null, choice: null },
    pdfBlob: null, // PDF blob 데이터를 저장할 상태
    relatedKeywords: [],
  });

  const [seconds, setSeconds] = useState(0);

  // useEffect for timer
  useEffect(() => {
    let interval = null;
    if (apiState.isLoading.report) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [apiState.isLoading.report]);

  // --- Event Handlers ---
  const handleAgeChange = (e) => {
    const { value, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      ages: checked ? [...prev.ages, value] : prev.ages.filter((age) => age !== value),
    }));
  };

  const handleGenderChange = (e) => {
    setFormState(prev => ({ ...prev, gender: e.target.value }));
  };

  const handleTimeUnitChange = (e) => {
    setFormState(prev => ({ ...prev, timeUnit: e.target.value }));
  };

  const handleKeywordSearch = async (e) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, choicedKeywords: [] }));
    setApiState(prev => ({ ...prev, relatedKeywords: [], error: { ...prev.error, keywords: null } }));

    try {
      setApiState(prev => ({ ...prev, isLoading: { ...prev.isLoading, keywords: true } }));
      const response = await fetch("http://localhost:8000/api/keyword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: formState.keyword }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
      }

      const { related_keywords } = await response.json();
      setApiState(prev => ({ ...prev, relatedKeywords: related_keywords }));
    } catch (error) {
      console.error("Error fetching related keywords:", error);
      setApiState(prev => ({ ...prev, error: { ...prev.error, keywords: error.message } }));
    } finally {
      setApiState(prev => ({ ...prev, isLoading: { ...prev.isLoading, keywords: false } }));
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    // 보고서 생성 요청 전에 기존 pdfBlob과 에러 상태를 초기화합니다.
    setApiState(prev => ({ ...prev, isLoading: { ...prev.isLoading, report: true }, pdfBlob: null, error: { ...prev.error, report: null } }));

    const { keyword, choicedKeywords, timeUnit, startDate, endDate, ages, gender } = formState;
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    try {
      const response = await fetch("http://localhost:8000/api/keyword/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: keyword,
          keywords: choicedKeywords,
          time_unit: timeUnit,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          ages,
          gender,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      // blob 객체를 상태에 저장합니다.
      setApiState(prev => ({ ...prev, pdfBlob: blob }));
    } catch (error) {
      console.error("Error generating report:", error);
      setApiState(prev => ({ ...prev, error: { ...prev.error, report: error.message } }));
    } finally {
      setApiState(prev => ({ ...prev, isLoading: { ...prev.isLoading, report: false } }));
    }
  };

  const handleChoiceKeyword = (keyword) => {
    if (formState.choicedKeywords.length >= 5) {
      setApiState(prev => ({ ...prev, error: { ...prev.error, choice: "키워드는 최대 5개 까지 입니다." } }));
    } else if (!formState.choicedKeywords.includes(keyword)) {
      setFormState((prev) => ({ ...prev, choicedKeywords: [...prev.choicedKeywords, keyword] }));
    } else {
      setApiState(prev => ({ ...prev, error: { ...prev.error, choice: "이미 추가되었습니다." } }));
    }
  };

  const handleReset = () => {
    setFormState(prev => ({ ...prev, choicedKeywords: [] }));
    setApiState(prev => ({ ...prev, error: { ...prev.error, choice: null } }));
  };

  // --- Render Data ---
  const timeUnitOptions = [
    { label: '일간', value: 'date' },
    { label: '주간', value: 'week' },
    { label: '월간', value: 'month' },
  ];
  
  const ageOptions = ['10', '20', '30', '40', '50', '60'].map(age => ({
    value: age,
    label: `${age}대`,
  }));
  
  const genderOptions = [
    { label: '전체', value: '' },
    { label: '남성', value: 'm' },
    { label: '여성', value: 'f' },
  ];

  return (
    <>
      <div className="alert alert-info" role="alert">
        <strong>사용법:</strong> 검색어를 입력하여 연관 키워드를 조회하고, 보고서에 포함할 키워드를 최대 5개까지 선택하세요. 그 다음, 기간, 연령, 성별 등 상세 옵션을 설정하고 '보고서 생성하기' 버튼을 클릭하세요.
      </div>
      <KeywordSearchForm
        handleSubmit={handleKeywordSearch}
        keyword={formState.keyword}
        setKeyword={(value) => setFormState(prev => ({ ...prev, keyword: value }))}
      />

      {apiState.isLoading.keywords && <CustomLoadingSpinner />}
      {apiState.error.keywords && (
        <div className="alert alert-danger mt-4" role="alert">
          <strong>오류 발생:</strong> {apiState.error.keywords}
        </div>
      )}

      <KeywordSelector
        relatedKeywords={apiState.relatedKeywords}
        choicedKeywords={formState.choicedKeywords}
        handleChoiceKeyword={handleChoiceKeyword}
        handleReset={handleReset}
        error={apiState.error.choice}
      />

      <form onSubmit={handleReportSubmit}>
        <ReportOptions
          formState={formState}
          setFormState={setFormState}
          handleTimeUnitChange={handleTimeUnitChange}
          handleAgeChange={handleAgeChange}
          handleGenderChange={handleGenderChange}
          timeUnitOptions={timeUnitOptions}
          ageOptions={ageOptions}
          genderOptions={genderOptions}
        />
        <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg mt-4"
          disabled={apiState.isLoading.report}
        >
          {apiState.isLoading.report ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              보고서 생성 중...({seconds}s)
            </>
          ) : (
            "보고서 생성하기"
          )}
        </button>
        </div>
      </form>

      <ReportResult error={apiState.error.report} pdfBlob={apiState.pdfBlob} />
    </>
  );
}

export default KeywordReport;
