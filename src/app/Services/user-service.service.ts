import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import{map, mergeMap, catchError, filter, tap} from 'rxjs/operators'

import  { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  static currentUser: any;
  constructor(private http: HttpClient) { }

  apiRoot: string = "http://perviewqa.app.parallon.com/PWA"
  public currentUser: string;

  getCurrentUserID(): Observable<any> {
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
       
        }),
        catchError(err => {
          console.log('this user is not found', err);
          return err;
          // return this.addPerviewProjectForMapping(project);
        })   
      );    
  }
  
  getChangePermissionToken(): Observable<string> {
    console.log('made it to changetoken function in service');
    try {
    let url = `http://perviewqa.app.parallon.com/PWA/_api/contextinfo`
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

  getItemByUserId(): Observable<any> {
    console.log('made it to getItemByUserId function in service and user is:', this.currentUser);
    try {
    let url = `https://perviewqa.app.parallon.com/PWA/_api/web/lists/GetByTitle('MapperUserState')/Items?$filter=AccountID%20eq%20%27${this.currentUser}%27&$select=AccountID`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
      .set('Content-Type', 'application/x-www-form-urlencoded');
     
    let options = {
      headers,
     }  
    
      return this.http.get(url,options)
      .pipe(
        map( data => {
          console.log('just return something:', data);
          
          console.log('data is what;', data["d"]);
          
          console.log('is this running here:', data["d"].results[0]);
          console.log('is this running here: as metadata:', data["d"].results[0].__metadata.id);
          
         return data["d"].results[0].__metadata.id;
        })
      );
     }
    catch {
      console.log('not working...');
      
    }
  }
  
}
