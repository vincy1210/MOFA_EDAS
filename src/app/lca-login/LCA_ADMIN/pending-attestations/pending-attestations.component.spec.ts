import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAttestationsComponent } from './pending-attestations.component';

describe('PendingAttestationsComponent', () => {
  let component: PendingAttestationsComponent;
  let fixture: ComponentFixture<PendingAttestationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingAttestationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingAttestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
