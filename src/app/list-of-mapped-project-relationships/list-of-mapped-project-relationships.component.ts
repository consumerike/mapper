import { Component, OnInit, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import {IProject, Project } from '../components/mapper-models' 
import { UserService } from "../Services/user-service.service";
import {MyProjectService} from '../Services/project.service'
import { MapperService } from '../Services/mapper.service';
import { Subject, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { takeUntil, map, tap, take } from 'rxjs/operators';
import { M } from "materialize-css";


declare const $: any
declare const window: Window;

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
  currentUserID$: Observable<string>
  realSavedProjects$: Observable<any>
  danMappedProjects$: Observable<any[]>
  danMappedProjects: any[]
  testSub = new Subject();
  testbehaveSub = new BehaviorSubject(null);

  currentID;
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
    this.currentUserID$ = this.userService.getCurrentUserID();
    this.realSavedProjects$ = this.currentUserID$
    .pipe(
      map((data) =>  {
        console.log('current ID is data right?',data);
        this.currentID = data;
        this.getSavedProjects(this.currentID);
        }
      )
    );
    this.realSavedProjects$.pipe().subscribe();
       

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
    
    // wow block
    // this.getCurrentUserID();
    // this.getSavedProjects(this.currentID);

    // end wow block
    // this.getMappedProjects();
    
    
    // this.getPlanviewAssociations(this.listOfSavedPerviewProjects); 
    // document.addEventListener('DOMContentLoaded', function() {
    //   var elems = document.querySelectorAll('.modal');
    //   var instances = M.Modal.init(elems, onCloseEnd());
    // });
    // $(document).ready(function(){
    //   $('.perview').modal({
    //     dismissible: true,
    //     onCloseEnd: function(){console.log('what is the scope', this);
    //     },
    //     complete: function() {console.log('running as intended'), this.getSavedProjects(); } 
    //   });
    // });

  }

  updateChanges(): any {
    this.mapperService.updateData();
  }
  
  getCurrentUserID(): void {
    this.userService.getCurrentUserID()
    .pipe(
      takeUntil(this.unSub),
      map( (data) => {
        console.log('currentID:', data);
        this.currentID = data;
         
      })
    )
    .subscribe((data) => data);
    
  } 
  getSavedProjects(currentUserID: string): void {
  
   console.log('ok',currentUserID); 
    this.myProjectService.getSavedPerviewProjects(this.userService.currentUser)
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

  // getMappedProjects() {
  //   this.mapperService.getMappedProjects()
  //   .subscribe((data) => {  
  //     this.mappedProjects = data;
  //   })
  // }

  deletePlanviewAssociation(mappedRelationship): any {
    console.log(mappedRelationship);
    
    if (this.confirmDeletionOfPlanviewAssociation(mappedRelationship)) {
      console.log("passed in project:", mappedRelationship);
      this.mapperService.deletePlanviewAssociation(mappedRelationship).subscribe();
      
      console.log("reflect delete", this.listOfSavedPerviewProjects);
      this.getSavedProjects(this.currentID)
      console.log("said ok");
    }
    else console.log('canceled operation');
  }

  confirmDeletionOfPlanviewAssociation(mappedRelationship: any) {
    let decision = confirm(`Warning! This will delete the association
      created by ${this.userService.currentUser} between
      ${mappedRelationship.projectName} and ${mappedRelationship.projectGuid}
      Are you sure?`);
    if (decision == true) {return true}
  }

  deletePerviewProject(perviewProject, index): any {
    if (this.confirmDeletionOfPerviewProject(perviewProject, index)) {;
      this.mapperService.deletePerviewAssociations(perviewProject);
      this.myProjectService.deletePerviewProject(perviewProject, index);
      this.getSavedProjects(this.currentID);
      console.log('said ok');
    }
    else {console.log('canceled operation');
    }
    
  }

  confirmDeletionOfPerviewProject(perviewProject, index) {
    let listOfDeletedPlanviewProjects = perviewProject.planviewProjects.map(pair => pair.ppl_code)
    console.log("what we need",listOfDeletedPlanviewProjects);
    
    let decision = confirm(`Warning! This will delete the association
      created by ${this.userService.currentID} between
      ${perviewProject.name} and ${listOfDeletedPlanviewProjects.join()}
      Are you sure?`);
    if (decision == true) {return true}
  }

  onSelect(selectedPerviewProject: any): void {
    console.log("uid string:",selectedPerviewProject.uid);
    
    this.uid = selectedPerviewProject.uid;
    // this.perviewProject.ppl_code = selectedPerviewProject.ppl_code;
  }

  hidePerviewProjects() {
   return false;
  }

  handleModalClick(perviewProj): void {
    console.log("Do i have what I need?", perviewProj);

  }


}
