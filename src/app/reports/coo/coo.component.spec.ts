import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COOComponent } from './coo.component';

describe('COOComponent', () => {
  let component: COOComponent;
  let fixture: ComponentFixture<COOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ COOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(COOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
