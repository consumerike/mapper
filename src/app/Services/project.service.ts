import { Injectable } from '@angular/core';
import { IProject, Project } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Observable, Subscription, from } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

//purpose: manage user's saved projects/workspace
export class MyProjectService {

  constructor(private http: HttpClient) { }
  public userHasSavedProjects: boolean = true;
  public projectsSavedByUser: any[] = [];
  selections: any;
  projectsSavedByUser$: Observable<any>
  
  
  CheckForSavedProjects() {
    return this.userHasSavedProjects;
  }

  getSavedPerviewProjects(): Observable<any[]> {
  
    if (this.CheckForSavedProjects()) {
      return  this.http.get('./assets/sharepoint-users-projects.txt', {responseType: 'json'})
      .pipe(
        map((mockData) => {    
          try{
            console.log("is this coming through", mockData);
           
            this.projectsSavedByUser = mockData["savedProjects"];
            console.log("is this coming through parsed", mockData);
            this.userHasSavedProjects = false;
            return this.projectsSavedByUser;
          } 
          catch {
            console.log("didn't work, here's text:", mockData);
            
          }
          
          // this.projectsSavedByUser = mockData["savedProjects"];
          // this.userHasSavedProjects = false;
          // return this.projectsSavedByUser;
          // return arrayOfProjects;
         })

      )
      
       
    }
    console.log(this.CheckForSavedProjects());
    
    console.log("projects saved by user before from array",this.projectsSavedByUser);
    
    return from([this.projectsSavedByUser]);
    
  }

  // addPerviewSelectedProjects(selections: any[]): void {
  //   this.projectsSavedByUser.next(selections);
  // }

  deletePerviewProject(perviewProject: any, index: any) {
    console.log("this is the index: ", index);
    this.projectsSavedByUser.splice(index,1);
    console.log("does this remove an item from list?",this.projectsSavedByUser,);   
  }

}
