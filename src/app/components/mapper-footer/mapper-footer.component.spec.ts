import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapperFooterComponent } from './mapper-footer.component';

describe('MapperFooterComponent', () => {
  let component: MapperFooterComponent;
  let fixture: ComponentFixture<MapperFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapperFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapperFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
