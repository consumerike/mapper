import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  modifyCurrentUserVariable(currentUser:string) {
    //add a \ after hca\currentUser
    let modifiedUserName = currentUser.replace('\\','\\\\')
    console.log('Does this have the requisite two slashes::', modifiedUserName);
    return modifiedUserName;
  }
}
