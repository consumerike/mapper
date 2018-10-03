import { Component, OnInit, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import {IProject, Project, SavedProject, MappedProject } from '../components/mapper-models' 
import { CustomErrorHandlerService } from '../Services/custom-error-handler.service';
import { UserService } from "../Services/user-service.service";
import {MyProjectService} from '../Services/project.service'
import { MapperService } from '../Services/mapper.service';
import { Subject, Observable, BehaviorSubject, Subscription, from } from 'rxjs';
import { takeUntil, map, tap, take, switchMap, catchError, finalize } from 'rxjs/operators';
import { M } from "materialize-css";
import { ModalService } from '../Services/modal.service';
import { PerviewService } from '../Services/perview.service';
import { PlanviewService } from '../Services/planview.service';

declare const $: any
declare const window: Window;

@Component({
  selector: 'list-of-mapped-projects',
  templateUrl: './list-of-mapped-project-relationships.component.html',
  styleUrls: ['./list-of-mapped-project-relationships.component.css']
})
export class ListOfMappedProjectRelationshipsComponent implements OnInit, OnDestroy {

 
  selectableProjects: IProject[];
  selectablePlanviewProjects: MappedProject[];
  authorizedProjects: IProject[];
  authorizedPlanviewProjects: MappedProject[];
  constructor(private userService: UserService, private myProjectService: MyProjectService
    ,private mapperService: MapperService, private modalService: ModalService, private errorService: CustomErrorHandlerService,private perviewService: PerviewService
    ,private planviewService: PlanviewService
  ) {}
   //for testing purposes: 
  projects$ = new Subject();
  currentUserID$: Observable<string>
  checkForSavedUser$: Observable<any>
  realSavedProjects$: Observable<any>
  currentID: string;
  userName: string;
  projectSavedByUser$: Observable<any>
  //for reals:   
  // listOfSavedPerviewProjectsSub: Subscription;
  // listOfMappedProjectsSub: Subscription;
  listOfSavedPerviewProjects: SavedProject[];
  mappedProjects: MappedProject[];
  project: SavedProject;
  selectedProject: SavedProject;
  
  errorsPresent: boolean = false;
  errorList: any[];
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
    console.log('THE LIST OF MAPPED PROJECTS IS AT INIT....');
    // this.testSub.next([1,2,3])
    // this.testSub.subscribe( () => {
    //   // you will never see 1,2,3 
    // })
    // this.testSub.next([4,5,6])
    // this.danSavedProjects$ = this.myProjectService.getSavedPerviewProjects();
    try {
        this.currentUserID$ = this.userService.getCurrentUserID();
        this.realSavedProjects$ = this.currentUserID$
        .pipe(
          map((data) =>  {
            console.log('current ID is data right?',data);
            this.currentID = data;
            this.getSavedProjects();
            this.userService.getUserName().pipe(tap(data=> {this.userName = data;})).subscribe();
            }
          )
        );
        this.realSavedProjects$.subscribe(() => this.getSelectablePerviewProjects());
        this.checkForSavedUser$ = this.currentUserID$.pipe(
          map((data) => {
            console.log('checking for saved user...', data);
            
          this.currentID = data;
          this.savedUserCheck(this.currentID)
          })
        );
        this.checkForSavedUser$.pipe().subscribe();
        // this.getSelectablePerviewProjects();
        // this.getSelectablePlanviewProjects();
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
        $(document).ready(function() {
          $('.modal').modal({
            dismissible: false,
            complete: function() {console.log('long live the king', this);}     
          });
        });

        this.errorsPresent = this.determineErrorStatus();
        this.errorList = this.getErrorList();
        console.log("checking the status of errors:",this.errorsPresent, this.errorService.errorList);
        console.log('do i have the projects i need at this point perview selecatble projects',this.selectableProjects);
        
    }
    catch(error){
      this.handleError(error);
    }
  }

  ngOnChanges(){

  }

  handleError(error) :void {
    this.errorService.addError(error);
    this.errorService.setErrorsPresentStatus(true);
  }

  handleErrorQuietly(error): void {
    console.warn(error);
  }


  
  getCurrentUserID(): void {
    try {
      this.userService.getCurrentUserID()
      .pipe(
        takeUntil(this.unSub),
        tap( (data) => {
          console.log('currentID:', data);
          this.currentID = data;
        })
      )
      .subscribe((data) => data);
    }
    catch(err) {
      let errorMessage = new Error('Error: The current user is not being retrieved')
      this.handleError(errorMessage);
    }
   
    
  } 

  savedUserCheck(currentUserID: string): void {
    try {
      this.userService.checkForSavedUser(currentUserID).pipe( takeUntil(this.unSub),).subscribe();
    }
    catch(err) {
      let errorMessage = new Error('Error: Cannot find your user profile')
      this.handleError(errorMessage);
    }
  }

  getSavedProjects(): void {
   try {
    
      this.myProjectService.getSavedPerviewProjects(this.currentID)
      .pipe(
        takeUntil(this.unSub),
        map( (data) => {
        this.listOfSavedPerviewProjects = data;
        console.log("after updating does getSavedProjects() in listComponent work?", this.listOfSavedPerviewProjects);
        
        this.getPlanviewAssociations(this.listOfSavedPerviewProjects)
      }),
        catchError((err) => {
          console.log('in observable catchError()',err);
          let errorMessage = new Error("Error: Did not successfully get saved perview projects ....")
          this.handleError(errorMessage);
          throw errorMessage;
        }),
        finalize(()=>{this.updateChanges();})
      )
      .subscribe((data) => { 
        this.errorsPresent = this.determineErrorStatus();
        this.getErrorList();
        console.log(this.listOfSavedPerviewProjects.length,this.listOfSavedPerviewProjects,"i data not projects?", data);
                
        if(this.listOfSavedPerviewProjects.length === 0) {
          // this.userService.checkForSavedUser(this.userService.currentUser).subscribe();
          console.log('this always runs...');
          
        }
        else {
          console.log('shut up please.')
        }
      },(err)=>{this.handleError(err);console.log(err,'how have i rory');this.errorsPresent= true; this.errorList[0]= err; this.updateChanges();
      });
  }
  catch(err) {
    let errorMessage = new Error('Error: Cannot display saved projects')
    this.handleError(errorMessage);
  }
 }

  getPlanviewAssociations(projects: SavedProject[]): void  {
    try {
      this.mapperService.getMappedPlanviewAssociations(projects)
    }
    catch(err) {
      let errorMessage = new Error('Error: Cannot display Planview Associations(1)')
      this.handleError(errorMessage);
    }
      
  }


  getListOfPlanviewMappedProjects(): void {
    try {
      this.mapperService.perviewMappedPlanviewAssociations(this.project)
      .pipe(takeUntil(this.unSub))
      .subscribe((data) => {console.log(`What's the data?`, data)
        this.errorsPresent = this.determineErrorStatus();
      })
    }
    catch(err) {
      let errorMessage = new Error('Error: Cannot display Planview Associations(2)')
      this.handleError(errorMessage);
    }

  }
  

  deletePlanviewAssociation(mappedRelationship: MappedProject, index): any {
    console.log(mappedRelationship,"oh crap:", index);
    try {
      
      if (this.confirmDeletionOfPlanviewAssociation(mappedRelationship, index)) {
        console.log("passed in project:", mappedRelationship);
        this.errorService.clearErrorList();
        this.mapperService.deletePlanviewAssociation(mappedRelationship).subscribe();
        
        console.log("reflect delete", this.listOfSavedPerviewProjects);
        this.getSavedProjects()
        console.log("said ok");
      }
      else console.log('canceled operation');
    }
    catch(err) {
      let errorMessage = new Error('Error: Did not succesfully delete Planview Association')
      this.handleError(errorMessage);
      this.getSavedProjects();
    }
  }

  confirmDeletionOfPlanviewAssociation(mappedRelationship: MappedProject, index) {
    try {
      console.log('ghello mappy relationship...', mappedRelationship);
      
      let decision = confirm(`Warning! This will delete the association created between ${mappedRelationship.projectName} and ${this.listOfSavedPerviewProjects[index].projName}. Are you sure?`);
      if (decision == true) {return true}
    }
    catch(err) {
      let errorMessage = new Error('Error: could not confirm deletion of planview association')
      this.handleError(errorMessage);
    }
  }
  
  deletePerviewProject(perviewProject: SavedProject, index): void {
    console.log("this is the structure mayne::::::",perviewProject);
    console.log("this is the larger stucture though ::::::",this.listOfSavedPerviewProjects);
    if (this.confirmDeletionOfPerviewProject(perviewProject, index)) {
      this.errorService.clearErrorList();
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
        console.log('it gets to this point at least::::this is the perviewProject::::::', perviewProject);
        console.log('making sure i have a good list here:::', this.listOfSavedPerviewProjects);
        
        let updatedListOfSavedProjects: SavedProject[] = filteredListOfProjects;
        console.log('seth meyers weekend update:', updatedListOfSavedProjects);
        
        let id;
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
          }),
          catchError((err) => {
            console.log('in observable catchError()',err);
            let errorMessage = new Error("Error: Did not successfully delete perview project ....")
            this.handleError(errorMessage);
            throw errorMessage;

          })).subscribe(
         
          
          () =>  {console.log('this is inside the subscribe function getting ready to get saved projects::::::', this.listOfSavedPerviewProjects);this.refreshProjectList(event);}
          
          // (val) => console.log("what the heck mayne",val)
          );
          console.log('this is right after the subscribe and getting ready to getSaved Projects....');
          
        // this.getSavedProjects(this.currentID);
        
      }
      catch (err) {
        console.log('toronto');
        
       let errorMessage = new Error('Error: Did not delete PerView project successfully')
       this.handleError(errorMessage);
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

  getSelectablePerviewProjects(): void {
    console.log('when is swedish fish running??');
    
    try {
      this.perviewService.getAuthorizedPerviewProjects()
      .pipe( 
         takeUntil(this.unSub),
         tap((data)=>{this.authorizedProjects = data;}),
         map(((data) => {console.log("this is all authorized projects as data:",data);  
          let filteredAuthorizedProjects = this.authorizedProjects.filter((project) => {
          if(this.listOfSavedPerviewProjects.map(savedProject => savedProject.projUid.toLowerCase()).indexOf(project.projUid.toLowerCase()) < 0) {
           return project;
          }
        })
        console.log("filteredAuthorizedProjects data is here:",filteredAuthorizedProjects);
        
        this.selectableProjects = filteredAuthorizedProjects;
        console.log('the selectable projects are:', this.selectableProjects);
        return this.selectableProjects;}))
          // return this.authorizedProjects = data;}))
       )
      //  .subscribe((data)  => {console.log('selectable projects in subscribe is the data:', data);this.selectableProjects = data;return data} )
       .subscribe(
         (data)=>{console.log('looking to see when this runs...?', this.selectableProjects=data);}
         
       );
    }
    catch(err) {
      let errorMessage = new Error('Error: Could not display authorized PerView projects successfully')
      this.handleError(errorMessage);
      throw errorMessage;
     }
     

  }

     

  getSelectablePlanviewProjects() {
    try {
      console.log("getPlanViewProjects in authorized planview projects component is running...");
      
      this.planviewService.getAuthorizedPlanviewProjects()
      .pipe( 
         takeUntil(this.unSub),
         map( (data) => {  this.authorizedPlanviewProjects = data;console.log('all pv projects',this.authorizedPlanviewProjects);
           let filteredAuthorizedPlanviewProjects = this.authorizedPlanviewProjects.filter((planviewProject)=> {
             console.log('one and the same ni',this.selectedProject,'planview project tho', planviewProject);
             ;
             
             if(this.selectedProject.planviewProjects.map(savedPlanviewProject => savedPlanviewProject.projectName.toLowerCase()).indexOf(planviewProject.name.toLowerCase()) < 0) {
               return planviewProject;
             }
           })
           this.selectablePlanviewProjects = filteredAuthorizedPlanviewProjects;
           console.log("this go around",this.selectablePlanviewProjects);
           
           return this.selectablePlanviewProjects;
         })
       )
       .subscribe((data) => {console.log('typical Tuesday PM',this.selectablePlanviewProjects);this.selectablePlanviewProjects = data;}
       )
    }
    catch (err) {
      console.log('we are inside the catch for get selectablePlanviewProjects:');
      
      let errorMessage = new Error('Error: Did not successfully display Planview projects for selection')
      this.handleError(errorMessage);
      return this.authorizedPlanviewProjects;
     }   
  }
  

  handleModalClick(perviewProj: SavedProject): void {
    console.log("Do i have what I need?", perviewProj);
    this.selectedProject = perviewProj;
    this.modalService.selection = perviewProj.projUid;
    console.log("so this will be set?",this.selectedProject);
    this.getSelectablePlanviewProjects();
  }


  refreshProjectList(event): void {
    console.log(event);
    
    
    try {
    this.updateChanges();
    this.getSavedProjects();
    this.getSelectablePerviewProjects();
    this.getSelectablePlanviewProjects();
    
    }
    catch (err) {
      let errorMessage = new Error('Error:Projects Did not successfully update.')
      this.handleError(errorMessage);
     }
  }

  updateChanges(): any {
    console.log('update changes is running...');
    
    try {
      this.determineErrorStatus();
      console.log(this.getErrorList());
      
      this.getErrorList();
    }
   
   
    catch(err) {
      console.log('catching error...', err);
      let errorMessage = new Error('Error: Your changes may have failed to update')
      this.handleErrorQuietly(errorMessage);
    }
    // this.mapperService.updateData();
    
  }
  
  determineErrorStatus(): boolean {
    let errStatusAsBoolean = this.errorService.getErrorsPresentStatus();
    console.log(this.errorsPresent);
    
    return errStatusAsBoolean;
  }

  getErrorList(): any[] {
    console.log(
    'get error list is running');
    this.errorList = this.errorService.getErrorList();
    return this.errorList;
  }


}
