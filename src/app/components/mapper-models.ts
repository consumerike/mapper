
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
}

export class SavedProject {
  projUid: string;
  projName: string;
  planviewProjects?: MappedProject[];
  
}

    
export class Config {
  projectServerUrl: string;
  resPlanUserStateUrl: string;
  adapterUrl: string;
  projectPickerViewGuid: string;
  resourcePickerViewGuid: string;
}

export class Result {
  project: IProject;
  projects?: IProject[]
  success: boolean;
  error: string;
}
  
  
