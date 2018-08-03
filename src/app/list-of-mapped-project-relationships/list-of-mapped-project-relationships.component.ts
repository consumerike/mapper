import { Component, OnInit, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import {IProject, Project } from '../components/mapper-models' 
import { UserService } from "../Services/user-service.service";
import {MyProjectService} from '../Services/project.service'
import { MapperService } from '../Services/mapper.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, map, tap, take } from 'rxjs/operators';


@Component({
  selector: 'list-of-mapped-projects',
  templateUrl: './list-of-mapped-project-relationships.component.html',
  styleUrls: ['./list-of-mapped-project-relationships.component.css']
})
export class ListOfMappedProjectRelationshipsComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService, private myProjectService: MyProjectService
    ,private mapperService: MapperService
  ) {}
   //for testing purposes: 
  projects$ = new Subject();
  danSavedProjects$: Observable<any[]>
  danMappedProjects$: Observable<any[]>
  danMappedProjects: any[]
  testSub = new Subject();
  testbehaveSub = new BehaviorSubject(null);

   currentID = 'Stan Lee';
   savedProjects: boolean
   userHasSavedProjects: boolean
   userWithNoSavedProjects: boolean
   listings;
  //for reals: 

  listOfSavedPerviewProjects: any[];
  mappedProjects: any[];
  project;

  unSub = new Subject<void>();

  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  }

  danUpdateProjects(newProject: any): void {
    this.danMappedProjects.push(newProject);
    this.projects$.next(this.danMappedProjects);
  }

  ngOnInit() {
    this.testSub.next([1,2,3])

    this.testSub.subscribe( () => {
      // you will never see 1,2,3 
    })

    this.testSub.next([4,5,6])

    this.danSavedProjects$ = this.myProjectService.getSavedPerviewProjects();

    this.danMappedProjects$ = this.danSavedProjects$.pipe(
      map( (data: any[]) => this.mapperService.getMappedPlanviewAssociations(data)),
      tap( (data: any[]) => this.danMappedProject = data )
    );

    this.danMappedProjects$
    .pipe(takeUntil(this.unSub))
    .subscribe( (data: any[]) => console.log('dan', data));



    this.getCurrentUserID();
    this.getSavedProjects();
    this.getMappedProjects();
    // this.getPlanviewAssociations(this.listOfSavedPerviewProjects); 
    this.currentID = 'Stan Lee';
  }
  
  getCurrentUserID(){
    this.userService.getCurrentUserID();
  }

  // getSavedProjects() {
  //   this.myProjectService.getSavedPerviewProjects()
  //   .subscribe( (data) => {
     
  //     this.listOfSavedPerviewProjects = data;
  //     console.log("this is the list of saved projects",this.listOfSavedPerviewProjects);
  //   })
  // }

  getSavedProjects(): void {
    this.myProjectService.getSavedPerviewProjects()
    .pipe(
      takeUntil(this.unSub),
      map( (data) => {
      this.listOfSavedPerviewProjects = data;
      console.log("this is the list of saved projects",this.listOfSavedPerviewProjects);
      this.getPlanviewAssociations(this.listOfSavedPerviewProjects)
    })
    )
    .subscribe((data) => data);
  }

  getPlanviewAssociations(projects: any[])  {
    this.mapperService.getMappedPlanviewAssociations(projects)
  }

  getListOfPlanviewMappedProjects() {
    this.mapperService.perviewMappedPlanviewAssociations(this.project)
    .subscribe((data)=>{console.log(`What's the data?`)})
  }
  
  remove(uid){console.log(uid)}


  getMappedProjects() {
    this.mapperService.getMappedProjects()
    .subscribe((data) => {  
      this.mappedProjects = data;
    })
  }

  deletePlanviewAssociation(mappedRelationship): any {
    this.confirmDeletionOfPlanviewAssociation();
    this.mapperService.deletePlanviewAssociation(mappedRelationship);
  }

  confirmDeletionOfPlanviewAssociation() {
    return 'yes';
  }

  deletePerviewProject(mappedRelationship): any {
    this.confirmDeletionOfPerviewProject();
    this.mapperService.deletePerviewAssociations(mappedRelationship);
    return 'yes';
    
  }

  confirmDeletionOfPerviewProject() {
    return 'yes';
  }

  hidePerviewProjects() {
   return false;
  }

}
