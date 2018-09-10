import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapper-footer',
  templateUrl: './mapper-footer.component.html',
  styleUrls: ['./mapper-footer.component.css']
})
export class MapperFooterComponent implements OnInit {

  getListOfSavedProjects(): any {
    throw new Error("Method not implemented.");
  }
  constructor() { }

  ngOnInit() {
    this.getListOfSavedProjects();
  }

}
