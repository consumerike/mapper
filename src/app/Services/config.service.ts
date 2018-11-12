import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Response, Headers, RequestOptions } from '@angular/http';
import { Config } from '../components/mapper-models'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/mergeMap'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }
  settings: Config;
  
  loadConfigSettings() {
    return new Promise((resolve, reject) => {
      return this.http.get("./assets/qa-config.txt").subscribe(t=>{      
         this.settings = t as Config
         resolve(true);
       })
       
     })
  }
}
