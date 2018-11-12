import { Injectable } from '@angular/core';
import { IProject, Project, SavedProject } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Observable, Subscription, from } from 'rxjs';
import { map, tap, catchError, switchMap, finalize, retryWhen, scan } from "rxjs/operators";
import { ConfigService } from './config.service';
import { UserService } from './user-service.service';
import { UtilityService } from "./utility.service";
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';
import { CustomErrorHandlerService } from './custom-error-handler.service';


@Injectable({
  providedIn: 'root'
})

//purpose: manage user's saved projects/workspace
export class MyProjectService {

  constructor(private http: HttpClient, private config: ConfigService, private errorService: CustomErrorHandlerService, private userService: UserService, private utilityService: UtilityService) {console.log('inside myProjectService is running');
   }
  
  public projectsSavedByUser: SavedProject[] = [];

  handleError(error) :void {
    this.errorService.addError(error);
    this.errorService.setErrorsPresentStatus(true);
  }

  getSavedPerviewProjects(currentUser: string): Observable<any> {
  
    let url = `${this.config.settings.mapperUserStateRoot}/Items?$filter=AccountID%20eq%20%27${currentUser}%27&$select=ProjectUIDs` 
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose');
    let options = {
      headers,
      withCredentials: true,
    };
    console.log("have to have global Boulder here",this.userService.currentUser);
    console.log("have to have local CSrpings here",currentUser);
    
       return this.http.get(url,options)
       .pipe(
         map((Data) => {    
           
           // console.log("right here do I have data or not??::data, data[d].results, [0], length", Data,Data["d"].results,Data["d"].results[0].ProjectUIDs,Data["d"].results[0].ProjectUIDs.length  );
               this.projectsSavedByUser =  JSON.parse(Data["d"].results[0].ProjectUIDs);
               console.log("is this coming through correctly mate?", Data["d"].results[0].ProjectUIDs, "to json vers",this.projectsSavedByUser);
               return this.projectsSavedByUser;
 
          }),
          retryWhen((errors$: Observable<any>) => {
           return errors$.pipe(
             scan((count: number, currentError:string) => {
               if (count > 3) {
                 throw currentError;
               }
               else{ 
                 return count += 1;
               }
             }, 0)
            
           );
         }),
          catchError(err => {
           console.log('incredulous in observable catchError()',err);
           let errorMessage = new Error("Error: Did not successfully get saved projects from database")
           this.handleError(errorMessage);
           this.projectsSavedByUser = [];
           throw errorMessage;
         }),
         finalize(()=>{console.log('kill yourself!! (projects saved by user, errors present boolean,error list',this.projectsSavedByUser,this.errorService.errorsPresent,this.errorService.getErrorList());return this.projectsSavedByUser;})  
       );
     }
     


  addPerviewSelectedProjectstoWorkspace(currentUser:any,changeTokenHash:any, id: any, selections): Observable<any> {
    let modUser = this.utilityService.modifyCurrentUserVariable(currentUser)
    modUser = modUser.toLowerCase();
    console.log('currentUser in addPerview Project in @projectService::', currentUser);
    console.log('hash in addPervierwProject in @projectService::', changeTokenHash);
    console.log('id / item number in addPervierwProject in @projectService::',id);
    console.log('selections in addPerviewProject in @projectService::', selections);
    console.log('am i going to be adding things to the saved list?::', this.projectsSavedByUser);
    
    console.log('selections in addPervierwProject in @projectService::', selections);
 
    console.log("here we have the modUser should be lc:::",modUser);
    let url = `${this.config.settings.projectServerRoot}/_api/${id}`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
      .set('X-HTTP-Method','MERGE')
      .set('Content-Type','application/json;odata=verbose')
      .set('IF-MATCH','*')
      .set('X-RequestDigest',changeTokenHash)
    let options = {
      headers,
      // withCredentials: true
     }
    let body = `{
      "__metadata": {
        "type": "SP.Data.MapperUserStateListItem"
      },
      "AccountID": "${modUser}",
      "ProjectUIDs":'${JSON.stringify(selections)}'
    }
    `   
      return this.http.post(url, body, options)
      .pipe(
        tap( data => {
          console.log('is this a great success:', data);
          return data;
        }),
        catchError(err => {
          console.log('in observable catchError()',err);
          let errorMessage = new Error("Error: Did not successfully add project to your user profile")
          this.handleError(errorMessage);
          throw errorMessage;
        })
      );
  }

  deletePerviewProject(currentUser:any,changeTokenHash:any, id: any, selections) {
    let modUser = this.utilityService.modifyCurrentUserVariable(currentUser)
    modUser = modUser.toLowerCase();
    console.log('currentUser in addPerview Project in @projectService::', currentUser);
    console.log('hash in addPervierwProject in @projectService::', changeTokenHash);
    console.log('id / item number in addPervierwProject in @projectService::',id);
    console.log('selections in addPerviewProject in @projectService::', selections);
    console.log('am i going to be adding things to the saved list?::', this.projectsSavedByUser);
    
    console.log('selections in addPervierwProject in @projectService::', selections);
 
    console.log("here we have the modUser should be lc:::",modUser);
    let url = `${this.config.settings.projectServerRoot}/_api/${id}`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
      .set('X-HTTP-Method','MERGE')
      .set('Content-Type','application/json;odata=verbose')
      .set('IF-MATCH','*')
      .set('X-RequestDigest',changeTokenHash)
    let options = {
      headers,
      // withCredentials: true
     }
    let body = `{
      "__metadata": {
        "type": "SP.Data.MapperUserStateListItem"
      },
      "AccountID": "${modUser}",
      "ProjectUIDs":'${JSON.stringify(selections)}'
    }
    `   

    console.log('big body delete:', body);
    try {
      return this.http.post(url, body, options)
      .pipe(
        tap( data => {
          console.log('is this a great success:', data);
          
        return data;
        }),
        catchError(err => {
          console.log('in observable catchError()',err);
          let errorMessage = new Error("Error: Did not successfully delete project in your user profile. Please contact your PerView administrator.")
          this.handleError(errorMessage);
          return err.statusText;
        })
      );
    }
    catch {
      console.log('that is not working in addPerviewProject in project.service');
    }

  }

  
}//end of file
