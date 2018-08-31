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
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerviewService {

  constructor(private http:HttpClient, private configService: ConfigService) {
    this.config = configService.config;
  }
  config:Config;
  authorizedPerviewProjects: any;


getAuthorizedPerviewProjects(): Observable<IProject[]> {
  console.log('getProjects method called')
  let headers = new HttpHeaders();
  headers = headers.set('Accept', 'application/json;odata=verbose').set('Content-Type', 'application/x-www-form-urlencoded')

  let adapterPath = "https://perviewqa.app.parallon.com/PWA/_layouts/15/PwaPSIWrapper2/PwaAdapter.aspx"
  

  const body = `method=PwaGetProjectsForEditCommand&viewguid=ca9a8094-5522-e811-8109-0050568f78ef `
  let options = {
      headers
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
          newProject.startDate = new Date(project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Start") && project[i]["CustomFields"] && project[i]["CustomFields"]
              .find(p => p.Name == "Start").Value).toDateString();
          newProject.finishDate = new Date(project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Finish") && project[i]["CustomFields"] && project[i]["CustomFields"]
              .find(p => p.Name == "Finish").Value).toDateString();
              //lets check for null first
          newProject.projActiveStatus = project[i]["CustomFields"].find(p => p.Name == "Project Active Status").Value

      
          projects.push(newProject);
      }

      return projects;
  }),
    //break
    map( (data) => { console.log("authorizedPerviewProjectData",data);
    this.authorizedPerviewProjects = data; return this.authorizedPerviewProjects; })
  )
}

  // ikegetAuthorizedPerviewProjects(): Observable<any> {
    // let setupObject = this.setupForGetPerviewProjects();
    // console.log('does this work that way?"',setupObject.options);
    
    // return this.http.post(setupObject.adapterPath, setupObject.body, setupObject.options)
    // .pipe(
    //   map( (data) => { console.log("authorizedPerviewProjectData",data);
    //    this.authorizedPerviewProjects = data; return this.authorizedPerviewProjects; })

    // );
    // .subscribe((data) => this.authorizedPerviewProjects = data);
  // }

  // setupForGetPerviewProjects(): any {
  //   let headers = new HttpHeaders();
  //   let adapterPath = "https://perviewqa.app.parallon.com/PWA/_layouts/15/PwaPSIWrapper2/PwaAdapter.aspx"//`${this.config.adapterUrl} `
  //   const BODY = `method=PwaGetProjectsForEditCommand&viewguid=ca9a8094-5522-e811-8109-0050568f78ef`//${this.config.projectPickerViewGuid}` 
  //   headers = headers.set('Accept', 'application/json;odata=verbose').set('Content-Type', 'application/x-www-form-urlencoded')
  //   let setupObject = {
  //     options: headers,
  //     adapterPath: adapterPath,
  //     body: BODY

  //   };
  //   return setupObject; 
  // }

  // xgetAuthorizedPerviewProjects(): Observable<any> {
  //   return this.http.get('./assets/mock-authorized-projects.txt', {responseType: 'json'})
  //   .pipe(map( (data) => { this.authorizedPerviewProjects = data; return this.authorizedPerviewProjects; })
  //   );
  // }
  
}

