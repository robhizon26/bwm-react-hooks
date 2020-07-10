import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCrop = (props) => {
  const [crop, setCrop] = useState({
    unit: "%", // default, can be 'px' or '%'
    x: 0,
    y: 0,
    aspect: 3 / 2,
    width: 100,
  });

  const onChange = (crop) => {
    setCrop(crop);
  };

  const { src, onImageLoaded, onCropComplete } = props;
  return (
    <ReactCrop
      src={src}
      crop={crop}
      onImageLoaded={onImageLoaded}
      onComplete={onCropComplete}
      onChange={onChange}
    />
  );
};

export default ImageCrop;
 