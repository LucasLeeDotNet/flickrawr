// React
import React, { MouseEvent, RefObject, useContext, useEffect, useState } from "react";

// State
import { StoreContext } from "../../context/StoreContext";

// Models
import FlickrPhotoModel from "../../models/FlickrPhoto.model";

// Constant
import { IMAGE_ROW_HEIGHT_OFFSET, PAGE_SIZE } from "../../constant";
import { typeOptions } from "../../context/reducers";

declare var document: any;

export interface IImagesDisplayModel {
  sendLastImageRef: ( ref: HTMLDivElement ) => void;
}

const ImagesDisplay = ( props: IImagesDisplayModel ) => {
  const {
    sendLastImageRef,
  } = props;

  const { dispatch, state } = useContext( StoreContext );
  const { result } = state.search;
  const total: number = state.search.total;

  // Local State
  const [ searchElement, setSearchElement ] = useState();


  /**
   * Scroll to last element that was in view after a new page is lazy loaded
   */
  useEffect( (): void => {
    if ( document.querySelector( ".App-content" ) && searchElement ) {
      document.querySelector( ".App-content" )
        .scrollTo(0, searchElement.offsetTop - (window.innerHeight - IMAGE_ROW_HEIGHT_OFFSET) );
    }
  }, [searchElement]);


  /**
   * Dispatch a state change for previewing a specific image
   *
   * @param {MouseEvent<HTMLDivElement>} event Mouse click event (unused)
   * @param {number} index index of the selected image
   *
   * @returns void
   */
  const handleImageClick = (
    event: MouseEvent<HTMLDivElement>,
    index: number): void => {
    dispatch(
      {
        selectedIndex: index,
        type: typeOptions.SHOW_DRAWER,
      },
    );
  };


  /**
   * Call the setter method for the search Element after retrieving from a ref callback
   *
   * @param {HTMLDivElement} element Reference to the html element
   * @returns void
   */
  const handleLastImageReference = ( element: HTMLDivElement ): void => {
    if ( element ) {
      setSearchElement( element );
    }
  };


  /**
   * Send a reference of the last object in the scroll container
   * to be picked up by the App compomnent, indicate more images should be loaded
   *
   * @param {HTMLDivElement} element Reference to the html element
   * @returns void
   */
  const setLastImageRef = (element: HTMLDivElement ): void => {
    const bottomElement = element;
    sendLastImageRef( bottomElement );
  };


  return (
    <span>
      <div className="ImagesDisplay">
        {
          result.map( ( image: FlickrPhotoModel, index: number ) => {
            return (
              /**
               * Add a reference to the last image that to take the user
               * back to their location after lazy loading a new page
               */
              <div
                // tslint:disable-next-line:jsx-no-lambda
                onClick={( event: React.MouseEvent<HTMLDivElement> ) => handleImageClick(event, index)}
                ref={result.length > PAGE_SIZE && index === result.length - PAGE_SIZE ? handleLastImageReference : null}
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
        {
          /**
           * Create a reference to the last element, when this is visible load a new page for the same search
           */
        }
        {
          result.length >= PAGE_SIZE && result.length < total ?
          <div className="ImageDisplay-lastImage" ref={setLastImageRef}> Load More Images...</div>
          :
          undefined
        }
      </div>
    </span>
  );
};

export default ImagesDisplay;
