import FlickrPhotoModel from "./FlickrPhoto.model";

export default class SearchModel {
  /**
   * Specify the last page that was loaded
   */
  public page: number = 0;
  public text: string  = "";
  public result: FlickrPhotoModel[] = [];
  public history: string[] = [];
}
