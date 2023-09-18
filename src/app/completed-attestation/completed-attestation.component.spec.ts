import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedAttestationComponent } from './completed-attestation.component';

describe('CompletedAttestationComponent', () => {
  let component: CompletedAttestationComponent;
  let fixture: ComponentFixture<CompletedAttestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedAttestationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedAttestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
