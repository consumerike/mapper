import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, AfterViewChecked } from '@angular/core';
import { PlanviewService } from '../../Services/planview.service';
import { ModalService } from '../../Services/modal.service';
import { MyProjectService } from '../../Services/project.service';
import { IProject, Project, MappedProject, PlanviewProject } from '../mapper-models';
import { Observable } from 'rxjs';
import { Subject, BehaviorSubject } from 'rxjs';
import { MapperService } from '../../Services/mapper.service';

import { takeUntil, map, tap, take, catchError, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Directive, Renderer2, ElementRef } from '@angular/core';
import { CustomErrorHandlerService } from '../../Services/custom-error-handler.service';
import { LocalDataSource } from 'ng2-smart-table';
import { UserService } from '../../Services/user-service.service';
import { UtilityService } from '../../Services/utility.service';

@Component({
  selector: 'app-authorized-planview-projects',
  templateUrl: './authorized-planview-projects.component.html',
  styleUrls: ['./authorized-planview-projects.component.scss']
})
export class AuthorizedPlanviewProjectsComponent implements OnInit, AfterViewChecked, OnDestroy {
 
  @ViewChild('smart') smart;
  constructor(private planviewService: PlanviewService,
    private userService: UserService,
    private utilityService: UtilityService,
    private myprojectService: MyProjectService,
    private mapperService: MapperService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private errorService: CustomErrorHandlerService
  ) { }
  
  authorizedProjects: PlanviewProject[];
  private selectedProjects: any[] = [];
  private perviewProject: string;

  @Input()
  selectablePlanviewProjects: PlanviewProject[]
  
  @Output()
  onPlanviewModalClose = new EventEmitter<string>()

  private source: LocalDataSource

  ngOnInit() {
    // this.getPlanviewProjects();
    // this.getListofMappedProjects();
    this.perviewProject = this.modalService.selection;
    console.log("did the input() work this time??",this.perviewProject);
    console.log('after selection:', this.perviewProject);
    // this.getPlanviewProjects();
    // this.source = new LocalDataSource(this.selectablePlanviewProjects)  
 

  
    
    

    
    // this.route.params.subscribe((params: Params) => this.perviewProject = params["project.uid"]);        
    // this.handleModalClick(this.projectUID);
  }

  ngAfterViewChecked(): void {
    this.setPlanviewSearchHints();
  }

  handleError(error) :void {
    this.errorService.errorList.push(error);
    this.errorService.errorsPresent = true;
  }

  handleErrorQuietly(error): void {
    console.warn(error);
  }
  

  unSub = new Subject<void>();
  
 

  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
  }

  settings = {
    selectMode: 'multi',
    columns: {
      name: {
        title: "Project",
        filter: {
          descriptionField: 'search Project'
        }
      },
      proj_mgr: {
        title: "Project Manager"
      },
      projectSponsor: {
        title: "Business Owner"
      },     
      plan_id: {
        title: "Planview ID"
      }
    },

    actions: {
      add: false,
      edit: false,
      delete: false,
     
    },

  };  

  getPlanviewProjects(): void {
    try {
      console.log("getPlanViewProjects in authorized planview projects component is running...");
      
      this.planviewService.getAuthorizedPlanviewProjects()
      .pipe( 
         takeUntil(this.unSub),
         map(((data) => {  this.authorizedProjects = data;console.log('tiger woods',this.authorizedProjects);
           this.selectablePlanviewProjects = data;
         }))
       )
       .subscribe((data) => data)
    }
    catch (err) {
      let errorMessage = new Error('Error: Did not successfully display Planview projects for selection')
      this.handleError(errorMessage);
     }   
  }

  handleModalClick(perviewProj): void {
    try {
      console.log("Do i have all i need?", perviewProj);
    }
    catch(err) {
      let errorMessage = new Error('Error: issues with handleModalClick()')
      this.handleErrorQuietly(errorMessage);
     }   
  }

  addSelectedProjects(): void {
    console.log('ike has handles', this.modalService.selection);
    this.errorService.clearErrorList();
    try {
      let prepSelections: MappedProject[] = this.prepareForMapping();
      // let updatedListofMappedProjects: any[] = [...this.listOfMappedProjects, ...prepSelections];
      prepSelections.map((mappedProject) => {
        console.log('making audibles::::exactly:::::', mappedProject)
        console.log("is this the projectUID?",this.perviewProject);
        console.log("is this the selection?",mappedProject);
        
        this.mapperService.addSingleMappedPlanviewProject(this.modalService.selection,mappedProject)
        .pipe(
          catchError((err)=> {
            let errorMessage = new Error('Error: Did not successfully add Planview project.  Please contact your PerView administrator')
            this.handleError(errorMessage);
            throw errorMessage;
          })
          ,finalize(()=>{this.signalModalClose();} )
        )
        .subscribe(
          () => {     this.clearSelections();
                      this.signalModalClose()}
        )
      })
      // console.log("this is the updatedlist:",updatedListofMappedProjects);
      // this.mapperService.mappedProjects = updatedListofMappedProjects
      // console.log("is harley quinn in the mapped projects?", this.mapperService.mappedProjects);
      
      //NEED TO UPDATE DATA AT SOME POINT
 
    }
    catch(err) {
      let errorMessage = new Error('Error: Did not successfully add Planview project.  Please contact your PerView administrator')
      this.handleError(errorMessage);
    }       
  } 

  prepareForMapping(): MappedProject[] {
    console.log('do i have the username when i need it?', this.userService.userName);
    
    try {
      let prepSelections: any = this.selectedProjects.map((selectedProject) => {
        //strip out the 34 ID:
        let modifiedUserID =  this.utilityService.modifyCurrentUser(this.userService.currentUser);
        console.log(`is the modified user ID working??: value equals: ${modifiedUserID}`);
        
        let formattedSelectedProject = Object.assign({projectName:selectedProject.name, ppl_code:selectedProject.ppl_Code,mappedBy34:modifiedUserID, mappedByName:this.userService.userName},{})
        console.log("correct format check for these times:", formattedSelectedProject);
        return formattedSelectedProject;
      })
      console.log('prepSchool:', prepSelections);
      
      
      return prepSelections;
    }
    catch(err) {
      let errorMessage = new Error('Error: Could not display authorized PerView projects successfully')
      this.handleErrorQuietly(errorMessage);
     }   
  }
  rowClick(event): void {    
    try {
      this.selectProject(event);
      console.log(event, "this is the row click.....", "these are selected:", this.selectedProjects);
    }
    catch(err) {
      let errorMessage = new Error('Error: Could not display authorized PerView projects successfully')
      this.handleErrorQuietly(errorMessage);
     }   
  }

  selectProject(event: object): void {
    console.log('what it is yo:', event["data"]);
    try {
      if (this.projectIsSelected(event["data"].ppl_Code)) {
         this.unselectProject(event["data"].ppl_Code);
      }
      else {
        this.selectedProjects.push(event["data"]);
      }
    }
    catch(err) {
      let errorMessage = new Error('Error: Issues with selectProject()')
      this.handleErrorQuietly(errorMessage);
     }   
  }

  projectIsSelected(ppl_Code: string): boolean {
    console.log('running man');
    console.log('selction::', this.selectedProjects);
    
    console.log('next',this.selectedProjects.map(t=>t["ppl_Code"]).indexOf(ppl_Code));
    console.log('yo',this.selectedProjects.map(t=>t["ppl_Code"]));
    try {
      if (this.selectedProjects.map(t=>t["ppl_Code"]).indexOf(ppl_Code) > -1) {
        return true;
      }
    }
    catch(err) {
      let errorMessage = new Error('Error: Issues w/ planview\'s projectIsSelected()')
      this.handleErrorQuietly(errorMessage);
    }   
  }

  unselectProject(ppl_Code: string): void {
    console.log('unselect func');
    try {
      this.selectedProjects.splice(this.selectedProjects.map(selectedItems => selectedItems.ppl_Code).indexOf(ppl_Code),1)
    }
    catch(err) {
      let errorMessage = new Error("Error: Issues with planview's unselectProject()")
      this.handleErrorQuietly(errorMessage);
     }   
  }

  clearSelections(): void {
    try {
      this.selectedProjects = [];
      console.log('selections cleared.');
    }
    catch(err) {
      let errorMessage = new Error('Error: Issues with clear selections() in planview authorized component')
      this.handleErrorQuietly(errorMessage);
     }   
  }

  navigateHome(): void{
     this.router.navigate(['/']);
  }

  
  signalModalClose(): void {   
    try {
      this.onPlanviewModalClose.emit('string');
      this.clearSelections();
      console.log('signalModalClose-planview has ran');
      this.smart.grid.dataSet.deselectAll();
      this.clearSearchBoxes();

    /* Want to implement clearing of filtering on selection here....
        this.source = new LocalDataSource(this.selectablePlanviewProjects)  
        this.source.reset();
    
       this.source.setFilter([],true,false);
       this.source.setSort([],false)
       this.source.setPage(1)
       this.source.refresh();
    */
    }
    catch(err) {
      let errorMessage = new Error('Error: Issues with signalModalClose() in authorized-planview-projects.ts')
      this.handleErrorQuietly(errorMessage);
     }   
  }

  clearSearchBoxes(): void {
    let inputFilters = Array.from(document.getElementsByTagName("input-filter"));
    inputFilters.forEach((filterElement) => { (filterElement.firstElementChild as HTMLOptionElement).value = ""});
    
    //for placebholders: 0 = perviewProject; 1 = "Project manager"; 2= "Business Owner"; 3="Project" (planviewProject)
    console.log("these are the input filters:",inputFilters);
    
  }

  
  setPlanviewSearchHints(): void {
    let searchProjectHint = document.getElementsByTagName("input-filter")[3].firstElementChild.setAttribute("placeholder","Search Project");
    let searchManagerHint = document.getElementsByTagName("input-filter")[4].firstElementChild.setAttribute("placeholder","Search Project Manager");
    let searchOwnerHint = document.getElementsByTagName("input-filter")[5].firstElementChild.setAttribute("placeholder","Search Business Owner");
    let searchIDHint = document.getElementsByTagName("input-filter")[6].firstElementChild.setAttribute("placeholder","Search Planview ID");
    
  }
  

}

