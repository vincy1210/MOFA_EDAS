import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAttestationsCreateComponent } from './import-attestations-create.component';

describe('ImportAttestationsCreateComponent', () => {
  let component: ImportAttestationsCreateComponent;
  let fixture: ComponentFixture<ImportAttestationsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportAttestationsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportAttestationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
