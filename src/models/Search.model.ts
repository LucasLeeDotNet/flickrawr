import IFlickrPhotoModel from "./IFlickrPhotoModel";

export default class SearchModel {
  public text: string  = "";
  public result: IFlickrPhotoModel[] = [];
}
