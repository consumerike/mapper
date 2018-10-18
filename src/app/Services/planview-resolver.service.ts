import { Injectable } from '@angular/core';
import { PlanviewProject, SavedProject } from '../components/mapper-models';
import { Subject,from } from "rxjs";
import { Observable } from "rxjs/Observable";
import { Resolve, ActivatedRoute } from '@angular/router';
import { ModalService } from './modal.service';
import { PlanviewService } from './planview.service';
import { takeUntil, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PlanviewResolverService implements Resolve <Observable<PlanviewProject[]>> {
  constructor(private planviewService: PlanviewService,private modalService: ModalService) { }

  authorizedPlanviewProjects: PlanviewProject[];
  selectablePlanviewProjects: any[];
  selectedProject: SavedProject = this.modalService.selectionObject;
  unSub = new Subject<void>();
  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();  
  }

  resolve(): Observable<PlanviewProject[]> { 
    try {
      console.log("getPlanViewProjects in authorized planview projects component is running...");
      console.log("reeeport! what is the selection object",this.modalService.selectionObject);
      
      this.planviewService.getAuthorizedPlanviewProjects()
      .pipe( 
         takeUntil(this.unSub),
         map( (data) => { this.authorizedPlanviewProjects = data;console.log('all pv projects in the resolver',this.authorizedPlanviewProjects);
           let filteredAuthorizedPlanviewProjects = this.authorizedPlanviewProjects.filter((planviewProject: PlanviewProject)=> {
             console.log("the selected project is: selectedProject.Uid, modalServiceSelectionObject",this.selectedProject,this.selectedProject.projUid, this.modalService.selectionObject);
             console.log("what is the selected project here:", this.selectedProject);
             
             if(this.selectedProject.planviewProjects.map(savedPlanviewProject => savedPlanviewProject.projectName.toLowerCase()).indexOf(planviewProject.name.toLowerCase()) < 0) {
               console.log('does this ever get in here in resovler??');
               return planviewProject;
             }
           })
           this.selectablePlanviewProjects = filteredAuthorizedPlanviewProjects;
           console.log("this go around selectable planview projects equals in resolver", this.selectablePlanviewProjects, this.selectablePlanviewProjects);
           console.log("Melissa Denver, CO", this.selectablePlanviewProjects);
           return this.selectablePlanviewProjects;
         })
       );

    }
    catch (error) {
      let errorMessage = new Error('Error: Could not display authorized PerView projects successfully')
      this.handleErrorQuietly(errorMessage);
      return from(this.selectablePlanviewProjects);
    }
  }

  handleErrorQuietly(error): void {
    console.warn(error);
  }

}//end of service
