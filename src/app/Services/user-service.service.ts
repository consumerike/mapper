import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import{map, mergeMap, catchError, filter, tap, switchMap, retryWhen, delayWhen, scan} from 'rxjs/operators'

import  { Observable, throwError, timer } from 'rxjs';
import { UtilityService } from './utility.service';
import { CustomErrorHandlerService } from './custom-error-handler.service';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private utilityService: UtilityService, private errorService: CustomErrorHandlerService) { }
  
  apiRoot: string = "https://perviewqa.app.parallon.com/PWA"
  public currentUser: string;

  handleError(error) :void {
    this.errorService.addError(error);
    this.errorService.setErrorsPresentStatus(true);
  }

  handleErrorQuietly(error): void {
    console.warn(error);
    
  }

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
       
        }),
        retryWhen((errors$: Observable<any>) => {
          return errors$.pipe(
            scan((count: number, currentError:string) => {
              if (count > 3) {
                throw currentError;
              }
              else{ 
                return count += 1;
              }
            }, 0)
           
          );
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
        }),
        catchError(err => {
          let errorMessage = new Error("Error: Could not successfully add or delete PerView project")
          this.handleError(errorMessage);
         throw err;
         })
      );
     }
    catch {
      console.log('not working...');
    }
  }

  checkForSavedUser(currentUser: string): Observable<any> {
    console.log('running CHECK FOR SAVED USER....');
    
    let url = `https://perviewqa.app.parallon.com/PWA/_api/web/lists/GetByTitle('MapperUserState')/Items?&$select=AccountID`
   
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json;odata=verbose')
      .set('Content-Type','Application/json;odata=verbose');
    let options = {
      headers,
      // withCredentials: true
    };
   
    try {
      return this.http.get(url, options)
      .pipe(
        map(data => {         
        let userObjects = data["d"].results;
        let listOfUsers = userObjects.map((userObject) => {return userObject.AccountID});
        console.log("converted to a list of users:",listOfUsers);
        return listOfUsers;
         }),
         tap((data)=>{
           let listOfUsers = data;
           console.log('data inside tap...then current user...', listOfUsers, currentUser);
           
           if(listOfUsers.includes(currentUser.toLowerCase())){
            console.log('user is already added...');
           }
           else {
             console.log('inside else about to handle a no user incident...');
             
             this.handleNoUser().subscribe();
           }
         }),
         catchError(err => {
          let errorMessage = new Error("Error: Did not successfully find checkForSavedUser() in userservice in database")
          this.handleErrorQuietly(errorMessage);
          throw errorMessage;
            // return throwError('cmon man' + err.toString());
           // return this.addPerviewProjectForMapping(project);
         })   
       );    
    }
    catch (err) {
      console.log('this is what is going on', err);
      
    }
  
  }

  handleNoUser(): Observable<any> {  
    return this.getChangePermissionToken()
    .pipe(
      switchMap((data) =>{
        console.log("data is changetoken", data);
        let changeTokenHash = data;
        return this.addUsertoSavedList(changeTokenHash,this.currentUser,[]);
      })
    );
  }

  addUsertoSavedList(changeTokenHash:any, currentUser:any, selections:any): Observable<any> {
    let modUser = this.utilityService.modifyCurrentUserVariable(currentUser)
    modUser = modUser.toLowerCase();
    console.log('running addUsertoSavedList to WorksPACE MANYNE');
    console.log(changeTokenHash, "did we get the hashb?");
    
    let url = `https://perviewqa.app.parallon.com/PWA/_api/Web/Lists/GetByTitle('MapperUserState')/Items`
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json;odata=verbose')
      .set('Content-Type','application/json;odata=verbose')
      .set('IF-MATCH','*')
      .set('X-RequestDigest',changeTokenHash)
    let options = {
      headers,
     }
    let body = `{
      "__metadata": {
        "type": "SP.Data.MapperUserStateListItem"
      },
      "AccountID": "${modUser}",
      "ProjectUIDs":"${JSON.stringify(selections)}"
    }
    `   

    console.log('bigBody:', body);
    try {
      return this.http.post(url, body, options)
      .pipe(
        tap( data => {
          console.log('is this a great success:', data);
          
        return data;
        })
      );
    }
    catch {
      console.log('that is not working in addPerviewSelectedProjectstoWorkspace in project.service');
    }
  
  }


  
}
