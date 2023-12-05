import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooPaymentsReportsComponent } from './coo-payments-reports.component';

describe('CooPaymentsReportsComponent', () => {
  let component: CooPaymentsReportsComponent;
  let fixture: ComponentFixture<CooPaymentsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CooPaymentsReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CooPaymentsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
