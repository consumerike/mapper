import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedProjectRelationshipComponent } from './mapped-project-relationship.component';

describe('MappedProjectRelationshipComponent', () => {
  let component: MappedProjectRelationshipComponent;
  let fixture: ComponentFixture<MappedProjectRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappedProjectRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappedProjectRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
