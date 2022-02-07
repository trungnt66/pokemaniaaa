import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklyReportComponent } from './weekly-report.component';
import { WeeklyReportRoutingModule } from './weekly-report-routing.module';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { WeeklyReportDetailComponent } from './weekly-report-detail/weekly-report-detail.component';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';



@NgModule({
  declarations: [
    WeeklyReportComponent,
    WeeklyReportDetailComponent
  ],
  imports: [
    CommonModule,
    WeeklyReportRoutingModule,
    NzButtonModule,
    NzListModule,
    IconsProviderModule,
    NzPopconfirmModule,
  ]
})
export class WeeklyReportModule { }
