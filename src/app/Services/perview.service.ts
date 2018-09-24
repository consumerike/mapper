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

  constructor(private http:HttpClient, private configService: ConfigService,private errorService: CustomErrorHandlerService) {
    this.config = configService.config;
  }
  config:Config;
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

  let adapterPath = "https://perviewqa.app.parallon.com/PWA/_layouts/15/PwaPSIWrapper2/PwaAdapter.aspx"
  

  const body = `method=PwaGetProjectsForEditCommand&viewguid=8c57b14c-6c13-e811-8116-0050568f3b8a`
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
          newProject.projectChargeBackCategory = project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Project Chargeback Category") && project[i]["CustomFields"] && project[i]["CustomFields"]
              .find(p => p.Name == "Project Chargeback Category").Value
          newProject.departments = project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Project Departments") && project[i]["CustomFields"] && project[i]["CustomFields"]
              .find(p => p.Name == "Project Departments").Value
        //   newProject.startDate = new Date(project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Start") && project[i]["CustomFields"] && project[i]["CustomFields"]
        //       .find(p => p.Name == "Start").Value).toDateString();
        //   newProject.finishDate = new Date(project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Finish") && project[i]["CustomFields"] && project[i]["CustomFields"]
        //       .find(p => p.Name == "Finish").Value).toDateString();
        //       //lets check for null first
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

