import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooPendingComponent } from './coo-pending.component';

describe('CooPendingComponent', () => {
  let component: CooPendingComponent;
  let fixture: ComponentFixture<CooPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CooPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CooPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
