import { Component, OnInit, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import {IProject, Project, SavedProject, MappedProject } from '../components/mapper-models' 
import { UserService } from "../Services/user-service.service";
import {MyProjectService} from '../Services/project.service'
import { MapperService } from '../Services/mapper.service';
import { Subject, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { takeUntil, map, tap, take, switchMap } from 'rxjs/operators';
import { M } from "materialize-css";
import { ModalService } from '../Services/modal.service';


declare const $: any
declare const window: Window;

@Component({
  selector: 'list-of-mapped-projects',
  templateUrl: './list-of-mapped-project-relationships.component.html',
  styleUrls: ['./list-of-mapped-project-relationships.component.css']
})
export class ListOfMappedProjectRelationshipsComponent implements OnInit, OnDestroy {

 
  constructor(private userService: UserService, private myProjectService: MyProjectService
    ,private mapperService: MapperService, private modalService: ModalService
  ) {}
   //for testing purposes: 
  projects$ = new Subject();
  currentUserID$: Observable<string>
  realSavedProjects$: Observable<any>
  currentID: string;
  projectSavedByUser$: Observable<any>
  //for reals:   
  // listOfSavedPerviewProjectsSub: Subscription;
  // listOfMappedProjectsSub: Subscription;
  listOfSavedPerviewProjects: SavedProject[];
  mappedProjects: MappedProject[];
  project: SavedProject;
  selectedProject: SavedProject;
  unSub = new Subject<void>();

  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
    // this.listOfSavedPerviewProjectsSub.unsubscribe();
  }
  

  // danUpdateProjects(newProject: any): void {
  //   this
  //   this.projects$.next(this
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
       

    // this
    //   map( (data: any[]) => this.mapperService.getMappedPlanviewAssociations(data)),
    //   tap( (data: any[]) => this
    // );

    // this
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
    $(document).ready(function(){
      $('.modal').modal({
        dismissible: false,
        // complete: function() {console.log('long live the king', this);}     
      });
    });


  }

  updateChanges(): any {
    // this.mapperService.updateData();
    throw new Error("Method not implemented.");
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
    .subscribe((data) => {console.log('after all that what is data, savedperviewprojects...',data,this.listOfSavedPerviewProjects)
    console.log('canelo wins');
    console.log(this.listOfSavedPerviewProjects.length);
    
      if(this.listOfSavedPerviewProjects.length === 0) {
        this.myProjectService.handleNoUser().subscribe();
      }
      else {
        console.log('shut up please.')
      }
    });
  }

  getPlanviewAssociations(projects: SavedProject[]): void  {
      this.mapperService.getMappedPlanviewAssociations(projects)
  }

  getListOfPlanviewMappedProjects(): void {
    this.mapperService.perviewMappedPlanviewAssociations(this.project)
    .subscribe((data)=>{console.log(`What's the data?`)})
  }
  

  deletePlanviewAssociation(mappedRelationship: MappedProject, index): any {
    console.log(mappedRelationship,"oh crap:", index);
    
    if (this.confirmDeletionOfPlanviewAssociation(mappedRelationship, index)) {
      console.log("passed in project:", mappedRelationship);
      this.mapperService.deletePlanviewAssociation(mappedRelationship).subscribe();
      
      console.log("reflect delete", this.listOfSavedPerviewProjects);
      this.getSavedProjects(this.currentID)
      console.log("said ok");
    }
    else console.log('canceled operation');
  }

  confirmDeletionOfPlanviewAssociation(mappedRelationship: MappedProject, index) {
    console.log('elise yikes...', mappedRelationship);
    
    let decision = confirm(`Warning! This will delete the association created between ${mappedRelationship.projectName} and ${this.listOfSavedPerviewProjects[index].projName}. Are you sure?`);
    if (decision == true) {return true}
  }
  
  deletePerviewProject(perviewProject: SavedProject, index): void {
    console.log("this is the structure mayne::::::",perviewProject);
    console.log("this is the larger stucture though ::::::",this.listOfSavedPerviewProjects);
    if (this.confirmDeletionOfPerviewProject(perviewProject, index)) {
      
        console.log("this is the structure mayne::::::",perviewProject);
      if (perviewProject.planviewProjects  && typeof perviewProject.planviewProjects != 'undefined') {
        perviewProject.planviewProjects.map((mappedRelationship) => {
          this.mapperService.deletePlanviewAssociation(mappedRelationship).subscribe();
        })
      } 
    
      try {
        let filteredListOfProjects = this.listOfSavedPerviewProjects.filter((savedProject) => {
          console.log('COUPLING??',savedProject["projUid"],'vs:::', perviewProject["projUid"]);
          console.log('COUPLING??',typeof (savedProject["projUid"]),'vs:::', typeof(perviewProject["projUid"]));
          let a = savedProject["projUid"]
          let b = perviewProject["projUid"]
          if (a !== b) {
            return true;
          }         
          // if (savedProject.projUid !== perviewProject.Uid) {return true}

        });
        console.log("Cmon seth meyers:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::",filteredListOfProjects);
        //end filter methods stuff
        let id;
        console.log('it gets to this point at least::::this is the perviewProject::::::', perviewProject);
        console.log('making sure i have a good list here:::', this.listOfSavedPerviewProjects);
        
        let updatedListOfSavedProjects: SavedProject[] = filteredListOfProjects;
        console.log('seth meyers weekend update:', updatedListOfSavedProjects);
        
        this.userService.getItemByUserId()
        .pipe(
          takeUntil(this.unSub),
         switchMap((data) => {
            console.log("data is id:",data);
            id = data;
            console.log("data is a id:", data);
            return this.userService.getChangePermissionToken()
          })
          ,switchMap((data) => {
            console.log('want this to be changeToke:', data);
            let changeToken = data;
            return this.myProjectService.deletePerviewProject(this.userService.currentUser,changeToken,id,updatedListOfSavedProjects)
          })
        ).subscribe(
         
          
          () =>  {console.log('this is inside the subscribe function getting ready to get saved projects::::::');this.getSavedProjects(this.currentID)}
         
          // (val) => console.log("what the heck mayne",val)
          );
          console.log('this is right after the subscribe and getting ready to getSaved Projects....');
          
        // this.getSavedProjects(this.currentID);
        
      }
      catch {
        console.log('whelp try did NOT work in delete perview project');
        
      }
    }
    else {console.log('canceled operation');
    }
  }

  OlddeletePerviewProject(perviewProject, index): any {
    if (this.confirmDeletionOfPerviewProject(perviewProject, index)) {
      //deletes all planviewassociations
      try {
        perviewProject.planviewProjects.map((mappedRelationship) => {
          this.mapperService.deletePlanviewAssociation(mappedRelationship).subscribe();
        })
  
      let id;
      console.log('it gets to this point at least::::');
      this.userService.getItemByUserId()
      .pipe(
        // takeUntil(this.unSub),
        switchMap((data) => {
          id = data;
          console.log("data is a id:", data);
          return this.userService.getChangePermissionToken()
        })
        ,switchMap((data) => {
          console.log('want this to be changeToke:', data);
          let changeToken = data;
          return this.myProjectService.deletePerviewProject(this.userService.currentUser,changeToken,id,{})
        })
      ).subscribe();
      this.getSavedProjects(this.currentID);
        
      }
      catch {
        console.log('whelp try did NOT work in delete perview project');
        
      }
    }
    
    else {console.log('canceled operation');
    }
    
  }

  confirmDeletionOfPerviewProject(perviewProject: SavedProject, index) {
    console.log('cmon man:::::what is perviewProject, index and why??', perviewProject, index);
    console.log('cmon man:::::what is perviewProject.planviewProjects and why--looking for a ppl_Code or something??', perviewProject.planviewProjects);
    try {
      let listOfDeletedPlanviewProjects = perviewProject.planviewProjects.map((pair) => {console.log("this is a pair", pair);
      return pair.projectName})
     console.log("what we need",listOfDeletedPlanviewProjects);
     let decision = confirm(
    `Warning! This will delete the associations created  between ${perviewProject.projName} and ${listOfDeletedPlanviewProjects.join()}. Are you sure?`);
     if (decision == true) {return true}
     
    }
    catch {
      let decision = confirm(`Warning! This will delete any associations with ${perviewProject.projName} Are you sure?`);
      if (decision == true) {return true}
     

    }
   
  }


  hidePerviewProjects() {
   return false;
  }

  handleModalClick(perviewProj: SavedProject): void {
    console.log("Do i have what I need?", perviewProj);
    this.selectedProject = perviewProj;
    this.modalService.selection = perviewProj.projUid;
    console.log("so this will be set?",this.selectedProject);
    
  }

  refreshProjectList(event): void {
    console.log('this is running the refresh of list');
    console.log(event, "is there ane vent");
    
    this.getSavedProjects(this.currentID);
  }


}
