import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import{map, mergeMap, catchError, filter} from 'rxjs/operators'

import  { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  apiRoot: string = "https://perviewqa.app.parallon.com/PWA"
  public currentID: any = 'Stan Lee';
  public currentUser: string;

  getCurrentUserID(): Observable<any> {
    let url = `${this.apiRoot}/_api/SP.UserProfiles.PeopleManager/GetMyProperties/AccountName`
    let headers = new HttpHeaders();
    headers =  headers = headers.set('accept', 'application/json;odata=verbose');
    let options = {
      headers,
      withCredentials: true,
    };

    return this.http.get(url, options)
     .pipe(map(AccountName => AccountName.toString() ));    

  }
  



}
