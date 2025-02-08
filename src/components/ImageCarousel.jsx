import React, { useState } from "react";
import Slider from "react-slick";

const Carousel = ({ carouselContent, carouselSettings }) => {
  return (
    <div className="w-full max-w-3xl min-h-[100px] mt-2 mb-3 rounded-xl overflow-hidden bg-amber-400">
      <Slider {...carouselSettings}>
        {carouselContent.map((item, index) => (
          <div key={index} className="h-full w-fit cursor-pointer">
            <div className="w-full flex flex-col items-centerq">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
