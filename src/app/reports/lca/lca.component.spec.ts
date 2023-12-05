import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LCAComponent } from './lca.component';

describe('LCAComponent', () => {
  let component: LCAComponent;
  let fixture: ComponentFixture<LCAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LCAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LCAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
