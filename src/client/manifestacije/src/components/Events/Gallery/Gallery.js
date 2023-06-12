import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import classes from "./Gallery.module.css";
const Gallery = (props) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageURL, setSelectedImageURL] = useState(null);

  const shouldLog = useRef(true);
  const handleOpenModal = (index) => {
    setSlideNumber(index);
    setOpenModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Previous Image
  const prevSlide = () => {
    slideNumber === 0
      ? setSlideNumber(images.length - 1)
      : setSlideNumber(slideNumber - 1);
  };

  // Next Image
  const nextSlide = () => {
    slideNumber + 1 === images.length
      ? setSlideNumber(0)
      : setSlideNumber(slideNumber + 1);
  };

  const loadImages = async (imageUrls) => {
    try {
      const images = await Promise.all(
        imageUrls.map(async (imageUrl) => {
          const imageResponse = await axios.get(
            `https://localhost:7085/Image/${imageUrl}`,
            { responseType: "blob" }
          );
          const reader = new FileReader();
          reader.readAsDataURL(imageResponse.data);
          return new Promise((resolve, reject) => {
            reader.onloadend = function () {
              resolve(reader.result);
            };
            reader.onerror = reject;
          });
        })
      );
      setImages(images);
    } catch (error) {
      console.error("Error retrieving the images:", error);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setSelectedImageURL(imageUrl);
      // console.log(imageUrl);
    }
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      if (selectedImageURL) {
        URL.revokeObjectURL(selectedImageURL);
      }
    };
  }, [selectedImageURL]);
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      loadImages(props.imgUrls);
    }
    return () => {
      shouldLog.current = false;
    };
  }, []);
  return (
    <>
      {openModal && (
        <div className={classes.sliderWrap}>
          <div onClick={handleCloseModal} className={classes.btnClose}>
            <i className="fa-solid fa-circle-xmark fa-lg"></i>
          </div>
          <div onClick={prevSlide} className={classes.btnPrev}>
            <i className="fa-solid fa-circle-chevron-left fa-lg"></i>
          </div>
          <div onClick={nextSlide} className={classes.btnNext}>
            <i className="fas fa-chevron-circle-right fa-lg"></i>
          </div>

          <div className={classes.fullScreenImage}>
            {typeof images[slideNumber] === "string" ? (
              <img src={images[slideNumber]} alt="" />
            ) : (
              <img src={URL.createObjectURL(images[slideNumber])} alt="" />
            )}
          </div>
        </div>
      )}
      <div className={classes.galleryWrap}>
        {images &&
          images.map((image, index) => (
            <div
              className={classes.single}
              key={index}
              onClick={() => handleOpenModal(index)}
            >
              {typeof image === "string" ? (
                <img src={image} alt={`Image ${index + 1}`} />
              ) : (
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Image ${index + 1}`}
                />
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default Gallery;
