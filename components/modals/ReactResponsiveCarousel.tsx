"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useState, useEffect } from "react";
import Skeleton from '@mui/material/Skeleton';

//@ts-ignore
const ReactResponsiveCarousel = ({ selectedCardDetails, carouselHeight }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllS3Urls = async () => {
      if (selectedCardDetails.pictures) {
        const picturesArray = selectedCardDetails.pictures.split(',');

        const fetchS3Url = async (pictureFilename) => {
          const key = `${pictureFilename}`;
          try {
            const response = await fetch(`/api/getS3PictureUrl?key=${key}`, {
              method: 'POST',
            });
            const data = await response.json();
            return data.s3Url;
          } catch (error) {
            console.error("Error:", error);
            return null;
          }
        };

        const s3Urls = await Promise.all(picturesArray.map(picture => fetchS3Url(picture)));
        
        const imagesArray = s3Urls.map((url, index) => ({
          label: `${index + 1}`,
          imgPath: url,
        }));

        setImages(imagesArray);
        setLoading(false);

      } else {
        const imagesArray = [
          {
            label: `placeholder`,
            imgPath: '/images/listing_placeholder.jpg',
          },
        ];
        setImages(imagesArray);
        setLoading(false);
      }
    };

    fetchAllS3Urls();
  }, [selectedCardDetails]);
  
  return (
    <div>
      {loading ? (
        <Skeleton sx={{ height: 200 }} animation="wave" variant="rectangular" />
      ) : (
        <Carousel
          swipeable={true}
          swipeScrollTolerance={1}
          width="100%"
          showArrows={true}
          showThumbs={false}
          dynamicHeight={false}
          emulateTouch={true}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <div
                style={{
                  position: 'absolute',
                  left: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#000',
                  userSelect: 'none',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClickHandler();
                }}
                title={label}
              >
                &#9664;
              </div>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <div
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#000',
                  userSelect: 'none',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClickHandler();
                }}
                title={label}
              >
                &#9654;
              </div>
            )
          }
        >
          {images.map(image => (
            <div key={image.label}>
              <img src={image.imgPath} style={{height: `${carouselHeight}px`}} alt={`Picture ${image.label}`} />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ReactResponsiveCarousel;
