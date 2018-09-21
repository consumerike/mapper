import { ErrorHandler,Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandlerService  implements ErrorHandler {

  constructor() { }

  public errorList: any[];
  public errorsPresent:boolean = false;

  handleError(error) {
    console.warn('Caught a special error in custom handler:', error.statusText)
    alert(`There's been an unexpected error: ${error.statusText}`)
    this.errorsPresent = true;
    this.errorList.push(error.statusText);
  }

  clearErrorList() :void {
    this.errorList = [];
    this.errorsPresent = false;
  }

}
