
  export interface IProject {
    projUid?: string;
    projName?: string;
    owner?: string,
  }

  export class Project implements IProject {

    constructor(public projUid = '', 
      public projName = '',
      public owner = '',
      public projectChargeBackCategory = '',
      public departments = '',

    ) { }
  }

export interface MappedProject {
  uid: string;
  ppl_code: string;
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
  
  
