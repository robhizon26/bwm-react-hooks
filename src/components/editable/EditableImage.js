
import React from 'react';
import EditableComponent from './EditableComponent';
import FileLoader from 'components/file-upload/FileLoader';

const ImageView = ({value, ...rest}) => {
  return <img {...rest} src={value} alt=""></img>
}

const createEvent = (value) => ({target: {value}})
  
export const EditableImage =props=> {
    return (
      <EditableComponent
        {...props}
        viewComponent={ImageView}
        renderComponent={(value, onChange, onKeyDown) => 
          <FileLoader onFileUpload={image => onChange(createEvent(image))}/>
        }
      />
    )
}

 
