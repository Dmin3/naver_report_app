import React from 'react';

const ButtonGroup = ({
  label,
  name,
  options,
  type,
  selectedValue,
  onChange,
  ariaLabel
}) => {
  return (
    <div className="mb-3">
      <label className="form-label d-block">{label}</label>
      <div className="btn-group" role="group" aria-label={ariaLabel || label}>
        {options.map(({ value, label: optionLabel }) => {
          const id = `${name}${value || 'all'}`;
          const isChecked = type === 'radio'
            ? selectedValue === value
            : selectedValue.includes(value);

          return (
            <React.Fragment key={value}>
              <input
                type={type}
                className="btn-check"
                name={name}
                id={id}
                value={value}
                autoComplete="off"
                checked={isChecked}
                onChange={onChange}
              />
              <label className="btn btn-outline-primary" htmlFor={id}>
                {optionLabel}
              </label>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonGroup;
