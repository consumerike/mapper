import { Injectable } from '@angular/core';
import { IProject, Project } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Observable, Subscription, from } from 'rxjs';
import { map, tap } from "rxjs/operators";
import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})

//purpose: manage user's saved projects/workspace
export class MyProjectService {

  constructor(private http: HttpClient, userService: UserService) { }
  apiRoot: string = "https://perviewqa.app.parallon.com/PWA"
  public userHasSavedProjects: boolean = true;
  public projectsSavedByUser: any[] = [];
  // selections: any;
 
  
  
  // CheckForSavedProjects() :boolean {
  //   return this.userHasSavedProjects;
  // }

  getSavedPerviewProjects(currentUserID: string): Observable<any[]> {
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
            
          }
          catch {
            console.log("didn't work, here's text:", Data);
           return []; 
          }
          
          // this.projectsSavedByUser = mockData["savedProjects"];
          // this.userHasSavedProjects = false;
          // return this.projectsSavedByUser;
          // return arrayOfProjects;
         })

      )
      
       
    }
    // console.log(this.CheckForSavedProjects());
    
    // console.log("projects saved by user before from array",this.projectsSavedByUser);
    
    // return from([this.projectsSavedByUser]);
    
  // addPerviewSelectedProjects(selections: any[]): void {
  //   this.projectsSavedByUser.next(selections);
  // }
  
  addPerviewSelectedProjectstoWorkspace(changeTokenHash:any, currentUser:any, selections:any): Observable<any> {
   
    console.log('running addPerviewSelectedProjecst to WorksPACE MANYNE');
    
    let url = `https://perview.app.parallon.com/PWA/_api/Web/Lists/GetByTitle('MapperUserState')/Items`
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
      "AccountID": ${currentUser},
      "ProjectUIDs":'${JSON.stringify(selections)}'
    }
    `   

    console.log('bigBody:', body);
    
  return this.http.post(url, body, options)
    .pipe(
      tap( data => {
        console.log('is this a great success:', data);
        
      return data;
      })
    );
  }

  deletePerviewProject(perviewProject: any, index: any) {
    console.log("this is the index: ", index);
    this.projectsSavedByUser.splice(index,1);
    console.log("does this remove an item from list?",this.projectsSavedByUser,);   
  }

}
