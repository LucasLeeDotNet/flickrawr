import React from "react";
import IFlickrPhotoModel from "../../models/IFlickrPhotoModel";

export interface IImagesDisplayModel {
  isAnimating: boolean;
  result: IFlickrPhotoModel[];
}

const ImagesDisplay = ( props: IImagesDisplayModel ) => {
  const {
    isAnimating,
    result,
  } = props;

  return (
    <div className="ImagesDisplay">
      {
        result.map( ( image: IFlickrPhotoModel, index: number ) => {
          return (
            <div
              key={image.id}
              className={index === result.length - 1 ? "ImagesDisplay-photoContainer is-zoomOut"
              :
              "ImagesDisplay-photoContainer"}
            >
              <img
                className={ isAnimating ? "ImagesDisplay-photo--isAnimating"
                :
                "ImagesDisplay-photo"}
                src={`https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`}
              />
            </div>
          );
        } )
      }
    </div>
  );
};

export default ImagesDisplay;
