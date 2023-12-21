import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooAttestationComponent } from './coo-attestation.component';

describe('CooAttestationComponent', () => {
  let component: CooAttestationComponent;
  let fixture: ComponentFixture<CooAttestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CooAttestationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CooAttestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
