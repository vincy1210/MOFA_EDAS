import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalAttestationComponent } from './physical-attestation.component';

describe('PhysicalAttestationComponent', () => {
  let component: PhysicalAttestationComponent;
  let fixture: ComponentFixture<PhysicalAttestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalAttestationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalAttestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
