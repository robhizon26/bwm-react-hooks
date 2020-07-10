import React, { useState,useRef } from "react";
import Spinner from "components/shared/Spinner";
import { uploadImage } from "actions";
import { blobToFile, getCroppedImg } from "helpers/functions";
import ImageCrop from "./ImageCrop";
import "./FileLoader.scss";

class ImageSnippet {
  constructor(src, name, type) {
    this.src = src;
    this.name = name;
    this.type = type;
  }
}
 
let originalImage = null;

const FileLoader = (props) => {
  let inputRef = useRef();//React.createRef();
  let fileReader = new FileReader();

  const [croppedImg, setCroppedImg] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [imgStatus, setImgStatus] = useState("INIT");

  const handleImageUpload = () => {
    changeImageStatus("PENDING");
    const imageToUpload = blobToFile(croppedImg);
    uploadImage(imageToUpload)
      .then((uploadedImage) => {
        props.onFileUpload(uploadedImage);
        changeImageStatus("UPLOADED");
      })
      .catch(() => {
        changeImageStatus("ERROR");
      });
  };

  const handleImageLoad = (image) => (originalImage = image);

  const handleCropComplete = async (crop) => {
    if (!originalImage) {
      return;
    }
    const croppedImg = await getCroppedImg(
      originalImage,
      crop,
      selectedImg.name
    );
    setCroppedImg(croppedImg);
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    fileReader.onloadend = (event) => {
      const selectedImg = new ImageSnippet(
        event.target.result,
        file.name,
        file.type
      );
      setSelectedImg(selectedImg);
      setImgStatus("LOADED");
    };
    fileReader.readAsDataURL(file);
  };

  const cancelImage = () => {
    inputRef.current.value = null;
    originalImage = null;
    setCroppedImg(null);
    setSelectedImg(null);
    setImgStatus("INIT");
  };

  const changeImageStatus = (imgStatus) => setImgStatus(imgStatus);

  return (
    <div className="img-upload-container mb-2">
      <label className="img-upload btn btn-bwm-main">
        <span className="upload-text">Select an image</span>
        <input
          ref={inputRef}
          onChange={handleChange}
          accept=".jpg, .png, .jpeg"
          className="fileInput"
          type="file"
        />
      </label>
      {selectedImg && (
        <ImageCrop
          src={selectedImg.src}
          onCropComplete={handleCropComplete}
          onImageLoaded={handleImageLoad}
        />
      )}
      {selectedImg && (
        <>
          <div className="img-preview-container mb-2">
            <div className="img-preview">
              <img
                src={(croppedImg && croppedImg.url) || selectedImg.src}
                alt=""
              ></img>
            </div>
            {imgStatus === "PENDING" && (
              <div className="spinner-container upload-status">
                <Spinner />
              </div>
            )}
            {imgStatus === "UPLOADED" && (
              <div className="alert alert-success upload-status">
                Image has been succesfuly uploaded!
              </div>
            )}
            {imgStatus === "ERROR" && (
              <div className="alert alert-danger upload-status">
                Image upload failed!
              </div>
            )}
          </div>
          {imgStatus === "LOADED" && (
            <button
              onClick={handleImageUpload}
              className="btn btn-success mr-1"
              type="button"
            >
              Upload
            </button>
          )}
          <button
            onClick={cancelImage}
            className="btn btn-danger"
            type="button"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default FileLoader;

 