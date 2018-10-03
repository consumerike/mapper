import { ErrorHandler,Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandlerService  implements ErrorHandler {


  constructor() {console.log('error handler service accounted for');
   }

  public errorList: any[] = [];
  public errorsPresent:boolean = false;

  handleError(error) {
    // console.warn('Caught a special error in custom handler:', error.statusText)
    // alert(`There's been an unexpected error: ${error.statusText}`)
    this.setErrorsPresentStatus(false);
    this.errorList.push(error.statusText);
  }

  addError(error: any): void {
    this.errorList.push(error);
  }

  setErrorsPresentStatus(status:boolean): void {
    this.errorsPresent = status;
  }

  getErrorList(): string[] {
    return this.errorList;
  }

  clearErrorList() :void {
    this.errorList = [];
    this.errorsPresent = false;
  }

  getErrorsPresentStatus(): boolean {
    console.log('is this running: getErrorsPresentStatus...');
    return this.errorsPresent;
  }



}
