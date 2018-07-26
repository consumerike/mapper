import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedPlanviewProjectsComponent } from './authorized-planview-projects.component';

describe('AuthorizedPlanviewProjectsComponent', () => {
  let component: AuthorizedPlanviewProjectsComponent;
  let fixture: ComponentFixture<AuthorizedPlanviewProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedPlanviewProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedPlanviewProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
