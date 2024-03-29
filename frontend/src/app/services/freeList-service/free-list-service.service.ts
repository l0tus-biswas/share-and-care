import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

import { FreeListing } from 'src/app/interface/freeListing';

@Injectable({
  providedIn: 'root'
})
export class FreeListServiceService {
  // private freeList_api_url: string = 'http://localhost:9000/user/listing';
  private freeList_api_url: string = 'https://share-and-care-mbr4veogx-l0tus-biswas.vercel.app/user/listing';
 
  constructor(private http: HttpClient) { }

  getAllFreeListing(): Observable<FreeListing[]> {
    return this.http.get<FreeListing[]>(this.freeList_api_url + "/get/freeListing/").pipe(catchError(this.errorHandler));
  }

  getAllFreeListingNearBy(lng: number, lat: number): Observable<FreeListing[]> {
    return this.http.get<FreeListing[]>(this.freeList_api_url + "/get/listings/nearBy/"  + lng + "/"+lat).pipe(catchError(this.errorHandler));
  }

  getFreeListingDataByUserToken(userToken:string ): Observable<FreeListing[]> {
    return this.http.get<FreeListing[]>(this.freeList_api_url + "/get/freeListing/userToken/" +userToken).pipe(catchError(this.errorHandler));
  }

  getFreeListingDataById(listId: string, userToken:string ): Observable<FreeListing[]> {
    console.log(listId, userToken);
    return this.http.get<FreeListing[]>(this.freeList_api_url + "/get/freeListing/listingId/" + listId + "/"+userToken).pipe(catchError(this.errorHandler));
  }
  addFreeListingData(userToken:string, listingPicture:any[], title:string, category:string, description:string, pickUpTime:string,listFor:number, lng: number, lat: number): Observable<boolean> {
    return this.http.post<boolean>(this.freeList_api_url + "/add/freeListing/", {
      userToken:userToken,
      picture:listingPicture,   
      title:title,
      category:category,
      description:description,
      pickUpTime:pickUpTime,
      listFor:listFor,
      lng:lng,
      lat:lat
    
    }).pipe(catchError(this.errorHandler));
  }

  updateUserProfilePicture(listId: string, userToken:string, listingPicture:any[]): Observable<boolean> {
    return this.http.patch<boolean>(this.freeList_api_url + "/update/freeListingPicture/" + listId  + "/"+userToken, {
      picture: listingPicture
    }).pipe(catchError(this.errorHandler));
  }

  updateAddLikeFreeListing(listId: string, userToken:string): Observable<boolean> {
    return this.http.patch<boolean>(this.freeList_api_url + "/update/addLikeFreeListing/" + listId ,{
      userToken:userToken, 
    }).pipe(catchError(this.errorHandler));
  }

  updateDisableStatusFreeListing(listId: string, userToken:string, disableStatus:boolean): Observable<boolean> {
    return this.http.patch<boolean>(this.freeList_api_url + "/update/disableStatusFreeListing/" + listId + "/"+userToken,{
      disableStatus:disableStatus, 
    }).pipe(catchError(this.errorHandler));
  }
  updateRemoveLikeFreeListing(listId: string, userToken:string): Observable<boolean> {
    return this.http.patch<boolean>(this.freeList_api_url + "/update/removeLikeFreeListing/" + listId ,{
      userToken:userToken, 
    }).pipe(catchError(this.errorHandler));
  }

  updateFreeListingData(listId:string, userToken:string, listingPicture:any[], title:string, category:string, description:string, pickUpTime:string,listFor:number, lng: number, lat: number): Observable<boolean> {
    return this.http.put<boolean>(this.freeList_api_url + "/update/freeListing/" + listId + "/" + userToken, {
      picture:listingPicture,   
      title:title,
      category:category,
      description:description,
      pickUpTime:pickUpTime,
      listFor:listFor,
      lng:lng,
      lat:lat
    
    }).pipe(catchError(this.errorHandler));
  }

  updateOnHoldStatus(listId: string, onHoldStatus:boolean): Observable<boolean> {
    return this.http.patch<boolean>(this.freeList_api_url + "/update/onHoldListing/" + listId ,{
      onHold:onHoldStatus
    }).pipe(catchError(this.errorHandler));
  }

  deleteFreeListing(listId:string, userToken:string):Observable<boolean>{
    return this.http.delete<boolean>(this.freeList_api_url + "/delete/freeListing/" + listId + "/" + userToken).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(error.message || "Server Error");
  }
}
