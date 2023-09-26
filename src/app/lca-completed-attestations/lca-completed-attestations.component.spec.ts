import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaCompletedAttestationsComponent } from './lca-completed-attestations.component';

describe('LcaCompletedAttestationsComponent', () => {
  let component: LcaCompletedAttestationsComponent;
  let fixture: ComponentFixture<LcaCompletedAttestationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcaCompletedAttestationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcaCompletedAttestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
