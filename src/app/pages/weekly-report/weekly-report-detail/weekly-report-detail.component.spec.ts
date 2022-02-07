import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportDetailComponent } from './weekly-report-detail.component';

describe('WeeklyReportDetailComponent', () => {
  let component: WeeklyReportDetailComponent;
  let fixture: ComponentFixture<WeeklyReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyReportDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
