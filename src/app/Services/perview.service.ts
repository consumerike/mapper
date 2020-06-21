import { Injectable } from '@angular/core';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter'

import { IProject, Project } from '../components/mapper-models';
import { Config } from "../components/mapper-models";
import { ConfigService } from "./config.service";
import { map, catchError, finalize } from 'rxjs/operators';
import { CustomErrorHandlerService } from './custom-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PerviewService {

  constructor(private http:HttpClient, private config: ConfigService,private errorService: CustomErrorHandlerService) {
    
  }
  
  authorizedPerviewProjects: IProject[];
  
  handleError(error) :void {
    this.errorService.addError(error);
    this.errorService.setErrorsPresentStatus(true);
  }

  handleErrorQuietly(error): void {
    console.warn(error);
  }

  getAuthorizedPerviewProjects(): Observable<IProject[]> {
  console.log('getProjects method called')
  let headers = new HttpHeaders();
  headers = headers.set('Accept', 'application/json;odata=verbose').set('Content-Type', 'application/x-www-form-urlencoded')

  let adapterPath = `https://perview.app.parallon.com/PWA/_layouts/15/PwaPSIWrapper2/PwaAdapter.aspx`
  
  const body = `method=PwaGetProjectsForEditCommand&viewguid=31b8a527-55e7-e811-811c-0050568f1156`
  let options = {
      headers,
      withCredentials: true
  };
  console.log("====================================Hitting Adapter get projects = ")
  return this.http.post(
      adapterPath, body, options

  ).pipe(
    map((project: any[]) => {
      var projects: IProject[] = [];
      for (var i = 0; i < project.length; i++) {
          var newProject = new Project(project[i]["projUid"], project[i]["projName"]);
          newProject.owner = project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Owner")
              && project[i]["CustomFields"].find(p => p.Name == "Owner").Value;
          debugger;
          newProject.businessOwner = project[i]["CustomFields"].find(p => p.Name == "Business Owner").Value
          projects.push(newProject);
      }

      return projects;
  }),

    map( (data) => { console.log("authorizedPerviewProjectData",data);
    this.authorizedPerviewProjects = data; 
    return this.authorizedPerviewProjects; 
    }),
    catchError((err) => {
        console.log('in observable catchError()',err);
        let errorMessage = new Error("Error: Did not successfully get authorized perview projects for display ")
        this.handleError(errorMessage);
        console.log('why are you not firing??');
        
        throw errorMessage;
      })
   );
 }
 
}

