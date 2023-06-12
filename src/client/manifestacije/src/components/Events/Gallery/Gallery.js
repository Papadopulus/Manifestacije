import React, { useState } from "react";

const Gallery = (galleryImages) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="galleryWrap">
      {galleryImages.length > 1 &&
        galleryImages &&
        galleryImages.map((slide, index) => {
          return (
            <div className="single" key={index}>
              kuravelica
              <img src={slide} alt="" />
            </div>
          );
        })}
      ale ale
    </div>
  );
};

export default Gallery;
