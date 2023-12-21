import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooAttestationCreateComponent } from './coo-attestation-create.component';

describe('CooAttestationCreateComponent', () => {
  let component: CooAttestationCreateComponent;
  let fixture: ComponentFixture<CooAttestationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CooAttestationCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CooAttestationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
