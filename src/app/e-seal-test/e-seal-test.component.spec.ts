import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESealTestComponent } from './e-seal-test.component';

describe('ESealTestComponent', () => {
  let component: ESealTestComponent;
  let fixture: ComponentFixture<ESealTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESealTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESealTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
