import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import{map, mergeMap, catchError, filter} from 'rxjs/operators'

import  { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  static currentUser: any;
  constructor(private http: HttpClient) { }

  apiRoot: string = "https://perviewqa.app.parallon.com/PWA"
  public currentUser: string;

  getCurrentUserID(): Observable<string> {
    let url = `${this.apiRoot}/_api/SP.UserProfiles.PeopleManager/GetMyProperties/AccountName`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose');
    let options = {
      headers,
      withCredentials: true,
    };

    return this.http.get(url, options)
     .pipe(
       map(data => {         
        this.currentUser = data["d"].AccountName.toUpperCase();
        return this.currentUser
        // return data["d"].AccountName.toUpperCase();
        }) 
      );    
  }
  
  getChangePermissionToken(): Observable<string> {
    console.log('made it to changetoken function in service');
    try {
    let url = `https://perviewqa.app.parallon.com/PWA/_api/contextinfo`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
      .set('Content-Type', 'application/x-www-form-urlencoded');
     
    let options = {
      headers,
     }  
    
      return this.http.post(url, {}, options)
      .pipe(
        map( data => {
          console.log('is this running here:', data["d"].GetContextWebInformation.FormDigestValue);
          
         return data["d"].GetContextWebInformation.FormDigestValue;
        })
      );
     }
    catch {
      console.log('not working...');
      
    }
  }
}
