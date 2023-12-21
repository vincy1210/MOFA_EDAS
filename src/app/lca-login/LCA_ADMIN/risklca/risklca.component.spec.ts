import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisklcaComponent } from './risklca.component';

describe('RisklcaComponent', () => {
  let component: RisklcaComponent;
  let fixture: ComponentFixture<RisklcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RisklcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RisklcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
