import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppComponent } from './app.component';

import { ListOfMappedProjectRelationshipsComponent } from './list-of-mapped-project-relationships/list-of-mapped-project-relationships.component';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientModule } from '@angular/common/http';
import { AuthorizedPerviewProjectsComponent } from './components/authorized-perview-projects/authorized-perview-projects.component';
import { AuthorizedPlanviewProjectsComponent } from './components/authorized-planview-projects/authorized-planview-projects.component';
import { MappedProjectRelationshipComponent } from './components/mapped-project-relationship/mapped-project-relationship.component';

@NgModule({
  declarations: [
    AppComponent,
    ListOfMappedProjectRelationshipsComponent,
    AuthorizedPerviewProjectsComponent,
    AuthorizedPlanviewProjectsComponent,
    MappedProjectRelationshipComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Ng2SmartTableModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
