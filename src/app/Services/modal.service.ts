import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  
  public selection: string;
  showSpinner: boolean = true;

  hideSpinner(): void{
    console.log('hide spinner now!');
    
    this.showSpinner = false;
  }

  getSpinnerStatus(): boolean {
    return this.showSpinner;
  }

}