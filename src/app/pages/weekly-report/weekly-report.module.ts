import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { WeeklyReportDetailComponent } from './weekly-report-detail/weekly-report-detail.component';
import { WeeklyReportRoutingModule } from './weekly-report-routing.module';
import { WeeklyReportComponent } from './weekly-report.component';



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
    NzTabsModule,
  ]
})
export class WeeklyReportModule { }
