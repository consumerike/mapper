import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { PlanviewService } from '../../Services/planview.service';
import { ModalService } from '../../Services/modal.service';
import { MyProjectService } from '../../Services/project.service';
import { IProject } from '../mapper-models';
import { Observable } from 'rxjs';
import { Subject, BehaviorSubject } from 'rxjs';
import { MapperService } from '../../Services/mapper.service';

import { takeUntil, map, tap, take } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Directive, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-authorized-planview-projects',
  templateUrl: './authorized-planview-projects.component.html',
  styleUrls: ['./authorized-planview-projects.component.scss']
})
export class AuthorizedPlanviewProjectsComponent implements OnInit, OnDestroy {

  constructor(private planviewService: PlanviewService,
    private myprojectService: MyProjectService,
    private mapperService: MapperService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService
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
    this.perviewProject = this.modalService.selection;
    console.log("did the input() work this time??",this.perviewProject);
    console.log('after selection:', this.perviewProject);
    
    // this.route.params.subscribe((params: Params) => this.perviewProject = params["project.uid"]);        
    // this.handleModalClick(this.projectUID);
  }
  
  // @Input()
  // projectUID: any;  
  unSub = new Subject<void>();
  
  @Input()
  selectedProjectUID: any;
  @Output()
  onPlanviewModalClose = new EventEmitter<string>()

  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  }

  settings = {
    selectMode: 'multi',
    columns: {
      name: {
        title: "Project Name"
      },
     /* We need these fields: Project Name (above); Project Manager, and Business Owner
     ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
     ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      // name: {
      //   title: "Project Manager"
      // },
      // name: {
      //   title: "Business Owner"
      // },
      :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      */
     
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
    //working on this :::::::::
      // return savedPerviewProjects.map((perProj) => {
      //   return this.perviewMappedPlanviewAssociations(perProj).subscribe()
      // })

    console.log('ike has handles', this.modalService.selection);
    
    
    //end working on this:::::::
    
    let prepSelections: any[] = this.prepareForMapping();
    // let updatedListofMappedProjects: any[] = [...this.listOfMappedProjects, ...prepSelections];
    prepSelections.map((mappedProject) => {
      console.log('making audibles::', mappedProject, mappedProject.Uid, mappedProject.UID);
      console.log("is this the projectUID?",this.perviewProject);
      console.log("is this the selection?",mappedProject);
      
      this.mapperService.addSingleMappedPlanviewProject(this.modalService.selection,mappedProject).subscribe()
    })
    // console.log("this is the updatedlist:",updatedListofMappedProjects);
    // this.mapperService.mappedProjects = updatedListofMappedProjects
    // console.log("is harley quinn in the mapped projects?", this.mapperService.mappedProjects);
    
    //NEED TO UPDATE DATA AT SOME POINT
    this.clearSelections();
  }
 

  prepareForMapping(): any[] {
    let prepSelections: any = this.selectedProjects.map((selectedProject) => {
      let formattedSelectedProject = Object.assign({projectName:selectedProject.name, ppl_code:selectedProject.ppl_Code },{})
      console.log("correct format check for mappedPlanViewProj:", formattedSelectedProject);
      return formattedSelectedProject;
    })
    console.log('prepSchool:', prepSelections);
    
    
    return prepSelections;
  }

  rowClick(event){
   
    
    this.selectProject(event);
    console.log(event, "this is the row click.....", "these are selected:", this.selectedProjects);
  }

  selectProject(event: object) {
    console.log('what it is yo:', event["data"]);
    
    if (this.projectIsSelected(event["data"].ppl_Code)) {
       this.unselectProject(event["data"].ppl_Code);
    }
    else {
      this.selectedProjects.push(event["data"]);
    }
  }

  projectIsSelected(ppl_Code: string): boolean {
    console.log('running man');
    console.log('selction::', this.selectedProjects);
    
    console.log('next',this.selectedProjects.map(t=>t["ppl_Code"]).indexOf(ppl_Code));
    console.log('yo',this.selectedProjects.map(t=>t["ppl_Code"]));

    if (this.selectedProjects.map(t=>t["ppl_Code"]).indexOf(ppl_Code) > -1) {
      return true;
    }
  }

  unselectProject(ppl_Code: string) {
    console.log('unselect func');
    
    this.selectedProjects.splice(this.selectedProjects.map(selectedItems => selectedItems.ppl_Code).indexOf(ppl_Code),1)
  }

  clearSelections() {
    this.selectedProjects = [];
    console.log('selections cleared.');
    
  }

  navigateHome(){
     this.router.navigate(['/']);
  }

  
  signalModalClose() {   
    this.onPlanviewModalClose.emit('string');
    this.clearSelections();
    console.log('signalModalClose-planview has ran');
  }
  

}

