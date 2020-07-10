import React from "react";
import EditableComponent from "./EditableComponent";

export const EditableSelect = (props) => {
  const renderOptions = (options) =>
    options.map((option) => (
      <option key={option} value={option}>{`${option}`}</option>
    ));

  const { className, options } = props;
  return (
    <EditableComponent
      {...props}
      renderComponent={(value, onChange, onKeyDown) => (
        <select
          onKeyDown={onKeyDown}
          onChange={onChange}
          className={`editable-item ${className}`}
          value={value}
        >
          {renderOptions(options)}
        </select>
      )}
    />
  );
};
 