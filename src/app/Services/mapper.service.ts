import { Injectable } from '@angular/core';
import { IProject, Project, Result, MappedProject } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { map, tap, filter } from 'rxjs/operators';
import { Observable, Subscribable, Subscription, from } from 'rxjs';
import { MyProjectService } from './project.service';


@Injectable({
  providedIn: 'root'
})

export class MapperService {

  constructor(private http: HttpClient, private myProjectService: MyProjectService) {
    
   }
   apiRoot: string = "https://perviewqa.app.parallon.com/PWA";

  
//   public mappedProjects: any[] = [{
// 		"uid": "Batman",
// 		"ppl_code": "The Joker"
// 	}, {
// 		"uid": "Spiderman",
// 		"ppl_code": "Venom"
// 	}, {
// 		"uid": "X-Men",
// 		"ppl_code": "Magneto"
// 	}, {
// 		"uid": "Captain America",
// 		"ppl_code": "Red Skull"
// 	}, {
// 		"uid": "Spiderman",
// 		"ppl_code": "Green Goblin"
// 	}, {
// 		"uid": "Spiderman",
// 		"ppl_code": "The Lizard"
// 	}, {
// 		"uid": "Spiderman",
// 		"ppl_code": "Dr. Octopus"
// 	}, {
// 		"uid": "Spiderman",
// 		"ppl_code": "Rhino"
//   }, {
//     "uid": "The Invisible Woman",
//     "ppl_code": "Doctor Doom"
//   }
//   , {
//     "uid": "Black Panther",
//     "ppl_code": "Erik Killmonger"
//   }
//   , {
//     "uid": "Wonder Woman",
//     "ppl_code": "Ares"
//   }
//   , {
//     "uid": "Wonder Woman",
//     "ppl_code": "Doctor Poison"
//   }
//   , {
//     "uid": "Wonder Woman",
//     "ppl_code": "Doctor Psycho"
//   }

// ];


  public planviewMappedProjects: any[];
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
  
  getMappedPlanviewAssociations(savedPerviewProjects:any[]): any[] {
    console.log("why are you saying it cannot be read: getMappedPlanviewAssociationsb", savedPerviewProjects);
    return savedPerviewProjects.map((perProj) => {
      return this.perviewMappedPlanviewAssociations(perProj).subscribe()
    })

  }

  //chance this runs too quickly before data is ready...
  perviewMappedPlanviewAssociations(project: any): Observable<any> {
    let url = `http://xrdcwpdbsmsp03:5000/api/projects/${project.projUID}/planViewProjects`
    let headers = new HttpHeaders();
    headers = headers.set('accept', 'application/json;odata=verbose')
              .set('Access-Control-Allow-Origin','http://localhost:4200')
              .set('Access-Control-Expose-Headers', 'accept');
    let options = {
      headers,
    }  

    console.log("need to be passing in a projectUIDman",project.projUID);
    try {
      console.log('are you stopping?');
      
      return this.http.get(url,options)
    .pipe(
      tap(data => {        
       console.log("this is the array essentially",data)
        this.planviewMappedProjects = data;
        project.planviewProjects = this.planviewMappedProjects
        console.log("project.planviewProjects",this.planviewMappedProjects,);
        
        return project.planviewProjects;
       }),
      ); 
    }
    catch{
      console.log("that didn't work in perviewMappedPlanviewAssociations function...");

    }
    
  }     

  addSingleMappedPlanviewProject(projectUID: any, selection: any): Observable<any> {
    console.log('is this correct for url:', projectUID);
    
    let url = `http://xrdcwpdbsmsp03:5000/api/projects/${projectUID}/planViewProjects`
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
    console.log('is this correct for url:projectGuid: projectUID, ppl_Code: ppl_Code ');
    
    let url = `http://xrdcwpdbsmsp03:5000/api/projects/${mappedRelationship.projectGuid}/planViewProjects/${mappedRelationship.ppl_Code}`
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





