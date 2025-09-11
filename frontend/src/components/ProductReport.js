import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { categoryGroups } from './categoryData';
import ReportForm from './ReportForm';
import ReportResult from './ReportResult';

function ProductReport() {
  // --- State Variables ---
  const [selectedGroupLabel, setSelectedGroupLabel] = useState(categoryGroups[0].label);

  // Find the initial group and its first option to set the initial state
  const initialGroup = categoryGroups.find(g => g.label === selectedGroupLabel);
  const initialOption = initialGroup.options[0];

  const [formState, setFormState] = useState({
    categoryId: initialOption.value,
    categoryTitle: initialOption.originalLabel,
    startDate: new Date('2025-01-01'),
    endDate: new Date(),
    ages: [],
    gender: '',
    timeUnit: 'date',
  });

  const [apiState, setApiState] = useState({
    isLoading: false,
    error: null,
    pdfUrl: null,
  });

  const [seconds, setSeconds] = useState(0);

  // useEffect for timer
  useEffect(() => {
    let interval = null;
    if (apiState.isLoading) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [apiState.isLoading]);

  // --- Event Handlers ---
  const handleCategory1Change = (e) => {
    const newGroupLabel = e.target.value;
    setSelectedGroupLabel(newGroupLabel);

    const newGroup = categoryGroups.find(g => g.label === newGroupLabel);
    if (newGroup && newGroup.options.length > 0) {
      const firstOption = newGroup.options[0];
      setFormState(prev => ({
        ...prev,
        categoryId: firstOption.value,
        categoryTitle: firstOption.originalLabel,
      }));
    }
  };

  const handleCategory2Change = (e) => {
    const selectedId = e.target.value;
    const selectedGroup = categoryGroups.find(g => g.label === selectedGroupLabel);
    const selectedOption = selectedGroup.options.find(opt => opt.value === selectedId);
    if (selectedOption) {
      setFormState(prev => ({
        ...prev,
        categoryId: selectedOption.value,
        categoryTitle: selectedOption.originalLabel,
      }));
    }
  };

  const handleAgeChange = (e) => {
    const { value, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      ages: checked ? [...prev.ages, value] : prev.ages.filter(age => age !== value),
    }));
  };

  const handleGenderChange = (e) => {
    setFormState(prev => ({ ...prev, gender: e.target.value }));
  };

  const handleTimeUnitChange = (e) => {
    setFormState(prev => ({ ...prev, timeUnit: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiState({ isLoading: true, error: null, pdfUrl: null });

    const {
      categoryTitle,
      categoryId,
      timeUnit,
      startDate,
      endDate,
      ages,
      gender,
    } = formState;

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    try {
      const response = await fetch('http://localhost:8000/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_title: categoryTitle,
          category_id: categoryId,
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
      const url = URL.createObjectURL(blob);
      setApiState(prev => ({ ...prev, pdfUrl: url, error: null }));
    } catch (error) {
      console.error('Error generating report:', error);
      setApiState(prev => ({ ...prev, error: error.message, pdfUrl: null }));
    } finally {
      setApiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // --- Render Data ---
  const selectedGroup = categoryGroups.find(g => g.label === selectedGroupLabel) || { options: [] };

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
      <ReportForm
        handleSubmit={handleSubmit}
        selectedGroupLabel={selectedGroupLabel}
        handleCategory1Change={handleCategory1Change}
        categoryGroups={categoryGroups}
        formState={formState}
        handleCategory2Change={handleCategory2Change}
        selectedGroup={selectedGroup}
        setFormState={setFormState}
        timeUnitOptions={timeUnitOptions}
        handleTimeUnitChange={handleTimeUnitChange}
        ageOptions={ageOptions}
        handleAgeChange={handleAgeChange}
        genderOptions={genderOptions}
        handleGenderChange={handleGenderChange}
        apiState={apiState}
        seconds={seconds}
      />
      <ReportResult error={apiState.error} pdfUrl={apiState.pdfUrl} />
    </>
  );
}

export default ProductReport;
