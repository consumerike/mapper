import { Injectable } from '@angular/core';
import { IProject, Project, Result, MappedProject } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, Subscribable, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class MapperService {

  constructor(private _http: HttpClient) { }


  public mappedProjects: any[]

  getMappedProjects(): any {
    return this._http.get('./mapper-projects.json')
    .subscribe( (data) => {
      console.log(data);
      this.mappedProjects = data["mappedProjects"]
      error => console.log(error);
    });
    // this.mappedProjects = ['response'];
    // return this.mappedProjects;
  }

  
  
  getMappedPlanviewAssociations(SavedPerviewProjects:any[]): any[] {
   let associations: any =  SavedPerviewProjects.forEach((perProj) => {
      this.perviewMappedPlanviewAssociations(perProj)
    })
    return associations;
  }
  //for each project run mindgetMappedPlanviewAssociations()

  perviewMappedPlanviewAssociations(project: any): any[] {
   let planViewMappedProjects =  this.mappedProjects.filter((mappedProj) => {
      project.uid === mappedProj.uid
    });
    return planViewMappedProjects;
  }

  deletePerviewAssociations(mappedRelationship: any): any {
    let newMappedProjects :any[] = this.mappedProjects.filter((mappedProject) =>{
      mappedProject.uid !== mappedRelationship.uid       
    })
    this.mappedProjects = newMappedProjects;
  }

  deletePlanviewAssociation(mappedRelationship: any): any {
    let newMappedProjects :any[] = this.mappedProjects.filter((mappedProject) =>{
      mappedProject.uid !== mappedRelationship.uid 
      && mappedProject.ppl_code !== mappedRelationship.ppl_code
       
    })
    this.mappedProjects = newMappedProjects;
    return this.mappedProjects; //filter returns new filtered array line not nec.
  }

}

//for reference

/*

 return this.http.get('./sharepoint-users-projects.json')
      .subscribe( (data) => {console.log(data);this.myProjects = data["perviewProjects"]});
    
    }
    console.log('no projects');
  }


*/





