import { Component, OnInit, Input, Output } from '@angular/core';
import {IProject, Project } from '../components/mapper-models' 

import { UserService } from "../Services/user-service.service";
import {MyProjectService} from '../Services/project.service'
import { MapperService } from '../Services/mapper.service';


@Component({
  selector: 'list-of-mapped-projects',
  templateUrl: './list-of-mapped-project-relationships.component.html',
  styleUrls: ['./list-of-mapped-project-relationships.component.css']
})
export class ListOfMappedProjectRelationshipsComponent implements OnInit {

  constructor(private _userService: UserService, private _myProjectService: MyProjectService
    ,private _mapperService: MapperService
  ) {}
   //for testing purposes: 

   currentID = 'Stan Lee';
   savedProjects: boolean
   userHasSavedProjects: boolean
   userWithNoSavedProjects: boolean
  //for reals: 

  listOfSavedPerviewProjects: IProject[];

  ngOnInit() {
    this._userService.getCurrentUserID();
    this._myProjectService.getSavedPerviewProjects();
    this.getPlanviewAssociations(this.listOfSavedPerviewProjects);
    this.listOfSavedPerviewProjects = this._myProjectService.myProjects;
    this.currentID = 'Stan Lee';
  }
  

 

  getCurrentUserID(){}
  getPlanviewAssociations(project) {
    this._mapperService.getMappedPlanviewAssociations(this.listOfSavedPerviewProjects);
  }
  
  remove(uid){console.log(uid)}



  getMappedPlanviewProjects(): IProject[] {
    return  [{projUid:'Rhino'}]
  }

  deletePlanviewAssociation(UID: any): string {
    this.confirmDeletionOfPlanviewAssociation();
   return UID;
  }

  confirmDeletionOfPlanviewAssociation() {
    return 'yes';
  }

  deletePerviewProject() {
    this.confirmDeletionOfPerviewProject();
    return 'yes';
    
  }

  confirmDeletionOfPerviewProject() {
    return 'yes';
  }

  hidePerviewProjects() {
   return false;
  }






  



}
