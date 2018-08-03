import { Injectable } from '@angular/core';
import { IProject, Project, Result, MappedProject } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { MyProjectService } from './project.service';


@Injectable({
  providedIn: 'root'
})

export class MapperService {

  constructor(private _http: HttpClient, private myProjectService: MyProjectService) {
    
   }

  public mappedProjects: any[]
  public planviewMappedProjects: any[];
  private success: any[];

  getMappedProjects(): Observable<any> {
    return this._http.get('assets/mapper-projects.json')
    .map( (data) => {
      this.mappedProjects = data.mappedProjects;
      error => console.log(error);
      return this.mappedProjects;
    });
  }

  
  
  getMappedPlanviewAssociations(savedPerviewProjects:any[]): any[] {
    
    return savedPerviewProjects.map((perProj) => {
      return this.perviewMappedPlanviewAssociations(perProj)
    })

  }

  //chance this runs too quickly before data is ready...
  perviewMappedPlanviewAssociations(project): Observable<any> {
  let mappedProjects = [{
		"uid": "Batman",
		"ppl_code": "The Joker"
	}, {
		"uid": "Spiderman",
		"ppl_code": "Venom"
	}, {
		"uid": "X-Men",
		"ppl_code": "Magneto"
	}, {
		"uid": "Captain America",
		"ppl_code": "Red Skull"
	}, {
		"uid": "Spiderman",
		"ppl_code": "Green Goblin"
	}, {
		"uid": "Spiderman",
		"ppl_code": "The Lizard"
	}, {
		"uid": "Spiderman",
		"ppl_code": "Dr. Octopus"
	}, {
		"uid": "Spiderman",
		"ppl_code": "Rhino"
  }];

   let planViewMappedProjects =  mappedProjects.filter((mappedProj) => {
     if(mappedProj.uid == project.name) return true;
    
  });
  this.planviewMappedProjects = planViewMappedProjects;
  project.planviewProjects = planViewMappedProjects;
  console.log("zzz", project.name, project.planviewProjects)
  return project.planviewProjects;
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





