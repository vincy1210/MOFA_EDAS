import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaPendingComponent } from './lca-pending.component';

describe('LcaPendingComponent', () => {
  let component: LcaPendingComponent;
  let fixture: ComponentFixture<LcaPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcaPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcaPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
