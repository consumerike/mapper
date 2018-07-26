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
  currentID: any = 'Stan Lee';
  public currentUser: string;

  getCurrentUserID(): Observable<any> {
    let url = `${this.apiRoot}/_api/SP.UserProfiles.PeopleManager/GetMyProperties/AccountName`
    let headers = new HttpHeaders();
    headers =  headers = headers.set('accept', 'application/json;odata=verbose');
    let options = {
      headers,
      withCredentials: true,
    };
    // return this.http.get(url, options).subscribe( res => console.log(res.text()))
    return this.http.get(url, options)
     .pipe(map(AccountName => AccountName.toString() ));
      

    //   .flatMap((spData: Response) => {
        
    //     var accountName = spData["d"].AccountName
    //     url = `${this.apiRoot}/_api/ProjectData/Resources`
    //     let filter = "?$filter=ResourceNTAccount eq '" + encodeURIComponent('i:0#.w|' + accountName) + "'"
    //     return this.http.get(url + filter, options)
    //         .map((data: Response) => {
    //             return data["d"].results[0].ResourceId.toUpperCase();
    //         })
    //   })
    // }
    
    

  }
  



}
"https://perviewqa.app.parallon.com/PWA"
