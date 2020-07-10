import React from "react";
import EditableComponent from "./EditableComponent";

export const EditableInput = (props) => {
  return (
    <EditableComponent
      {...props}
      renderComponent={(value, onChange, onKeyDown) => (
        <input
          onKeyDown={onKeyDown}
          value={value}
          onChange={onChange}
          className={`editable-item ${props.className}`}
        ></input>
      )}
    />
  );
};
 