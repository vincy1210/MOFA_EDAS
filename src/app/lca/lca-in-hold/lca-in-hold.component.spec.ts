import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaInHoldComponent } from './lca-in-hold.component';

describe('LcaInHoldComponent', () => {
  let component: LcaInHoldComponent;
  let fixture: ComponentFixture<LcaInHoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcaInHoldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcaInHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
