import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaSettlementsReportsComponent } from './lca-settlements-reports.component';

describe('LcaSettlementsReportsComponent', () => {
  let component: LcaSettlementsReportsComponent;
  let fixture: ComponentFixture<LcaSettlementsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcaSettlementsReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcaSettlementsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
