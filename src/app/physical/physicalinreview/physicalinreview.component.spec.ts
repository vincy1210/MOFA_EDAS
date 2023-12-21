import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalinreviewComponent } from './physicalinreview.component';

describe('PhysicalinreviewComponent', () => {
  let component: PhysicalinreviewComponent;
  let fixture: ComponentFixture<PhysicalinreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalinreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalinreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
