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


import { currentId } from 'async_hooks';

describe('ListOfMappedProjectRelationshipsComponent', () => {
  let component: ListOfMappedProjectRelationshipsComponent;
  
  let fixture: ComponentFixture<ListOfMappedProjectRelationshipsComponent>;
  let userService: UserService
  let userServiceStub: Partial<UserService>
  let myprojectService: MyProjectService
  let myprojectServiceStub: Partial<MyProjectService>
  let mapperService: MapperService
  let mapperServiceStub: Partial<MapperService>
  let spy: any;

  beforeEach(async(() => {
 
    TestBed.configureTestingModule({
     
      declarations: [ ListOfMappedProjectRelationshipsComponent ],
      providers: [ {provide: UserService, useValue: userServiceStub},
        {provide: UserService, useValue: userServiceStub}
      ]
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

    this.listOfSavedPerviewProjects = [
      {"projUid":"27aefb32-4f00-4ff0-a923-6b18dd7b74a5","projName":"1 KLGM Test 1","planviewProjects":[{"projectGuid":"27aefb32-4f00-4ff0-a923-6b18dd7b74a5","projectName":"BPG Automated SSC (eSSC)","ppl_Code":"319256","mappedBy34":"fre6871","mappedByName":"Mehta Rashi"}]}
      ,{"projUid":"1eabc48f-65d4-444c-b4e3-44596cd1fcb8","projName":"1 KLGM Test 3","planviewProjects":[{"projectGuid":"1eabc48f-65d4-444c-b4e3-44596cd1fcb8","projectName":"BPG Virtual Registration","ppl_Code":"319363","mappedBy34":"ejz7102","mappedByName":"ejz7102"}]}
      ,{"projUid":"477df71a-484e-4fd0-b1bb-9dee2102a77e","projName":"1 KLGM Test 4","planviewProjects":[{"projectGuid":"477df71a-484e-4fd0-b1bb-9dee2102a77e","projectName":"Computer Assisted Coding for ED - Enterprise","ppl_Code":"32664","mappedBy34":"ejz7102","mappedByName":"ejz7102"}]}
    
    ]

    TestBed.configureTestingModule({
      declarations: [ ListOfMappedProjectRelationshipsComponent ],
      providers: [ {provide: UserService, useValue: userServiceStub}
        ,{provide: MyProjectService, useValue: myprojectServiceStub}
        ,{provide: MapperService, useValue: mapperServiceStub}
        ,{provide: UserService, useValue: userServiceStub}
      
      ]
    });

    fixture = TestBed.createComponent(ListOfMappedProjectRelationshipsComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    myprojectService = TestBed.get(MyProjectService)
    mapperService = TestBed.get(MapperService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onInit() should return necessary data for rendering component', () => {
    
    // spyOn(userService, 'currentID').and.returnValue('Stan Lee')
    expect(userServiceStub.currentID).toBe('Stan Lee');
    expect(myprojectServiceStub.userHasSavedProjects).toBe(true)
    expect(myprojectServiceStub.userWithNoSavedProjects).toBe(false)
    
  });  

  it('#getMappedPlanviewProjects() should return an array of Planview Projects for each Perview project', () => {
    expect(mapperServiceStub.mappedProjects).toEqual(jasmine.any(Array))
    expect(component.getMappedPlanviewProjects()).toContain(<IProject> {projUid:'Rhino'});
  });

  it('#deletePlanviewAssociation() should remove a planView project from being mapped to a Perview project', () => {
    expect(component.confirmDeletionOfPlanviewAssociation()).toBe(('yes' || 'no'))
    // expect(component.deletePlanviewAssociation(myprojectService.projectsSavedByUser[0])).toHaveBeenCalled();
    // expect(component.remove(myprojectService.projectsSavedByUser[0])).toHaveBeenCalled();
  });

  it('#confirmDeletionOfPlanviewAssociation() should perform a check before deleting a PlanView project', () => {
    expect(component.confirmDeletionOfPlanviewAssociation()).toBe(('yes' || 'no'))
    
  });

  it('#deletePerviewProject() if confirmed, should delete a PerViewProject with all associated PlanView projects', () => {
    spy = spyOn(component, 'confirmDeletionOfPerviewProject').and.returnValue(true);
    expect(component.confirmDeletionOfPerviewProject(this.listOfSavedPerviewProjects[0],0)).toHaveBeenCalled();
    expect(this.listOfSavedPerviewProjects.length).toEqual(2);
    // expect(component.deletePerviewProject()).toHaveBeenCalled();
  });

  it('#confirmDeletionOfPerViewPerviewProject() should perform a check before deleting a Perview project', () => {
    // expect(component.confirmDeletionOfPerviewProject()).toHaveBeenCalled();
  });

  it('#hidePerviewProjects() should hide a Perview project by setting show:false', () => {
    expect(component.hidePerviewProjects()).toEqual(false)
  });

  


    
});



//by way of example:
//expect(12).toEqual(jasmine.any(Nunber))

/* 
[
  {"projUid":"27aefb32-4f00-4ff0-a923-6b18dd7b74a5","projName":"1 KLGM Test 1","planviewProjects":[{"projectGuid":"27aefb32-4f00-4ff0-a923-6b18dd7b74a5","projectName":"BPG Automated SSC (eSSC)","ppl_Code":"319256","mappedBy34":"fre6871","mappedByName":"Mehta Rashi"}]}
  ,{"projUid":"1eabc48f-65d4-444c-b4e3-44596cd1fcb8","projName":"1 KLGM Test 3","planviewProjects":[{"projectGuid":"1eabc48f-65d4-444c-b4e3-44596cd1fcb8","projectName":"BPG Virtual Registration","ppl_Code":"319363","mappedBy34":"ejz7102","mappedByName":"ejz7102"}]}
  ,{"projUid":"477df71a-484e-4fd0-b1bb-9dee2102a77e","projName":"1 KLGM Test 4","planviewProjects":[{"projectGuid":"477df71a-484e-4fd0-b1bb-9dee2102a77e","projectName":"Computer Assisted Coding for ED - Enterprise","ppl_Code":"32664","mappedBy34":"ejz7102","mappedByName":"ejz7102"}]}

]
*/