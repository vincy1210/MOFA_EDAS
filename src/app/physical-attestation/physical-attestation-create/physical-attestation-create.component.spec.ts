import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalAttestationCreateComponent } from './physical-attestation-create.component';

describe('PhysicalAttestationCreateComponent', () => {
  let component: PhysicalAttestationCreateComponent;
  let fixture: ComponentFixture<PhysicalAttestationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalAttestationCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalAttestationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
