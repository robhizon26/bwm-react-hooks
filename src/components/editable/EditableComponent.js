import React, { useState } from "react";

const EditableComponent = (props) => {
  const {
    onUpdate,
    entity,
    field,
    className,
    transformView,
    viewComponent: ViewComponent,
    renderComponent,
    containerType,
  } = props;

  const [value, setValue] = useState(entity[field]);
  const [originValue, setOriginValue] = useState(entity[field]);
  const [isActiveInput, setIsActiveInput] = useState(false);

  const update = () => {
    if (value !== originValue) {
      onUpdate(
        { [field]: value },
        () => {
          setIsActiveInput(false);
          setOriginValue(value);
        },
        () => {
          setIsActiveInput(false);
          setValue(originValue);
        }
      );
    }
  };

  const activateInput = () => setIsActiveInput(true);

  const disableInput = () => {
    setIsActiveInput(false);
    setValue(originValue);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      update();
    } else if (event.key === "Escape") {
      disableInput();
    }
  };

  const renderView = () => {
    const viewValue = transformView ? transformView(value) : `${value}`;
    if (ViewComponent) {
      return (
        <ViewComponent
          value={viewValue}
          className={`editable-item ${className}`}
        />
      );
    }
    return <span className={`editable-item ${className}`}>{viewValue}</span>;
  };

  const renderComponentView = () => {
    if (isActiveInput) {
      return (
        <>
          {renderComponent(value, handleChange, handleKeyDown)}
          <div className="button-container">
            <button
              onClick={update}
              className="btn btn-success btn-editable"
            >
              Save
            </button>
            <button
              onClick={disableInput}
              className="btn btn-danger btn-editable"
            >
              Cancel
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        {renderView()}
        <div className="button-container">
          <button
            onClick={activateInput}
            className="btn btn-warning btn-editable"
          >
            Edit
          </button>
        </div>
      </>
    );
  };

  let containerClass = "";
  if (containerType === "inline") {
    containerClass = "editable-component-inline";
  } else if (containerType === "block") {
    containerClass = "editable-component-block";
  }
  return (
    <div className={`editable-component ${containerClass}`}>
      {renderComponentView()}
    </div>
  );
};

export default EditableComponent; 