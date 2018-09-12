import { Injectable } from '@angular/core';
import { IProject, Project } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Observable, Subscription, from } from 'rxjs';
import { map, tap, catchError, switchMap } from "rxjs/operators";
import { UserService } from './user-service.service';
import { UtilityService } from "./utility.service";
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';


@Injectable({
  providedIn: 'root'
})

//purpose: manage user's saved projects/workspace
export class MyProjectService {

  constructor(private http: HttpClient, private userService: UserService, private utilityService: UtilityService) { }
  apiRoot: string = "https://perviewqa.app.parallon.com/PWA"
  public userHasSavedProjects: boolean = true;
  public projectsSavedByUser: any[] = [];
  // selections: any;
 
  
  
  // CheckForSavedProjects() :boolean {
  //   return this.userHasSavedProjects;
  // }

  getSavedPerviewProjects(currentUserID: string): Observable<any> {
  console.log("first look, first kill", currentUserID);  
   let url = `https://perviewqa.app.parallon.com/PWA/_api/web/lists/GetByTitle('MapperUserState')/Items?$filter=AccountID%20eq%20%27${currentUserID}%27&$select=ProjectUIDs` 
   let headers = new HttpHeaders();
   headers = headers.set('accept', 'application/json;odata=verbose');
   let options = {
     headers,
     withCredentials: true,
   };
   
      return this.http.get(url,options)
      .pipe(
        map((Data) => {    
          console.log("do i have the currentID at least?", currentUserID);
          
          console.log("right here do I have data or not?", Data);
          try {
            if (Data["d"].results[0].ProjectUIDs.length > 0) {
              this.projectsSavedByUser =  JSON.parse(Data["d"].results[0].ProjectUIDs);
              console.log("is this coming through correctly mate?", Data["d"].results[0].ProjectUIDs, "to json vers",this.projectsSavedByUser);
              return this.projectsSavedByUser;
            }
            else {
              this.handleNoUser().subscribe();
            }
          }
          catch {
            console.log("didn't work, here's text:", Data);
            //need more cowbell here:
           return []; 
          }
          
          // this.projectsSavedByUser = mockData["savedProjects"];
          // this.userHasSavedProjects = false;
          // return this.projectsSavedByUser;
          // return arrayOfProjects;
         }),
         catchError(err => {
          console.log('this user needs to be saved, clearly there are no projects',err);
          this.handleNoUser();
          return err;
          //THIS CODE BELOW IS THE handleNoUser function on line 70...
          // return this.userService.getChangePermissionToken()
          // .pipe(
          //   switchMap((data) =>{
          //     console.log("data is changetoken", data);
          //     let changeTokenHash = data;
          //     return this.addUsertoSavedList(changeTokenHash,this.userService.currentUser,{});
          //   })
          // );
        })  
      );
    }
    // console.log(this.CheckForSavedProjects());
  handleNoUser(): Observable<any> {
    return this.userService.getChangePermissionToken()
    .pipe(
      switchMap((data) =>{
        console.log("data is changetoken", data);
        let changeTokenHash = data;
        return this.addUsertoSavedList(changeTokenHash,this.userService.currentUser,{});
      })
    );
  }
    // console.log("projects saved by user before from array",this.projectsSavedByUser);
    
    // return from([this.projectsSavedByUser]);
    
  // addPerviewSelectedProjects(selections: any[]): void {
  //   this.projectsSavedByUser.next(selections);
  // }
  
  addUsertoSavedList(changeTokenHash:any, currentUser:any, selections:any): Observable<any> {
    
    console.log('running addUsertoSavedList to WorksPACE MANYNE');
    console.log(changeTokenHash, "did we get the hashb?");
    
    let url = `https://perviewqa.app.parallon.com/PWA/_api/Web/Lists/GetByTitle('MapperUserState')/Items`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
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
      "AccountID": "${currentUser}",
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

  addPerviewSelectedProjectstoWorkspace(currentUser:any,changeTokenHash:any, id: any, selections) {
    let modUser = this.utilityService.modifyCurrentUserVariable(currentUser)
    modUser = modUser.toLowerCase();
    console.log('currentUser in addPerview Project in @projectService::', currentUser);
    console.log('hash in addPervierwProject in @projectService::', changeTokenHash);
    console.log('id / item number in addPervierwProject in @projectService::',id);
    console.log('selections in addPerviewProject in @projectService::', selections);
    console.log('am i going to be adding things to the saved list?::', this.projectsSavedByUser);
    
    console.log('selections in addPervierwProject in @projectService::', selections);
 
    console.log("here we have the modUser should be lc:::",modUser);
    let url = `https://perviewqa.app.parallon.com/PWA/_api/${id}`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
      .set('X-HTTP-Method','MERGE')
      .set('Content-Type','application/json;odata=verbose')
      .set('IF-MATCH','*')
      .set('X-RequestDigest',changeTokenHash)
    let options = {
      headers,
      // withCredentials: true
     }
    let body = `{
      "__metadata": {
        "type": "SP.Data.MapperUserStateListItem"
      },
      "AccountID": "${modUser}",
      "ProjectUIDs":'${JSON.stringify(selections)}'
    }
    `   

    console.log('big body add:', body);
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
      console.log('that is not working in addPerviewProject in project.service');
    }

  }

  deletePerviewProject(currentUser:any,changeTokenHash:any, id: any, selections) {
    let modUser = this.utilityService.modifyCurrentUserVariable(currentUser)
    modUser = modUser.toLowerCase();
    console.log('currentUser in addPerview Project in @projectService::', currentUser);
    console.log('hash in addPervierwProject in @projectService::', changeTokenHash);
    console.log('id / item number in addPervierwProject in @projectService::',id);
    console.log('selections in addPerviewProject in @projectService::', selections);
    console.log('am i going to be adding things to the saved list?::', this.projectsSavedByUser);
    
    console.log('selections in addPervierwProject in @projectService::', selections);
 
    console.log("here we have the modUser should be lc:::",modUser);
    let url = `https://perviewqa.app.parallon.com/PWA/_api/${id}`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
      .set('X-HTTP-Method','MERGE')
      .set('Content-Type','application/json;odata=verbose')
      .set('IF-MATCH','*')
      .set('X-RequestDigest',changeTokenHash)
    let options = {
      headers,
      // withCredentials: true
     }
    let body = `{
      "__metadata": {
        "type": "SP.Data.MapperUserStateListItem"
      },
      "AccountID": "${modUser}",
      "ProjectUIDs":'${JSON.stringify(selections)}'
    }
    `   

    console.log('big body delete:', body);
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
      console.log('that is not working in addPerviewProject in project.service');
    }

  }




  //JUST IN CASE KEEPING :::::::::::
  //   console.log('selections in deletePervierwProject in @projectService:', selections);
  //   console.log('hash in deletePervierwProject in @projectService:', changeTokenHash);
  //   console.log('id in deletePervierwProject in @projectService:', changeTokenHash);
  //   console.log('selections in deletePervierwProject in @projectService:', changeTokenHash);
    
  //   let url = `https://perviewqa.app.parallon.com/PWA/_api/${id}`
  //   let headers = new HttpHeaders();
  //   headers = headers.set('accept', 'application/json;odata=verbose')
  //     .set('X-HTTP-Method','MERGE')
  //     .set('Content-Type','application/json;odata=verbose')
  //     .set('IF-MATCH','*')
  //     .set('X-RequestDigest',changeTokenHash)
  //   let options = {
  //     headers,
  //    }
  //   let body = `{
  //     "__metadata": {
  //       "type": "SP.Data.MapperUserStateListItem"
  //     },
  //     "AccountID": "${currentUser}",
  //     "ProjectUIDs":"${JSON.stringify(selections)}"
  //   }
  //   `   

  //   console.log('soft body:', body);
  //   try {
  //     return this.http.post(url, body, options)
  //     .pipe(
  //       tap( data => {
  //         console.log('is this a great success:', data);
          
  //       return data;
  //       })
  //     );
  //   }
  //   catch {
  //     console.log('that is not working in deletePerviewProject in project.service');
  //   }
  
  // }
  
}//end of file
