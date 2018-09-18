import { Injectable } from '@angular/core';
import { IProject, Project, Result, MappedProject, SavedProject } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { map, tap, filter, catchError } from 'rxjs/operators';
import { Observable, Subscribable, Subscription, from, throwError } from 'rxjs';
import { MyProjectService } from './project.service';


@Injectable({
  providedIn: 'root'
})

export class MapperService {
 
  
  constructor(private http: HttpClient, private myProjectService: MyProjectService) {
    
   }
   apiRoot: string = "https://perviewqa.app.parallon.com/PWA";

  
  public planviewMappedProjects: any;
  // private dataSourceFlag:boolean = true;

  // getMappedProjects(): Observable<any> {
  //   if(this.dataSourceFlag === true) {  
  //     return this.http.get('./assets/mapper-projects.txt', {responseType: 'json'})
  //     .pipe (
  //       map( (data) => {
  //         console.log(data);
  //         try {
          
  //          this.mappedProjects = data["mappedProjects"]
  //          this.dataSourceFlag = false;
  //          return this.mappedProjects;
  //         }
  //        // this.mappedProjects = data["mappedProjects"]
  //        catch{
  //         console.log("is this running??--it shouldn't be....");
  //        } error => console.log(error);
                 
  //       })

  //     )
    
  //   }
  //   console.log(this.dataSourceFlag);    
  //   console.log("Given false flag", this.mappedProjects);
  //   return from([this.mappedProjects]);
  // }
  
  getMappedPlanviewAssociations(savedPerviewProjects:SavedProject[]): any[] {
    console.log("why are you saying it cannot be read: getMappedPlanviewAssociationsb", savedPerviewProjects);
    return savedPerviewProjects.map((perProj) => {
      console.log("trying to get the mappedProjects after addition:", perProj);
      
      return this.perviewMappedPlanviewAssociations(perProj).subscribe()
    })

  }

  //chance this runs too quickly before data is ready...
  perviewMappedPlanviewAssociations(project: SavedProject): Observable<MappedProject[]> {
    console.log('what is the project here in perviewMappedPlanviewAssociations::', project);
    
    let url = `https://xrdcwpdbsmsp03:40001/api/projects/${project.projUid}/planViewProjects`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
              .set('Access-Control-Allow-Origin','http://localhost:4200')
              .set('Access-Control-Expose-Headers', 'accept');
    let options = {
      headers,
    }  

    console.log("need to be passing in a projectUIDman",project.projUid);
    try {    
    return this.http.get(url,options)
    .pipe(
      map(data => {        
      console.log(onerror);
      console.log("this is the array essentially",data)
        this.planviewMappedProjects = data;
        project.planviewProjects = this.planviewMappedProjects
        console.log("project.planviewProjects",this.planviewMappedProjects,);
          
          // this.addPerviewProjectForMapping(project).subscribe()
        //   console.log('in if loop for no projects in the array........', project);
        // } 
          // this.addPerviewProjectForMapping(project).subscribe();
        // }
        return project.planviewProjects;
       })
      ); 
    }
   
    catch(error) {
      console.log('what IS MY ERROR SHOULD BE 404::::::',onerror,error,Error);
      
      console.log("that didn't work in perviewMappedPlanviewAssociations function...adding perview project for mapping now....");
      this.addPerviewProjectForMapping(project).subscribe()
    }
    
  }
  
  checkPerviewProjectMapStatus(project:SavedProject): Observable<any> {
    let url = `https://xrdcwpdbsmsp03:40001/api/projects/${project.projUid}`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
      .set('Content-Type', 'application/json');
    let options = {
      headers,
    }
    console.log('checking perviewproject map status....');
    
    return this.http.get(url,options)
    .pipe(
      tap((data) => {
        console.log(data, "if there's any data, let's take a look");
        
      }),
      catchError(err => {
        console.log('this project needs to be mapped, clearly',err);
        
        return this.addPerviewProjectForMapping(project);
      })  
    )
   
  }
  
  addPerviewProjectForMapping(project: SavedProject): Observable<any> {
    console.log("this is the inputted project in addPerviewProjectForMapping @MapperService::::", project);
    console.log("this is the inputted project uid in addPerviewProjectForMapping @MapperService::::", project.projUid);
    console.log("this is the inputted project name in addPerviewProjectForMapping @MapperService::::", project.projName);
    
    let url = `https://xrdcwpdbsmsp03:40001/api/projects`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
      .set('Content-Type', 'application/json');
    let options = {
      headers,
    }
    let body = {"projectGUID": project.projUid, "ProjectName":project.projName}
    let prepBody = `${JSON.stringify(body)}`
  
   console.log('body is on point:', prepBody);
   
   try {
    return this.http.post(url,prepBody,options)
    .pipe(
      map((data) => { console.log('worked in addPerviewProjectForMapping:',data); return data})
    )
   }
   catch {
     console.log('nope, could not add perViewProjectforMapping');
     
   }

  }

  addSingleMappedPlanviewProject(projectUID: string, selection: MappedProject): Observable<any> {
    console.log('is this correct for url:', projectUID);
    
    let url = `https://xrdcwpdbsmsp03:40001/api/projects/${projectUID}/planViewProjects`
    let headers = new HttpHeaders();
    headers =  headers.set('Content-Type', 'application/json')
               .set('accept', 'application/json')
               .set('Access-Control-Allow-Origin','http://localhost:4200')
               .set('Access-Control-Expose-Headers', 'accept');
              
              
    let options = {
      headers
    }
    let body = `
      ${JSON.stringify(selection)}
    `  
    console.log('hardbody check for format:', body);
    try {
      return this.http.post(url,body,options)
      .pipe((data) => { console.log('worked in addSingleMappedPlanviewProject:',data); return data}
      )

      
    }
    catch {console.log('crap, does not work@mapperService--addSingleMappedPlanviewProject');
    }
  
      
  }

  deletePlanviewAssociation(mappedRelationship:any):Observable<any> {
    
    
    let url = `https://xrdcwpdbsmsp03:40001/api/projects/${mappedRelationship.projectGuid}/planViewProjects/${mappedRelationship.ppl_Code}`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json')
              .set('Content-Type', 'application/json');
              
    let options = {
      headers,
    }
    try {
      return this.http.delete(url,options)
      .pipe((data) => { console.log('worked in @mapperService--deleteplanViewassociation:',data); return data}
      )
    }
    catch {
      console.log('well that did not work');
      
    }
    
  }

  deletePerviewAssociations(perviewProject: SavedProject): void {
    console.log("all the projects:",perviewProject.planviewProjects);
    perviewProject.planviewProjects.map((mappedRelationship) => {
      console.log('ppl_COde or ppl_code check:', mappedRelationship);
      
      this.deletePlanviewAssociation(mappedRelationship).subscribe();
    })
  }

}//END OF FILE
    
    
  //  let planViewMappedProjects =  this.mappedProjects.filter((mappedProj) => {    
  //    if(mappedProj.uid == project.name) return true;
  // });
  // this.planviewMappedProjects = planViewMappedProjects;
  // project.planviewProjects = planViewMappedProjects;
  // return project.planviewProjects;
  
  
  // deletePerviewAssociations(perviewProject: any): any {
  //   console.log("this should be Spiderman as the perviewProject", perviewProject);
  //   // let newMappedProjects: any[] = this.mappedProjects.filter((mappedProject)=> {
  //     console.log("what is mappedProject here within filter:", mappedProject);
  //     if(mappedProject.uid !== perviewProject.name){return true}
      
  //   });
  //   console.log("are spiderman projects no longer part of this list of mapped projects?", newMappedProjects);
    
  //   // this.mappedProjects = newMappedProjects;
  //   this.updateData();
  //   //need to update Observable for mappedProjects;
  // }

  // deletePlanviewAssociation(mappedRelationship: any) {
    // console.log("current mappedProjects:",this.mappedProjects);
    // console.log("what is mappedRelationship--manipulate this!", mappedRelationship);
    
    // let newMappedProjects :any[] = this.mappedProjects.filter((mappedProject) =>{
    //   console.log("what is mapped project within filter?",mappedProject);
    //  if ( mappedProject.uid !== mappedRelationship.uid 
    //   || mappedProject.ppl_code !== mappedRelationship.ppl_code) {return true}
    // });
    
    // this.mappedProjects = newMappedProjects;
    // this.updateData();
    // mappedRelationship = "";
    // return this.mappedProjects; //filter returns new filtered array line not nec.
  // }

  // updateData(): Observable<any[]> {
    // console.log("within updateData function looking for harley quinn:", this.mappedProjects);
    // return from([this.mappedProjects]);
  // }

// }

//for reference

/*

 return this.http.get('./sharepoint-users-projects.json')
      .subscribe( (data) => {console.log(data);this.myProjects = data["perviewProjects"]});
    
    }
    console.log('no projects');
  }


*/





