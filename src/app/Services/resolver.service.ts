import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { IProject, SavedProject } from '../components/mapper-models';
import { PerviewService } from './perview.service';
import { takeUntil, map, tap, switchMap } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { UserService } from './user-service.service';
import { MyProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})


export class ResolverService implements Resolve <Observable<IProject[]>> {

  selectableProjects: any[];
  listOfSavedPerviewProjects: SavedProject[];
  authorizedProjects: IProject[];

  constructor(private http: HttpClient,private userService: UserService, private perviewService: PerviewService, private myProjectService: MyProjectService) { }
  unSub = new Subject<void>();
  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();  
  }

  resolve(): Observable<IProject[]> {
    //return observable
    try {
       this.myProjectService.getSavedPerviewProjects(this.userService.currentUser)
       .pipe(
        takeUntil(this.unSub),
        switchMap((data)=> this.listOfSavedPerviewProjects = data),
        switchMap((data)=> {
          return this.perviewService.getAuthorizedPerviewProjects()
        }),
        tap((data)=>{this.authorizedProjects = data;}),
        map(((data) => {console.log("this is all authorized projects as data:",data);  
          let filteredAuthorizedProjects = this.authorizedProjects.filter((project) => {
          if(this.listOfSavedPerviewProjects.map(savedProject => savedProject.projUid.toLowerCase()).indexOf(project.projUid.toLowerCase()) < 0) {
           return project;
          }
          this.selectableProjects = filteredAuthorizedProjects;
          console.log('the selectable projects are:', this.selectableProjects);
          return this.selectableProjects;})
        }))
       );
       
    }
    catch(err) {
      let errorMessage = new Error('Error: Could not display authorized PerView projects successfully')
      this.handleErrorQuietly(errorMessage);
      return from(this.selectableProjects);
      // return from(this.selectableProjects);
     }

  }

  handleErrorQuietly(error): void {
    console.warn(error);
  }


}//end of Service
