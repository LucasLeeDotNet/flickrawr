/**
 * Model for the photo images returned from flickr
 * Noe the constructor is only used for creaing test data
 */
export default class FlickrPhotoModel {
  public farm: number = -1;
  public id: string = "";
  public isfamily: number = -1;
  public isfriend: number = -1;
  public ispublic: string = "";
  public owner: string = "";
  public secret: string = "";
  public server: string = "";
  public title: string = "";
}
