import IFlickrPhotoModel from "./IFlickrPhoto.model";

export default class SearchModel {
  /**
   * Specify the last page that was loaded
   */
  public page: number = 0;
  public text: string  = "";
  public result: IFlickrPhotoModel[] = [];
  public history: string[] = [];
}
