import { Component, OnInit, OnDestroy } from '@angular/core';
import { PerviewService } from '../../Services/perview.service';
import { MyProjectService } from '../../Services/project.service';
import { IProject } from '../mapper-models';
import { Observable, Subject, from } from 'rxjs';
import { takeUntil, map, tap, switchMap } from 'rxjs/operators';
import { M } from "materialize-css";
import { Router } from '@angular/router';
import { UserService } from '../../Services/user-service.service';
import { currentId } from 'async_hooks';

declare const $: any
declare const window: Window;

   
@Component({
  selector: 'app-authorized-perview-projects',
  templateUrl: './authorized-perview-projects.component.html',
  styleUrls: ['./authorized-perview-projects.component.css']
})
export class AuthorizedPerviewProjectsComponent implements OnInit, OnDestroy {

  constructor(private perviewService: PerviewService,
    private myprojectService: MyProjectService,
    private userService: UserService,
    private router: Router
  ) { }

  authorizedProjects: any[];
  private selectedProjects: any[] = [];
  private myProjects$ = new Subject();
  private listOfSavedProjects: any = [];
  changeDigestToken$: Observable<string>;
  projectsSavedByUser$: Observable<any>
  addProjects$: Observable<any>;
  updateProjects$: Observable<any>
  
  ngOnInit() {
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

  unSub = new Subject();
  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  } 

  settings = {
    // selectMode: 'multi',
    columns: {
      projName: {
        title: "Project",
        editable: false
        
      },
  
      owner: {
        title: "Business Owner",
        editable: false
      }
      
    },
    actions: {
      add: false,
      edit: false,
      delete: false,

    }
  };
  
  getPerviewProjects(): void {
    this.perviewService.getAuthorizedPerviewProjects()
    .pipe( 
       takeUntil(this.unSub),
       map(((data) => {console.log(data);
        this.authorizedProjects = data;}))
     )
     .subscribe((data) => data)
  }

  getListOfSavedProjects(): void {
    this.myprojectService.getSavedPerviewProjects(this.userService.currentUser).pipe(
      takeUntil(this.unSub),
      map( (data) => {
        console.log("do I have the savedProjects?", data);
        this.listOfSavedProjects = data;
      })
    )
    .subscribe( (data) => data);
  }

  addSelectedProjects(changeToken: any): void {  
    let prepSelections: any = this.selectedProjects.map((selectedProject) => {
      let formatedSelectedProject = Object.assign({projUid:selectedProject.projUid, projName: selectedProject.projName}
        ,{})
        console.log("is this correct format?",formatedSelectedProject);
        
      return formatedSelectedProject
    })
    console.log('preppy', prepSelections);
    this.userService.getChangePermissionToken()
    .pipe(
      switchMap((data) => { console.log("data is a changeToken:", data)
        let changeToken = data;
        return this.myprojectService.addPerviewSelectedProjectstoWorkspace(changeToken,this.userService.currentUser,prepSelections)
      })
    )
    .subscribe(() => console.log('did it happen or what')
    );
    // this.addProjects$.subscribe();
    // this.updateProjects$ = this.addProjects$.pipe(
    //   tap(data => this.myprojectService.getSavedPerviewProjects(this.userService.currentUser))

    // );
    // this.updateProjects$.subscribe();
       
    // this.myProjects$.next(prepSelections);
    // console.log("how do you like me now??", this.myProjects$.subscribe(), "without subscription:", this.myProjects$);
    // this.myProjects$.pipe(map(data => console.log("PLEASE", data)))
    
   // let updatedListOfSavedProjects: any[] = [...this.listOfSavedProjects, ...prepSelections];

    //his.myprojectService.projectsSavedByUser = updatedListOfSavedProjects;
    // let newStream = from(updatedListOfSavedProjects);
    // this.myprojectService.projectsSavedByUser$ = newStream;  
    // this.listOfSavedProjects = []
    // let added = this.myProjects$.next(prepSelections);
    // let newStream = this.myProjects$.asObservable();
    // console.log("what is this right now?", this.myProjects$);
    // this.listOfSavedProjects$ = newStream
    // let newStream: Observable<any> = this.myProjects$.next(prepSelections);
    //this.myprojectService.userHasSavedProjects = false;
    // this.myprojectService.getSavedPerviewProjects(this.userService.currentUser);
    console.log(this.listOfSavedProjects, "is this a list or not?");
    this.clearSelections();
    console.log("updatedListofSavedProjects:",this.myprojectService.projectsSavedByUser);
  
    // this.myprojectService.getSavedPerviewProjects().subscribe((data)=> console.log('did this work??',data)
    // );
    // console.log(this.listOfSavedProjects$.map(data => console.log(data)).subscribe());
  }
  
  rowClick(event){
    
    this.selectProject(event);
    console.log("these are selected:", this.selectedProjects);
  }

  selectProject(event: object) {
    console.log(event["data"]);
    
    if (this.projectIsSelected(event["data"].projName)) {
       this.unselectProject(event["data"].projName)
    }
    else {
      this.selectedProjects.push(event["data"]);
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

  unselectProject(name: string) {
    console.log('unselcetfunction running');
    
    this.selectedProjects.splice(this.selectedProjects.map(selectedItems => {console.log(selectedItems);selectedItems.projName}).indexOf(name),1)
  }

  clearSelections(){
    this.selectedProjects = [];
  }
  

  navigateHome(){
    this.router.navigate(['/']);
 }

}
