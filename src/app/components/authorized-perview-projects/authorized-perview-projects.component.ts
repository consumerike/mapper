import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { PerviewService } from '../../Services/perview.service';
import { MyProjectService } from '../../Services/project.service';
import { UserService } from '../../Services/user-service.service';
import { MapperService } from '../../Services/mapper.service';
import { IProject, SavedProject } from '../mapper-models';
import { Observable, Subject, from } from 'rxjs';
import { takeUntil, map, tap, switchMap, delay, catchError, finalize } from 'rxjs/operators';
import { M } from "materialize-css";
import { Router, ActivatedRoute } from '@angular/router';
import { CustomErrorHandlerService } from '../../Services/custom-error-handler.service';
import { ModalService } from '../../Services/modal.service';
import { UtilityService } from '../../Services/utility.service';

declare const $: any
declare const window: Window;

@Component({
  selector: 'app-authorized-perview-projects',
  templateUrl: './authorized-perview-projects.component.html',
  styleUrls: ['./authorized-perview-projects.component.scss']
})
export class AuthorizedPerviewProjectsComponent implements OnInit, OnDestroy {

  @ViewChild('smart') smart;
  constructor(private perviewService: PerviewService,
    private myprojectService: MyProjectService,
    private userService: UserService,
    private utilityService: UtilityService,
    private mapperService: MapperService,
    private router: Router,
    private route: ActivatedRoute,
    private errorService: CustomErrorHandlerService,
    public modalService: ModalService
  ) { }

  authorizedProjects: IProject[];
 
  private selectedProjects: IProject[] = [];
  private myProjects$ = new Subject();
  private listOfSavedProjects: any;
  changeDigestToken$: Observable<string>;
  projectsSavedByUser$: Observable<any>
  addProjects$: Observable<any>;
  updateProjects$: Observable<any>
  selected: any = 'selected';

  showSpinner: boolean = this.utilityService.showSpinner;
  
  ngOnInit() {
    console.log("on initialization is running...authorizedPerviewProjectsComponent");
    
    // this.getPerviewProjects();
    // this.getListOfSavedProjects();
    
    // this.myProjects$.next(this.myprojectService.getSavedPerviewProjects(this.userService.currentUser));
    console.log("does this add to the list or what?",this.myProjects$.subscribe());
    // this.changeDigestToken$ = this.userService.getChangePermissionToken();
    // this.projectsSavedByUser$ = this.changeDigestToken$.pipe(
    //   map((data) => {
    //     console.log("data is changeToken:", data);
    //     this.addSelectedProjects(data);
    //   })
    // )
   this.selected = this.route.snapshot.data;
   console.log('this is the exclusive', this.selected, this.route.snapshot.data.selectablePerviewProjects);
   console.log('you people');
   console.log('showspinnger status:', this.modalService.showSpinner);
   
   
  }


  handleError(error) :void {
    this.errorService.addError(error);
    this.errorService.setErrorsPresentStatus(true);
  }

  handleErrorQuietly(error): void {
    console.warn(error);
  }

  @Input()
  listOfSavedPerviewProjects: SavedProject[];
  @Input()
  selectableProjects: IProject[];
 

  @Output()
  onModalClose = new EventEmitter();

  unSub = new Subject();
  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  } 
  
  
  settings = {
    selectMode: 'multi',  
    actions: {
      add: false,
      edit: false,
      delete: false

    },

    
    columns: {

      projName: {
        title: "Project",
        editable: false,
        width: '40%'
    
      },
  
      owner: {
        title: "Project Manager",
        editable: false,
        width: '30%'
      },
      businessOwner: {
        title: "Business Owner",
        editable: false,
        width: '30%'
      }
      
    },
  
  };
  
  getPerviewProjects(): void {
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
         (data)=>{console.log('looking to see when this runs...?', data);}
         
       );
    }
    catch(err) {
      let errorMessage = new Error('Error: Could not display authorized PerView projects successfully')
      this.handleError(errorMessage);
     }
  }

  getListOfSavedProjects(): void {
    try {
      this.myprojectService.getSavedPerviewProjects(this.userService.currentUser).pipe(
        takeUntil(this.unSub),
        map((data) => {
          console.log("do I have the savedProjects or not??", data);
          this.listOfSavedProjects = data;
        })
      )
      .subscribe( (data) => data);
    }
    catch (err) {
      let errorMessage = new Error('Error: Failed to get list of saved projects for filtering to selectable projects')
      this.handleErrorQuietly(errorMessage);
     }
  }

  addSelectedProjects(): void {
    this.errorService.clearErrorList();
    this.utilityService.setSpinner(true);
    try {
      let prepSelections: SavedProject[] = this.selectedProjects.map((selectedProject) => {
        let formatedSelectedProject: SavedProject = Object.assign({projUid:selectedProject.projUid, projName: selectedProject.projName}
          ,{})
          console.log("is this correct format?",formatedSelectedProject);
          
        return formatedSelectedProject
      })
      console.log('preppy', prepSelections);
  
      let id;
      console.log('it gets to this point at least::::good list from listOfSavedProjects:', this.listOfSavedProjects);
      console.log('making sure i have a good list here from input():::', this.listOfSavedPerviewProjects);
      console.log("i'm trying to add this list, correct??",prepSelections);
  
      //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: BREAK OUT INTO OWN FUNCTION PROBABLY....
      prepSelections.map((selectedProject) => {
        //GET project successfully or receive 404 error.
        //If 404 error then map the project here
        //otherwise continue....
        this.mapperService.checkPerviewProjectMapStatus(selectedProject).subscribe();
      })
      //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: BREAK INTO OWN FUNCTION PROBABLY.....
      let updatedListOfSavedProjects: SavedProject[] = [...this.listOfSavedPerviewProjects, ...prepSelections];
      
      console.log('what is the updatedList for the good body: ', updatedListOfSavedProjects);
      
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
          return this.myprojectService.addPerviewSelectedProjectstoWorkspace(this.userService.currentUser,changeToken,id,updatedListOfSavedProjects)
        })
        ,catchError(err => {
          console.log('in observable catchError()',err);
          let errorMessage = new Error("Error: Did not successfully add perview project")
          this.handleError(errorMessage);
       
          throw errorMessage;
        })
        ,finalize(()=>{this.signalModalClose();} )
      )
      .subscribe((val) => {
        this.clearSelections(); this.hideSpinner();
        this.getListOfSavedProjects();  this.signalModalClose(); this.getPerviewProjects();                
      });
  
      this.getPerviewProjects();
    }
    catch (err) {
      let errorMessage = new Error('Error: Did not successfully add PerView project')
      this.handleError(errorMessage);
     }
        
  }
  
  getSpinnerStatus(): boolean {
    return this.utilityService.getSpinnerStatus();
  }

  hideSpinner(): void {
    this.utilityService.hideSpinner();
  }
  
  rowClick(event): void {
    try {
      console.log('this is the event registering on row click::', event);
      console.log('selected item for styling', this.selected);
      this.selectProject(event)
    }
    catch (err) {
      let errorMessage = new Error('Error: Experiencing row click in selection issues')
      this.handleErrorQuietly(errorMessage);
     }
   
  }

  selectProject(event: any): void {
    console.log(event["data"]);
    try {
      if (this.projectIsSelected(event["data"].projName)) {
         this.unselectProject(event["data"].projName)
        //  this.renderer.removeClass(event.target, this.selected)
      }
      else {
        this.selectedProjects.push(event["data"]);
        console.log("current selected projects are:", this.selectedProjects);
        
        // this.renderer.addClass(event.target, this.selected)
      }
    }
    catch (err) {
      let errorMessage = new Error('Error: Experiencing select project issues')
      this.handleErrorQuietly(errorMessage);
     }   
  }

  projectIsSelected(name: string): boolean {

    console.log('running');
    console.log(this.selectedProjects.map(t=>t["projName"]).indexOf(name));
    console.log(this.selectedProjects.map(t=>t["projName"]));
    try {
      if (this.selectedProjects.map(t=>t["projName"]).indexOf(name) > -1) {
        return true;
      }
    }
    catch (err) {
      let errorMessage = new Error('Error: Experiencing ProjectIsSelected() issues')
      this.handleErrorQuietly(errorMessage);
     }   
  }

  unselectProject(name: any): void {
    console.log('unselect function running');
    try {
      this.selectedProjects.splice(this.selectedProjects.map(selectedItems => {console.log(selectedItems);selectedItems.projName}).indexOf(name),1)
    }
    catch (err) {
      let errorMessage = new Error('Error: Experiencing unselectProject() issues')
      this.handleErrorQuietly(errorMessage);
     }   
  }

  clearSelections(): void {
    console.log('clearing selections');
    try {
      this.selectedProjects = [];
    }
    catch (err) {
      let errorMessage = new Error('Error: Experiencing clear selection issues')
      this.handleErrorQuietly(errorMessage);
     }   
  }
  
  navigateHome(): void {
    this.router.navigate(['/']);
  }
  


  signalModalClose(): void {
    try {
      console.log('this signalModalClose function is running....');
      this.onModalClose.emit();
      console.log('signalModalClose has ran');
      this.clearSelections();
      this.smart.grid.dataSet.deselectAll();
      this.getPerviewProjects();
    
        /* Want to implement clearing of filtering on selection here....
      // this.source.reset();
      // this.source.setFilter([],true,false);
      // this.source.setSort([],false)
      // this.source.setPage(1)
      // this.source.refresh();
    */
   
    }
    catch (err) {
      let errorMessage = new Error('Error: Did not delete PerView project successfully')
      this.handleError(errorMessage);
     }
  }

}
