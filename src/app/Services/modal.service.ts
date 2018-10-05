import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  
  showSpinner: boolean = true;
  public selection: string;

  hideSpinner(): void{
    console.log('hide spinner now!');
    
    this.showSpinner = false;
  }

  getSpinnerStatus(): boolean {
    return this.showSpinner;
  }
}
