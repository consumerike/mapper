
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import * as M from  'materialize-css'
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css'
import {MaterializeModule} from 'angular2-materialize';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ConfigService } from "./Services/config.service";
import { UserService } from './Services/user-service.service';
import { MyProjectService } from './Services/project.service';
import { PlanviewService } from './Services/planview.service';
import { PerviewService } from './Services/perview.service';
import { MapperService } from './Services/mapper.service';
import { UtilityService } from './Services/utility.service';
import { CustomErrorHandlerService } from './Services/custom-error-handler.service';

import { AppComponent } from './app.component';
import { MapperHeaderComponent } from './components/mapper-header/mapper-header.component';
import { MapperFooterComponent } from './components/mapper-footer/mapper-footer.component';
import { ListOfMappedProjectRelationshipsComponent } from './list-of-mapped-project-relationships/list-of-mapped-project-relationships.component';
import { AuthorizedPerviewProjectsComponent } from './components/authorized-perview-projects/authorized-perview-projects.component';
import { AuthorizedPlanviewProjectsComponent } from './components/authorized-planview-projects/authorized-planview-projects.component';
import { MappedProjectRelationshipComponent } from './components/mapped-project-relationship/mapped-project-relationship.component';
import { routes } from "./routes";



@NgModule({
  declarations: [
    AppComponent,
    MapperHeaderComponent,
    MapperFooterComponent,
    AuthorizedPerviewProjectsComponent,
    ListOfMappedProjectRelationshipsComponent,
    AuthorizedPlanviewProjectsComponent,
    MappedProjectRelationshipComponent,
 
  ],

  imports: [
    BrowserModule,
    MaterializeModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    Ng2SmartTableModule,
    RouterModule.forRoot(routes),//,{enableTracing: true}
  ],

  providers: [
    ConfigService,
    {provide: ErrorHandler,
      useClass: CustomErrorHandlerService
    },
    UserService,
    UtilityService,
    MyProjectService,
    MapperService,
    PerviewService,
    PlanviewService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
