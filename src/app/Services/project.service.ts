import { Injectable } from '@angular/core';
import { IProject, Project } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//purpose: manage user's saved projects/workspace
export class MyProjectService {

  constructor(private http: HttpClient) { }
  userHasSavedProjects: boolean;
  projectsSavedByUser: any;
  selections: any;
  public myProjects: any [];

  CheckForSavedProjects() {
    return this.userHasSavedProjects;
  }

  getSavedPerviewProjects(): any {
    if (this.CheckForSavedProjects()) {
      return this.http.get('./sharepoint-users-projects.json')
      .subscribe( (data) => {console.log(data);this.myProjects = data["perviewProjects"]});
    
    }
    console.log('no projects');
  }

  addPerviewSelectedProjects(selections: any[]): void {
    this.myProjects.push(selections);
  }

}
