import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooinreviewComponent } from './cooinreview.component';

describe('CooinreviewComponent', () => {
  let component: CooinreviewComponent;
  let fixture: ComponentFixture<CooinreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CooinreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CooinreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
