import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultipleUserComponent } from './add-multiple-user.component';

describe('AddMultipleUserComponent', () => {
  let component: AddMultipleUserComponent;
  let fixture: ComponentFixture<AddMultipleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMultipleUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMultipleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
