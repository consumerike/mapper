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
export class PlanviewService {


  constructor(private http:HttpClient, private configService: ConfigService) {
    this.config = configService.config;
  }
  config:Config;
  authorizedPlanviewProjects: any;

  getAuthorizedPlanviewProjects(): any {
     this.http.get("./planview-mock.json")
     .subscribe((data) => {
      console.log("this is the planViewProjects data:", data); 
      this.authorizedPlanviewProjects = data;
      });
  }

  xgetAuthorizedPlanviewProjects(): any {
    let setupObject = this.setupForGetPlanviewProjects();
    return this.http.post(setupObject.adapterPath, setupObject.body, setupObject.options)
    .subscribe((data) => this.authorizedPlanviewProjects = data);
  }

  setupForGetPlanviewProjects(): any {
    let headers = new HttpHeaders();
    let adapterPath = `${this.config.adapterUrl} `
    const BODY = `method=PwaGetProjectsForEditCommand&viewguid=${this.config.projectPickerViewGuid}` 
    headers = headers.set('Accept', 'application/json;odata=verbose').set('Content-Type', 'application/x-www-form-urlencoded')
    let setupObject = {
      options: headers,
      adapterPath: adapterPath,
      body: BODY

    };
    return setupObject; 
  }
}