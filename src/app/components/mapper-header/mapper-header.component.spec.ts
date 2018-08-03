import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapperHeaderComponent } from './mapper-header.component';

describe('MapperHeaderComponent', () => {
  let component: MapperHeaderComponent;
  let fixture: ComponentFixture<MapperHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapperHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapperHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
