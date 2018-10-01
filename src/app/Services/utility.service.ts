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

  
  modifyCurrentUser(currentUser:string): string {
    let modifiedUserName = currentUser.toLowerCase();
    let strippedUserID = modifiedUserName.substring(modifiedUserName.indexOf("\\")+1);
    console.log('checking stripped user name',strippedUserID);
    return strippedUserID;
  }

  modifyUrlSegmentForEncoding(currentUser: string): string {
    //Note: there is also a encordeURIComponent() function that is for different special character encoding...
    let urlSegment = `${currentUser}`
    let encodedSegment = encodeURI(urlSegment);
    console.log("the encoded segment within utility function",encodedSegment);
    
    return encodedSegment;
  }
}

