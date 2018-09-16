import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { PerviewService } from '../../Services/perview.service';
import { MyProjectService } from '../../Services/project.service';
import { UserService } from '../../Services/user-service.service';
import { MapperService } from '../../Services/mapper.service';
import { IProject, SavedProject } from '../mapper-models';
import { Observable, Subject, from } from 'rxjs';
import { takeUntil, map, tap, switchMap } from 'rxjs/operators';
import { M } from "materialize-css";
import { Router } from '@angular/router';

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
    private mapperService: MapperService,
    private router: Router,
    private renderer: Renderer2
  ) { }

  authorizedProjects: IProject[];
  selectableProjects: IProject[];
  private selectedProjects: IProject[] = [];
  private myProjects$ = new Subject();
  private listOfSavedProjects: any;
  changeDigestToken$: Observable<string>;
  projectsSavedByUser$: Observable<any>
  addProjects$: Observable<any>;
  updateProjects$: Observable<any>
  selected: string = 'selected';
  
  ngOnInit() {
    console.log("on initialization is running...authorizedPerviewProjectsComponent");
    
    this.getPerviewProjects();
    this.getListOfSavedProjects();
    
    // this.myProjects$.next(this.myprojectService.getSavedPerviewProjects(this.userService.currentUser));
    console.log("does this add to the list or what?",this.myProjects$.subscribe());
    // this.changeDigestToken$ = this.userService.getChangePermissionToken();
    // this.projectsSavedByUser$ = this.changeDigestToken$.pipe(
    //   map((data) => {
    //     console.log("data is changeToken:", data);
    //     this.addSelectedProjects(data);
    //   })
    // )
 
  }
  @Input()
  listOfSavedPerviewProjects: SavedProject[];

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
    
      },
  
      owner: {
        title: "Project Manager",
        editable: false
      },
      businessOwner: {
        title: "Business Owner",
        editable: false
      }
      
    },
  
  };
  
  getPerviewProjects(): any {
    this.perviewService.getAuthorizedPerviewProjects()
    .pipe( 
       takeUntil(this.unSub),
       map(((data) => {console.log("this is all authorized projects as data:",data);
      this.authorizedProjects = data  
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
     .subscribe();
  }

  getListOfSavedProjects(): void {
    this.myprojectService.getSavedPerviewProjects(this.userService.currentUser).pipe(
      takeUntil(this.unSub),
      map((data) => {
        console.log("do I have the savedProjects or not??", data);
        this.listOfSavedProjects = data;
      })
    )
    .subscribe( (data) => data);
  }

  addSelectedProjects(): void {
    console.log('modals are a fancy way of saying....');
    
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
      // takeUntil(this.unSub),
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
    )
    .subscribe((val) => {this.getListOfSavedProjects();console.log("so the list will refresh right after close....",val)});
  //prepare for mapping function::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // this.getListOfSavedProjects();
    this.getPerviewProjects();

  }

  
  
  rowClick(event): void {
    console.log('this is the event registering on row click::', event);
    
 
    console.log('selected item for styling', this.selected);
    this.selectProject(event)
   
  }

  selectProject(event: any): void {
    console.log(event["data"]);
       
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

  projectIsSelected(name: string): boolean {
    console.log('running');
    console.log(this.selectedProjects.map(t=>t["projName"]).indexOf(name));
    console.log(this.selectedProjects.map(t=>t["projName"]));
    
    if (this.selectedProjects.map(t=>t["projName"]).indexOf(name) > -1) {
      return true;
    }
  }

  unselectProject(name: any): void {
    console.log('unselect function running');
    
    this.selectedProjects.splice(this.selectedProjects.map(selectedItems => {console.log(selectedItems);selectedItems.projName}).indexOf(name),1)
  }

  clearSelections(): void {
    console.log('clearing selections');
    
    this.selectedProjects = [];
  }
  

  navigateHome(): void {
    this.router.navigate(['/']);
 }

  signalModalClose(): void {
  this.onModalClose.emit('string');
  console.log('signalModalClose has ran');
  this.clearSelections();
  this.smart.grid.dataSet.deselectAll();
  }

}
