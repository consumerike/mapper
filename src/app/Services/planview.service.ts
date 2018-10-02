import { Injectable } from '@angular/core';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter'

import { IProject, Project, MappedProject } from '../components/mapper-models';
import { Config } from "../components/mapper-models";
import { ConfigService } from "./config.service";
import { map, tap } from 'rxjs/operators';
import { UtilityService } from './utility.service';
import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class PlanviewService {


  constructor(private http:HttpClient, private configService: ConfigService, private utilityService: UtilityService, private userService: UserService) {
    this.config = configService.config;
  }
  config:Config;
  authorizedPlanviewProjects: any; //MappedProject[]

  getAuthorizedPlanviewProjects():Observable<MappedProject[]> {
    let modified34ID = this.utilityService.modifyCurrentUser(this.userService.currentUser);
    console.log("mod 34 ID equals",modified34ID);
    
    let url = `https://xrdcwpdbsmsp03:40001/api/projects/admin/AuthorizedPlanViewProjects/${modified34ID}`
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json;odata=verbose')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    let options = {
      headers
    };
    
     return this.http.get(url,options)
      .pipe(map( (data) => {        
      this.authorizedPlanviewProjects = data;
      return this.authorizedPlanviewProjects;
      }));
      
  }


  setupForGetPlanviewProjects(): object {
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
