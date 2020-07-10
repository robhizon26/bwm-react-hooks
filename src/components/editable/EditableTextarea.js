import React from "react";
import EditableComponent from "./EditableComponent";

export const EditableTextarea = (props) => {
  const { className, rows, cols } = props;
  return (
    <EditableComponent
      {...props}
      renderComponent={(value, onChange, onKeyDown) => (
        <textarea
          onKeyDown={onKeyDown}
          onChange={onChange}
          className={`editable-item ${className}`}
          value={value}
          rows={rows}
          cols={cols}
        />
      )}
    />
  );
};
 