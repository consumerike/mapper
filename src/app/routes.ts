
import { AppComponent } from './app.component';
import { ListOfMappedProjectRelationshipsComponent } from './list-of-mapped-project-relationships/list-of-mapped-project-relationships.component';
import { AuthorizedPerviewProjectsComponent } from './components/authorized-perview-projects/authorized-perview-projects.component';
import { AuthorizedPlanviewProjectsComponent } from './components/authorized-planview-projects/authorized-planview-projects.component';
import { MappedProjectRelationshipComponent } from './components/mapped-project-relationship/mapped-project-relationship.component';

import { ResolverService } from "./Services/resolver.service";
import { PlanviewResolverService } from "./Services/planview-resolver.service";
export let routes = [
    { path: "", component: ListOfMappedProjectRelationshipsComponent, pathMatch: "full" },
    { path: "#authorizedPerviewModal" ,component:AuthorizedPerviewProjectsComponent, resolve: {selectablePerviewProjects: ResolverService} },
    { path: '#authorizedPlanviewProjects', component:AuthorizedPlanviewProjectsComponent, resolve: {selectablePlanviewProjects: PlanviewResolverService}}
    // { path: '/ConfirmDeletion', component: ConfirmationDialogueComponent }
];
