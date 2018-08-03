import { Component, OnInit, Input } from '@angular/core';
import { PlanviewService } from '../../Services/planview.service';
import { MyProjectService } from '../../Services/project.service';
import { IProject } from '../mapper-models';
import { Observable } from 'rxjs';
import { MapperService } from '../../Services/mapper.service';

@Component({
  selector: 'app-authorized-planview-projects',
  templateUrl: './authorized-planview-projects.component.html',
  styleUrls: ['./authorized-planview-projects.component.css']
})
export class AuthorizedPlanviewProjectsComponent implements OnInit {

  constructor(private planviewService: PlanviewService,
    private myprojectService: MyProjectService,
    private mapperService: MapperService
  ) { }

  private authorizedProjects: any[];
  private selectedProjects: any[];
  private myProjects: any[];

  @Input() perviewProject: IProject;

  ngOnInit() {
    this.getPlanviewProjects();
    
    // this.myProjects = this.myprojectService.myProjects;
  }

  settings = {
    columns: {
      ppl_code: {
        title: "Project Name"
      },
      altPM: {
        title: "Alternate PM"
      }
    }
  };
  
 yes(){
  console.log("within component", this.authorizedProjects );
 } 
  
  getPlanviewProjects(): void {
    this.planviewService.getAuthorizedPlanviewProjects()
    .map((data) => {this.authorizedProjects = data;})
    
    .subscribe();
    console.log(this.authorizedProjects, "in compo")
  }

  addSelectedProjects(): void {
    this.prepareForMapping(this.selectedProjects);
    this.mapperService.mappedProjects.push(this.prepareForMapping(this.selectedProjects));
    this.clearSelections();
  }

  prepareForMapping(selectedProjects: any[]) {
    let preppedArray = selectedProjects.forEach((planviewProject) =>{
      console.log("this is the prepareForMapping function: planviewProject", planviewProject)
      { this.perviewProject.projUid, planviewProject}
    });
    return preppedArray;
  }

  rowClick(event){
    this.selectProject(event.data.projUID);
  }

  selectProject(ID: string) {
    if (this.projectIsSelected(ID)) {
       this.unselectProject(ID)
    }
    else {
      this.selectedProjects.push(ID);
    }
  }

  projectIsSelected(id: string): boolean {
    if (this.selectedProjects.map(t=>t.projUid).indexOf(id) > -1) {
      return true;
    }
  }

  unselectProject(ID: string) {
    this.selectedProjects.splice(this.selectedProjects.map(t=>t.projUid).indexOf(ID),1)
  }

  clearSelections(){
    this.selectedProjects = [];
  }
  

}

