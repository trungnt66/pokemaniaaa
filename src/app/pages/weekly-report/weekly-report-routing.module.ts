import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeeklyReportDetailComponent } from './weekly-report-detail/weekly-report-detail.component';
import { WeeklyReportComponent } from './weekly-report.component';

const routes: Routes = [
  { path: '', component: WeeklyReportComponent },
  { path: 'detail/:id', component: WeeklyReportDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeeklyReportRoutingModule { }
