import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedAttestationsComponent } from './completed-attestations.component';

describe('CompletedAttestationsComponent', () => {
  let component: CompletedAttestationsComponent;
  let fixture: ComponentFixture<CompletedAttestationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedAttestationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedAttestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
