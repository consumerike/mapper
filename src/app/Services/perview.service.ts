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

@Injectable({
  providedIn: 'root'
})
export class PerviewService {

  constructor(private http:HttpClient, private configService: ConfigService) {
    this.config = configService.config;
  }
  config:Config;
  authorizedPerviewProjects: any;

//   JohnsgetAuthorizedPerviewProjects(): any {
//     let headers = new HttpHeaders();
//     headers = headers.set('Accept', 'application/json;odata=verbose').set('Content-Type', 'application/x-www-form-urlencoded')

//     let adapterPath = `${this.config.adapterUrl}`
//     const body = `method=PwaGetProjectsForEditCommand&viewguid=${this.config.projectPickerViewGuid}`
//     let options = {
//         headers
//     };
    
//     return this.http.post(adapterPath, body, options)
//     .map((project: Object[]) => {
//       var projects: IProject[] = [];
//       for (var i = 0; i < project.length; i++) {
//           var newProject = new Project(project[i]["projUid"], project[i]["projName"]);
//           newProject.owner = project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Owner")
//               && project[i]["CustomFields"].find(p => p.Name == "Owner").Value;
//           newProject.projectChargeBackCategory = project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Project Chargeback Category") && project[i]["CustomFields"] && project[i]["CustomFields"]
//               .find(p => p.Name == "Project Chargeback Category").Value
//           newProject.departments = project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Project Departments") && project[i]["CustomFields"] && project[i]["CustomFields"]
//               .find(p => p.Name == "Project Departments").Value
//           newProject.startDate = new Date(project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Start") && project[i]["CustomFields"] && project[i]["CustomFields"]
//               .find(p => p.Name == "Start").Value).toDateString();
//           newProject.finishDate = new Date(project[i]["CustomFields"] && project[i]["CustomFields"].find(p => p.Name == "Finish") && project[i]["CustomFields"] && project[i]["CustomFields"]
//               .find(p => p.Name == "Finish").Value).toDateString();
//               //lets check for null first
//           newProject.projActiveStatus = project[i]["CustomFields"].find(p => p.Name == "Project Active Status").Value

      
//           projects.push(newProject);
//       }

//       return projects;
//   })
//       .catch(console.log('you have an error!'));
// }
    
  REALgetAuthorizedPerviewProjects(): any {
    let setupObject = this.REALsetupForGetPerviewProjects();
    return this.http.post(setupObject.adapterPath, setupObject.body, setupObject.options)
    .subscribe((data) => this.authorizedPerviewProjects = data);
  }

  REALsetupForGetPerviewProjects(): any {
    let headers = new HttpHeaders();
    let adapterPath = "https://perviewqa.app.parallon.com/PWA/_layouts/15/PwaPSIWrapper2/PwaAdapter.aspx"//`${this.config.adapterUrl} `
    const BODY = `method=PwaGetProjectsForEditCommand&viewguid=8c57b14c-6c13-e811-8116-0050568f3b8a`//${this.config.projectPickerViewGuid}` 
    headers = headers.set('Accept', 'application/json;odata=verbose').set('Content-Type', 'application/x-www-form-urlencoded')
    let setupObject = {
      options: headers,
      adapterPath: adapterPath,
      body: BODY

    };
    return setupObject; 
  }

  getAuthorizedPerviewProjects(): any {
    let arrayOfProjects =  this.http.get('assets/mock-authorized-projects.json')
    .subscribe((mockData) => {
      let arrayOfProjects = mockData.authorizedProjects;
      console.log("array of authorized Projects:", arrayOfProjects);
      this.authorizedPerviewProjects = arrayOfProjects
      return arrayOfProjects;
     });
     return this.authorizedPerviewProjects;
  }
  

}
