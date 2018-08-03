
import { AppComponent } from './app.component';
import { ListOfMappedProjectRelationshipsComponent } from './list-of-mapped-project-relationships/list-of-mapped-project-relationships.component';
import { AuthorizedPerviewProjectsComponent } from './components/authorized-perview-projects/authorized-perview-projects.component';
import { AuthorizedPlanviewProjectsComponent } from './components/authorized-planview-projects/authorized-planview-projects.component';
import { MappedProjectRelationshipComponent } from './components/mapped-project-relationship/mapped-project-relationship.component';

 export let routes =  [
    { path: "", component: ListOfMappedProjectRelationshipsComponent, pathMatch: "full" },
    { path: "authorizedPerviewProjects" ,component:AuthorizedPerviewProjectsComponent },
    { path: "authorizedPlanviewProjects", component: AuthorizedPlanviewProjectsComponent }
    // { path: '/ConfirmDeletion', component: ConfirmationDialogueComponent }
 ];
