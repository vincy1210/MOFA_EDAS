import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionWiseImportComponent } from './region-wise-import.component';

describe('RegionWiseImportComponent', () => {
  let component: RegionWiseImportComponent;
  let fixture: ComponentFixture<RegionWiseImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionWiseImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionWiseImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
