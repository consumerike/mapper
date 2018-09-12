
  export interface IProject {
    projUid?: string;
    projName?: string;
    owner?: string,
    businessOwner?: string,
    planviewProjects?: any[];
  }

  export class Project implements IProject {

    constructor(public projUid = '', 
      public projName = '',
      public owner = '',
      public businessOwner = '',
      public planviewProjects = []
    ) { }
  }

export class MappedProject {
  projectName: string;
  ppl_code: string;
}

export class SavedProject {
  projUID: string;
  projName: string;
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
  
  
