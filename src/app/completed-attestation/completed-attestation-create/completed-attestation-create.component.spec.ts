import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedAttestationCreateComponent } from './completed-attestation-create.component';

describe('CompletedAttestationCreateComponent', () => {
  let component: CompletedAttestationCreateComponent;
  let fixture: ComponentFixture<CompletedAttestationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedAttestationCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedAttestationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
