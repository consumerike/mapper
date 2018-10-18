import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, OnInit, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import {IProject, Project } from '../components/mapper-models' 
import { UserService } from "../Services/user-service.service";
import {MyProjectService} from '../Services/project.service'
import { MapperService } from '../Services/mapper.service';
import { Subject, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { takeUntil, map, tap, take, switchMap } from 'rxjs/operators';
import { M } from "materialize-css";
import { ModalService } from '../Services/modal.service';




import { ListOfMappedProjectRelationshipsComponent } from './list-of-mapped-project-relationships.component';
import { MapperHeaderComponent } from '../components/mapper-header/mapper-header.component';
import { MapperFooterComponent } from '../components/mapper-footer/mapper-footer.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';


import { currentId } from 'async_hooks';

describe('ListOfMappedProjectRelationshipsComponent', () => {
  let component: ListOfMappedProjectRelationshipsComponent;
  let fixture: ComponentFixture<ListOfMappedProjectRelationshipsComponent>;
  let mapperHeaderComponent: MapperHeaderComponent;
  let mapperHeaderFixture: ComponentFixture<MapperHeaderComponent>;
  let mapperFooterComponent: MapperFooterComponent;
  let mapperFooterFixture: ComponentFixture<MapperFooterComponent>;
  let LoadingSpinnerComponent: LoadingSpinnerComponent;
  let LoadingSpinnerFixture: ComponentFixture<LoadingSpinnerComponent>
  let userService: UserService
  let userServiceStub: Partial<UserService>
  let myprojectService: MyProjectService
  let myprojectServiceStub: Partial<MyProjectService>
  let mapperService: MapperService
  let mapperServiceStub: Partial<MapperService>
  let spy: any;

  beforeEach(async(() => {
 
    TestBed.configureTestingModule({
     
      declarations: [ ListOfMappedProjectRelationshipsComponent, MapperHeaderComponent, LoadingSpinnerComponent,MapperFooterComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // userServiceStub = {
    //   currentID:'Stan Lee'
    // }

    // myprojectServiceStub = {
    //   userHasSavedProjects: true,
    //   userWithNoSavedProjects: false,
    //   projectsSavedByUser$: [
    //     'Spiderman'
    //     ,'X-Men'
    //     ,'Captain America'
    //   ]
    // }

    let listOfSavedPerviewProjects = [
      {"projUid":"27aefb32-4f00-4ff0-a923-6b18dd7b74a5","projName":"1 KLGM Test 1","planviewProjects":[{"projectGuid":"27aefb32-4f00-4ff0-a923-6b18dd7b74a5","projectName":"BPG Automated SSC (eSSC)","ppl_Code":"319256","mappedBy34":"fre6871","mappedByName":"Mehta Rashi"}]}
      ,{"projUid":"1eabc48f-65d4-444c-b4e3-44596cd1fcb8","projName":"1 KLGM Test 3","planviewProjects":[{"projectGuid":"1eabc48f-65d4-444c-b4e3-44596cd1fcb8","projectName":"BPG Virtual Registration","ppl_Code":"319363","mappedBy34":"ejz7102","mappedByName":"ejz7102"}]}
      ,{"projUid":"477df71a-484e-4fd0-b1bb-9dee2102a77e","projName":"1 KLGM Test 4","planviewProjects":[{"projectGuid":"477df71a-484e-4fd0-b1bb-9dee2102a77e","projectName":"Computer Assisted Coding for ED - Enterprise","ppl_Code":"32664","mappedBy34":"ejz7102","mappedByName":"ejz7102"}]}
    ]

    let filteredListofProjects;

    TestBed.configureTestingModule({
      declarations: [ ListOfMappedProjectRelationshipsComponent,MapperHeaderComponent,
        MapperFooterComponent, LoadingSpinnerComponent ],
      providers: [mapperService]
    });

 
  });

  xit('#onInit() should return necessary data for rendering component', () => {
    
    // spyOn(userService, 'currentID').and.returnValue('Stan Lee')
    // expect(userServiceStub.currentID).toBe('Stan Lee');
    // expect(myprojectServiceStub.userHasSavedProjects).toBe(true)
    // expect(myprojectServiceStub.userWithNoSavedProjects).toBe(false)
    
  });  

  xit('#getMappedPlanviewProjects() should return an array of Planview Projects for each Perview project', () => {
    // expect(mapperServiceStub.mappedProjects).toEqual(jasmine.any(Array))
    // expect(component.getMappedPlanviewProjects()).toContain(<IProject> {projUid:'Rhino'});
  });

  xit('#deletePlanviewAssociation() should remove a planView project from being mapped to a Perview project', () => {
    // expect(component.confirmDeletionOfPlanviewAssociation()).toBe(('yes' || 'no'))
    // expect(component.deletePlanviewAssociation(myprojectService.projectsSavedByUser[0])).toHaveBeenCalled();
    // expect(component.remove(myprojectService.projectsSavedByUser[0])).toHaveBeenCalled();
  });

  xit('#confirmDeletionOfPlanviewAssociation() should perform a check before deleting a PlanView project', () => {
    // expect(component.confirmDeletionOfPlanviewAssociation()).toBe(('yes' || 'no'))
    
  });

  fit('#deletePerviewProject() if confirmed, should delete a PerViewProject with all associated PlanView projects', () => {
    
    spy = spyOn(component, 'confirmDeletionOfPerviewProject').and.returnValue(true);
    mapperSpy = spyOn(mapperService,'deletePlanviewAssociation').and.returnValue([]);
    component.deletePerviewProject(this.listOfSavedPerviewProjects[0],0)
    // expect(component.confirmDeletionOfPerviewProject(this.listOfSavedPerviewProjects[0].planviewProjects[0],0)).toHaveBeenCalled();
    expect(component.confirmDeletionOfPerviewProject(this.listOfSavedPerviewProjects[0],0)).toHaveBeenCalled();
    expect(mapperService.deletePlanviewAssociation).toHaveBeenCalled();
    // expect(component.deletePerviewProject(this.listOfSavedPerviewProjects[0],0)).toHaveBeenCalled();
    expect(this.listOfSavedPerviewProjects.length).toEqual(2);
  });

  xit('#confirmDeletionOfPerViewPerviewProject() should perform a check before deleting a Perview project', () => {
    // expect(component.confirmDeletionOfPerviewProject()).toHaveBeenCalled();
  });

  xit('#hidePerviewProjects() should hide a Perview project by setting show:false', () => {
    // expect(component.hidePerviewProjects()).toEqual(false)
  });
   
});

//by way of example:
//expect(12).toEqual(jasmine.any(Number))

/* 
[
  {"projUid":"27aefb32-4f00-4ff0-a923-6b18dd7b74a5","projName":"1 KLGM Test 1","planviewProjects":[{"projectGuid":"27aefb32-4f00-4ff0-a923-6b18dd7b74a5","projectName":"BPG Automated SSC (eSSC)","ppl_Code":"319256","mappedBy34":"fre6871","mappedByName":"Mehta Rashi"}]}
  ,{"projUid":"1eabc48f-65d4-444c-b4e3-44596cd1fcb8","projName":"1 KLGM Test 3","planviewProjects":[{"projectGuid":"1eabc48f-65d4-444c-b4e3-44596cd1fcb8","projectName":"BPG Virtual Registration","ppl_Code":"319363","mappedBy34":"ejz7102","mappedByName":"ejz7102"}]}
  ,{"projUid":"477df71a-484e-4fd0-b1bb-9dee2102a77e","projName":"1 KLGM Test 4","planviewProjects":[{"projectGuid":"477df71a-484e-4fd0-b1bb-9dee2102a77e","projectName":"Computer Assisted Coding for ED - Enterprise","ppl_Code":"32664","mappedBy34":"ejz7102","mappedByName":"ejz7102"}]}

]
*/