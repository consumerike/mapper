import { Component, OnInit } from '@angular/core';
import { PerviewService } from '../../Services/perview.service';
import { MyProjectService } from '../../Services/project.service';
import { IProject } from '../mapper-models';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-authorized-perview-projects',
  templateUrl: './authorized-perview-projects.component.html',
  styleUrls: ['./authorized-perview-projects.component.css']
})
export class AuthorizedPerviewProjectsComponent implements OnInit {

  constructor(private _perviewService: PerviewService,
    private _myprojectService: MyProjectService
  ) { }

  private authorizedProjects: any[];
  private selectedProjects: any[];
  private myProjects: any[];

  ngOnInit() {
    this.authorizedProjects = this.getPerviewProjects();
    this.myProjects = this._myprojectService.myProjects;
  }

  settings = {
    columns: {
      id: {
        title: "Project Name"
      },
      name: {
        title: "Project Manager"
      },
      username: {
        title: "Project Status"
      },
      email: {
        title: "Business Owner"
      }
    }
  };

  getPerviewProjects(): IProject[] {
    this.authorizedProjects = this._perviewService.getAuthorizedPerviewProjects();
    return this.authorizedProjects;
  }

  addSelectedProjects(): void {
    this.myProjects.push(this.selectedProjects);
    this.clearSelections();
 
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
