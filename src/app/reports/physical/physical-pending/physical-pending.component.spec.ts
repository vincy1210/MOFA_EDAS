import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPendingComponent } from './physical-pending.component';

describe('PhysicalPendingComponent', () => {
  let component: PhysicalPendingComponent;
  let fixture: ComponentFixture<PhysicalPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
