import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PlanviewService } from '../../Services/planview.service';
import { MyProjectService } from '../../Services/project.service';
import { IProject } from '../mapper-models';
import { Observable } from 'rxjs';
import { Subject, BehaviorSubject } from 'rxjs';
import { MapperService } from '../../Services/mapper.service';

import { takeUntil, map, tap, take } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-authorized-planview-projects',
  templateUrl: './authorized-planview-projects.component.html',
  styleUrls: ['./authorized-planview-projects.component.css']
})
export class AuthorizedPlanviewProjectsComponent implements OnInit, OnDestroy {

  constructor(private planviewService: PlanviewService,
    private myprojectService: MyProjectService,
    private mapperService: MapperService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  authorizedProjects: any[];
  private selectedProjects: any[] = [];
  private selectedProjects$: Observable<any>
  private myProjects: any[];
  private perviewProject: any;
  private listOfMappedProjects: any;

  ngOnInit() {
    this.getPlanviewProjects();
    // this.getListofMappedProjects();
    this.route.params.subscribe((params: Params) => this.perviewProject = params["project.uid"]);        
    // this.handleModalClick(this.projectUID);
    
  }
  
  // @Input()
  // projectUID: any;  
  unSub = new Subject<void>();

  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  }

  settings = {
    
    columns: {
      name: {
        title: "Project Name"
      },
      ppl_Code: {
        title: "ID"
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
     
    },
    
  };  


  getPlanviewProjects(): void {
    this.planviewService.getAuthorizedPlanviewProjects()
    .pipe( 
       takeUntil(this.unSub),
       map(((data) => {  this.authorizedProjects = data;}))
     )
     .subscribe((data) => data)
  }

  //NO LONGER IN USE:
  // getListofMappedProjects(): void {
  //   this.mapperService.getMappedProjects().pipe(
  //     takeUntil(this.unSub),
  //     map( (data) => {
  //       console.log("do I have the mappedProjects?", data);

  //       this.listOfMappedProjects = data;
  
  //     })
  //   )
  //   .subscribe((data) => data);
  // }

  handleModalClick(perviewProj): void {
    console.log("Do i have all i need?", perviewProj);
    
    // this.projectUID = perviewProj;
  }

  addSelectedProjects(): void {
    // let prepSelections: any = this.selectedProjects.map((selectedProject) => {
    //   return {"uid": this.perviewProject, "ppl_code": selectedProject};
    // })
    // console.log("getting input", this.projectUID);
    
    
    let prepSelections: any[] = this.prepareForMapping();
    let updatedListofMappedProjects: any[] = [...this.listOfMappedProjects, ...prepSelections];
    console.log("this is the updatedlist:",updatedListofMappedProjects);
    this.mapperService.mappedProjects = updatedListofMappedProjects
    console.log("is harley quinn in the mapped projects?", this.mapperService.mappedProjects);
    
    this.mapperService.updateData();
    this.clearSelections();
  }

  prepareForMapping(): any[] {
    let prepSelections: any = this.selectedProjects.map((selectedProject) => {
      return {"uid": this.perviewProject, "ppl_code": selectedProject};
    })
    console.log("preppedselects:",prepSelections);
    
    return prepSelections;
  }

  rowClick(event){
   
    
    this.selectProject(event);
    console.log(event, "this is the row click.....", "these are selected:", this.selectedProjects);
  }

  selectProject(event: object) {
    if (this.projectIsSelected(event["data"].ppl_code)) {
       this.unselectProject(event["data"].ppl_code);
    }
    else {
      this.selectedProjects.push(event["data"].ppl_code);
    }
  }

  projectIsSelected(ppl_code: string): boolean {
    if (this.selectedProjects.map(t=>t).indexOf(ppl_code) > -1) {
      return true;
    }
  }

  unselectProject(ppl_code: string) {
    this.selectedProjects.splice(this.selectedProjects.map(selectedItems => selectedItems).indexOf(ppl_code),1)
  }

  clearSelections(){
    this.selectedProjects = [];
  }

  navigateHome(){
     this.router.navigate(['/']);
  }
  

}

