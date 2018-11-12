import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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

  constructor(private http: Http) { }
  settings: Config;
  
  loadConfigSettings() {
    return new Promise((resolve, reject) => {
      return this.http.get("./assets/qa-config.json").subscribe(t=>{
      // return this.http.get("../../../main-config.json").subscribe(t=>{
       console.log("configuration map= " + JSON.stringify(t.json()))
         this.settings = t.json() as Config
         resolve(true);
       })
       
     })
  }
}
