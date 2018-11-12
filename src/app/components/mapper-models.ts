
  export interface IProject {
    projUid: string;
    projName: string;
    owner?: string,
    businessOwner?: string,
    projectChargeBackCategory?: string,
    departments?: string,
    planviewProjects?: any[];
  }

  export class Project implements IProject {

    constructor(public projUid = '', 
      public projName = '',
      public owner = '',
      public businessOwner = '',
      public projectChargeBackCategory = '',
      public departments = '',
      public planviewProjects = []
    ) { }
  }

export class MappedProject {
  projectName: string;
  ppl_code: string;
  projectGuid?: string;
  mappedBy34?: string;
  mappedByName?: string;
}

export class PlanviewProject {
  ppl_Code: string;
  name: string;
  plan_id: string;
  proj_mgr: string;
  projectSponsor: string
}

export class SavedProject {
  projUid: string;
  projName: string;
  planviewProjects?: MappedProject[];
  
}

    
export class Config {
  apiRoot: string;
  projectServerRoot: string;
  mapperUserStateRoot: string;
  adapterPath: string;
  userNamePath: string;

}

export class Result {
  project: IProject;
  projects?: IProject[]
  success: boolean;
  error: string;
}
  
  
