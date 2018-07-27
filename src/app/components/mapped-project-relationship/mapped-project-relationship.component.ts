import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-mapped-project-relationship',
  templateUrl: './mapped-project-relationship.component.html',
  styleUrls: ['./mapped-project-relationship.component.css']
})
export class MappedProjectRelationshipComponent implements OnInit {

  constructor() { }
  
  @Input() mappedProjectRelationship;
  @Output() relationshipRemoved = new EventEmitter();
  @Output() relationshipHidden = new EventEmitter();
  

  ngOnInit() {
  }

  removePlanviewAssociation() {
    this.relationshipRemoved.next(this.mappedProjectRelationship);
  }

  deletePerviewAssociation() {
    this.relationshipRemoved.next(this.mappedProjectRelationship);
  }

  hideAssociation() {
    this.relationshipHidden.next(this.mappedProjectRelationship);
  }

}
