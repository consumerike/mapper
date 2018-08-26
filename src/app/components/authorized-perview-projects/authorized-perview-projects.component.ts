import { Component, OnInit, OnDestroy } from '@angular/core';
import { PerviewService } from '../../Services/perview.service';
import { MyProjectService } from '../../Services/project.service';
import { IProject } from '../mapper-models';
import { Observable, Subject, from } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { M } from "materialize-css";
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  authorizedProjects: any[];
  private selectedProjects: any[] = [];
  private myProjects$ = new Subject();
  private listOfSavedProjects: any = [];

  ngOnInit() {
    this.getPerviewProjects();
    this.getListOfSavedProjects();
    this.myProjects$.next(this.myprojectService.getSavedPerviewProjects());
    this.myProjects$.subscribe();
  }

  unSub = new Subject();
  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  } 

  settings = {
    columns: {
      name: {
        title: "Project",
        editable: false
        
      },
      projectManager: {
        title: "Project Manager"
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
       map(((data) => {this.authorizedProjects = data.authorizedProjects;}))
     )
     .subscribe((data) => data)
  }

  getListOfSavedProjects(): void {
    this.myprojectService.getSavedPerviewProjects().pipe(
      takeUntil(this.unSub),
      map( (data) => {
        console.log("do I have the savedProjects?", data);
        
        this.listOfSavedProjects = data;
      })
    )
    .subscribe( (data) => data);
  }

  addSelectedProjects(): void{
    let prepSelections: any = this.selectedProjects.map((selectedProject) => {
      return {"name": selectedProject};
    })
    console.log(this.listOfSavedProjects, "is this a list or not?");
    
    
    let updatedListOfSavedProjects: any[] = [...this.listOfSavedProjects, ...prepSelections];

    this.myprojectService.projectsSavedByUser = updatedListOfSavedProjects;
    // let newStream = from(updatedListOfSavedProjects);
    // this.myprojectService.projectsSavedByUser$ = newStream;
    // this.listOfSavedProjects = []
    
    // let added = this.myProjects$.next(prepSelections);
    // let newStream = this.myProjects$.asObservable();
    // console.log("what is this right now?", this.myProjects$);
    // this.listOfSavedProjects$ = newStream
    // let newStream: Observable<any> = this.myProjects$.next(prepSelections);
    this.myprojectService.userHasSavedProjects = false;
    this.getListOfSavedProjects();
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
    if (this.projectIsSelected(event["data"].name)) {
       this.unselectProject(name)
    }
    else {
      this.selectedProjects.push(event["data"].name);
    }
  }

  projectIsSelected(name: string): boolean {
    if (this.selectedProjects.map(t=>t).indexOf(name) > -1) {
      return true;
    }
  }

  unselectProject(name: string) {
    this.selectedProjects.splice(this.selectedProjects.map(selectedItems => selectedItems).indexOf(name),1)
  }

  clearSelections(){
    this.selectedProjects = [];
  }
  

  navigateHome(){
    this.router.navigate(['/']);
 }

}
