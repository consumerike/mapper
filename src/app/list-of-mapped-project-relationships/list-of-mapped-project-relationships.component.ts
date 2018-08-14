import { Component, OnInit, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import {IProject, Project } from '../components/mapper-models' 
import { UserService } from "../Services/user-service.service";
import {MyProjectService} from '../Services/project.service'
import { MapperService } from '../Services/mapper.service';
import { Subject, Observable, BehaviorSubject, Subscription } from 'rxjs';
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
  projectSavedByUser$: Observable<any>
  //for reals:   
  // listOfSavedPerviewProjectsSub: Subscription;
  // listOfMappedProjectsSub: Subscription;
  listOfSavedPerviewProjects: any[];
  mappedProjects: any[];
  project;
  uid: any;
  unSub = new Subject<void>();

  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
    // this.listOfSavedPerviewProjectsSub.unsubscribe();
  }
  

  // danUpdateProjects(newProject: any): void {
  //   this.danMappedProjects.push(newProject);
  //   this.projects$.next(this.danMappedProjects);
  // }

  ngOnInit() {
    // this.testSub.next([1,2,3])

    // this.testSub.subscribe( () => {
    //   // you will never see 1,2,3 
    // })

    // this.testSub.next([4,5,6])

    // this.danSavedProjects$ = this.myProjectService.getSavedPerviewProjects();

    // this.danMappedProjects$ = this.danSavedProjects$.pipe(
    //   map( (data: any[]) => this.mapperService.getMappedPlanviewAssociations(data)),
    //   tap( (data: any[]) => this.danMappedProjects = data )
    // );

    // this.danMappedProjects$
    // .pipe(takeUntil(this.unSub))
    // .subscribe( (data: any[]) => console.log('dan', data));
    // this.projectSavedByUser$ = this.myProjectService.projectsSavedByUser$
    // this.listOfSavedPerviewProjectsSub = this.myProjectService.getSavedPerviewProjects().subscribe( (data) => this.listOfSavedPerviewProjects = data)
    // this.listOfMappedProjectsSub =  this.mapperService.perviewMappedPlanviewAssociations(this.project)
    // .subscribe((data)=>{console.log(`What's the data?`)})
    console.log('on init is running....');
    
    this.getCurrentUserID();
    this.getSavedProjects();
    this.getMappedProjects();
    // this.getPlanviewAssociations(this.listOfSavedPerviewProjects); 
    this.currentID = 'Stan Lee';
  }

  updateChanges(): any {
    this.mapperService.updateData();
  }
  
  getCurrentUserID(){
    this.userService.getCurrentUserID();
  }

  getSavedProjects(): void {
    this.myProjectService.getSavedPerviewProjects()
    .pipe(
      takeUntil(this.unSub),
      map( (data) => {
      this.listOfSavedPerviewProjects = data;
      console.log("after updating does getSavedProjects() in listComponent work?", this.listOfSavedPerviewProjects);
      
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
    console.log("passed in project:", mappedRelationship);
    this.mapperService.deletePlanviewAssociation(mappedRelationship);
    console.log("reflect delete", this.listOfSavedPerviewProjects);
    this.getSavedProjects()
  }

  confirmDeletionOfPlanviewAssociation() {
    return 'yes';
  }

  deletePerviewProject(perviewProject, index): any {
    this.confirmDeletionOfPerviewProject();
    this.mapperService.deletePerviewAssociations(perviewProject);
    this.myProjectService.deletePerviewProject(perviewProject, index);
    this.getSavedProjects();
    return 'yes';
  }

  confirmDeletionOfPerviewProject() {
    return 'yes';
  }

  onSelect(selectedPerviewProject: any): void {
    console.log("uid string:",selectedPerviewProject.uid);
    
    this.uid = selectedPerviewProject.uid;
    // this.perviewProject.ppl_code = selectedPerviewProject.ppl_code;
  }

  hidePerviewProjects() {
   return false;
  }

}
