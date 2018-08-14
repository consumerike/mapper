import { Injectable } from '@angular/core';
import { IProject, Project, Result, MappedProject } from '../components/mapper-models';
import { HttpClient,  HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, Subscribable, Subscription, from } from 'rxjs';
import { MyProjectService } from './project.service';


@Injectable({
  providedIn: 'root'
})

export class MapperService {

  constructor(private _http: HttpClient, private myProjectService: MyProjectService) {
    
   }
  
  public mappedProjects: any[] = [{
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
  }, {
    "uid": "The Invisible Woman",
    "ppl_code": "Doctor Doom"
  }
  , {
    "uid": "Black Panther",
    "ppl_code": "Erik Killmonger"
  }
  , {
    "uid": "Wonder Woman",
    "ppl_code": "Ares"
  }
  , {
    "uid": "Wonder Woman",
    "ppl_code": "Doctor Poison"
  }
  , {
    "uid": "Wonder Woman",
    "ppl_code": "Doctor Psycho"
  }

  

];


  public planviewMappedProjects: any[];
  private dataSourceFlag:boolean = true;

  "boomshakalaka below this line...returning from assets instead of updated mapperService."
  getMappedProjects(): Observable<any> {
    if(this.dataSourceFlag === true) {  
      return this._http.get('assets/mapper-projects.json')
      .map( (data) => {
        this.mappedProjects = data.mappedProjects;
        error => console.log(error);
        this.dataSourceFlag = false;
        console.log("is this running??--it shouldn't be....");
        
        return this.mappedProjects;
      });
    }
    console.log(this.dataSourceFlag);    
    console.log("Given false flag", this.mappedProjects);
    return from([this.mappedProjects]);
  }
  
  getMappedPlanviewAssociations(savedPerviewProjects:any[]): any[] {
   
    console.log("why are you saying it cannot be read: getMappedPlanviewAssociationsb", savedPerviewProjects);
    
    return savedPerviewProjects.map((perProj) => {
      return this.perviewMappedPlanviewAssociations(perProj)
    })

  }

  //chance this runs too quickly before data is ready...
  perviewMappedPlanviewAssociations(project): Observable<any> {
   

  
   let planViewMappedProjects =  this.mappedProjects.filter((mappedProj) => {    
     if(mappedProj.uid == project.name) return true;
  });
  this.planviewMappedProjects = planViewMappedProjects;
  project.planviewProjects = planViewMappedProjects;
  return project.planviewProjects;
  }

  deletePerviewAssociations(perviewProject: any): any {
    console.log("this should be Spiderman as the perviewProject", perviewProject);
    let newMappedProjects: any[] = this.mappedProjects.filter((mappedProject)=> {
      console.log("what is mappedProject here within filter:", mappedProject);
      if(mappedProject.uid !== perviewProject.name){return true}
      
    });
    console.log("are spiderman projects no longer part of this list of mapped projects?", newMappedProjects);
    
    this.mappedProjects = newMappedProjects;
    this.updateData();
    //need to update Observable for mappedProjects;
  }

  deletePlanviewAssociation(mappedRelationship: any) {
    console.log("current mappedProjects:",this.mappedProjects);
    console.log("what is mappedRelationship--manipulate this!", mappedRelationship);
    
    let newMappedProjects :any[] = this.mappedProjects.filter((mappedProject) =>{
      console.log("what is mapped project within filter?",mappedProject);
     if ( mappedProject.uid !== mappedRelationship.uid 
      || mappedProject.ppl_code !== mappedRelationship.ppl_code) {return true}
    });
    
    this.mappedProjects = newMappedProjects;
    this.updateData();
    mappedRelationship = "";
    return this.mappedProjects; //filter returns new filtered array line not nec.
  }

  updateData(): Observable<any[]> {
    console.log("within updateData function looking for harley quinn:", this.mappedProjects);
    return from([this.mappedProjects]);
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





