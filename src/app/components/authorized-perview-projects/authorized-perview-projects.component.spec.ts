import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedPerviewProjectsComponent } from './authorized-perview-projects.component';

describe('AuthorizedPerviewProjectsComponent', () => {
  let component: AuthorizedPerviewProjectsComponent;
  let fixture: ComponentFixture<AuthorizedPerviewProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedPerviewProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedPerviewProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
