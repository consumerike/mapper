import { Injectable } from '@angular/core';
import { IProject } from '../components/mapper-models';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  
  public selection: string;
  public selectionObject: IProject;
  showSpinner: boolean = true;

  hideSpinner(): void{
    console.log('hide spinner now!');
    
    this.showSpinner = false;
  }

  getSpinnerStatus(): boolean {
    return this.showSpinner;
  }

}