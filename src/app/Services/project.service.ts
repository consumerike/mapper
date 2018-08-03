import { Injectable } from '@angular/core';
import { IProject, Project } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

//purpose: manage user's saved projects/workspace
export class MyProjectService {

  constructor(private http: HttpClient) { }
  userHasSavedProjects: boolean = true;
  public projectsSavedByUser: any[];
  selections: any;
  

  CheckForSavedProjects() {
    return this.userHasSavedProjects;
  }

  getSavedPerviewProjects(): Observable<any> {
    if (this.CheckForSavedProjects()) {
      return  this.http.get('assets/sharepoint-users-projects.json')
      .map((mockData) => {
        this.projectsSavedByUser = mockData.savedProjects;
        return this.projectsSavedByUser;
        // return arrayOfProjects;
       });
      //  return this.projectsSavedByUser;
    }
    
  }

  addPerviewSelectedProjects(selections: any[]): void {
    this.projectsSavedByUser.push(selections);
  }

}
