import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaInProcessComponent } from './lca-in-process.component';

describe('LcaInProcessComponent', () => {
  let component: LcaInProcessComponent;
  let fixture: ComponentFixture<LcaInProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcaInProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcaInProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
