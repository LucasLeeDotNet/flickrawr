// React
import React, { RefObject, useContext, useEffect } from "react";

// state
import { StoreContext } from "../../context/StoreContext";

// Models
import IFlickrPhotoModel from "../../models/IFlickrPhotoModel";

// Constant
import { PAGE_SIZE } from "../../constant";

declare var document: any;

export interface IImagesDisplayModel {
  sendRef: ( ref: RefObject<any> ) => void;
}

let anchorElement: any;

const ImagesDisplay = ( props: IImagesDisplayModel ) => {
  const {
    sendRef,
  } = props;

  const { state } = useContext( StoreContext );
  const { result } = state.search;


  /**
   * Scroll to last element that was in view after a new page is lazy loaded
   */
  useEffect( (): void => {
      if ( document.querySelector( ".App-content" ) && anchorElement ) {
      document.querySelector( ".App-content" ).scrollTo(0, anchorElement.offsetTop - (window.innerHeight - 250) );
      }
  }, [result]);


  /**
   * Send a reference of the last object in the scroll container
   * to be picked up to, indicate more images should be loaded
   */
  const setBottomRef = (element: any): void => {
    const bottomElement = element;
    sendRef( bottomElement );
  };

  const setAnchor = (element: any) => {
    anchorElement = element;

  };
  return (
    <span>
      <div className="ImagesDisplay">
        {
          result.map( ( image: IFlickrPhotoModel, index: number ) => {

            return (
              /**
               * Add a reference to the last image that is on one page from last to take the user
               * back to their location after lazy loading a new page
               */
              <div
                ref={result.length > PAGE_SIZE && index === result.length - PAGE_SIZE ? setAnchor : null}
                key={index}
                className={index === result.length - 1 ? "ImagesDisplay-photoContainer is-zoomOut"
                :
                "ImagesDisplay-photoContainer"}
              >
                <div className="ImageDisplay-title">{index + 1}. {image.title}</div>
                <img
                  className="ImagesDisplay-photo"
                  alt={image.title}
                  src={`https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`}
                />
              </div>
            );
          } )
        }
        <div ref={setBottomRef}/>
      </div>
    </span>
  );
};

export default ImagesDisplay;
