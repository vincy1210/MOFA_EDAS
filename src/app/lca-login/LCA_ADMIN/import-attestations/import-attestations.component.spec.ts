import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAttestationsComponent } from './import-attestations.component';

describe('ImportAttestationsComponent', () => {
  let component: ImportAttestationsComponent;
  let fixture: ComponentFixture<ImportAttestationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportAttestationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportAttestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
