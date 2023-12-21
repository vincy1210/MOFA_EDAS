import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedCooRequestsComponent } from './completed-coo-requests.component';

describe('CompletedCooRequestsComponent', () => {
  let component: CompletedCooRequestsComponent;
  let fixture: ComponentFixture<CompletedCooRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedCooRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedCooRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
