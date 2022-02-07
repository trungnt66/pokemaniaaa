import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.css'],
})
export class WeeklyReportComponent implements OnInit {
  constructor(private api: FirebaseService, private router: Router) {}

  public listReport: any = [];

  ngOnInit(): void {
    this.initFlow();
  }

  async initFlow() {
    const res = await this.api.getListReports();
    if(res !== 'error') {
      this.listReport = res;
    }
  }

  public async gotoReport(id: string) {
    this.router.navigateByUrl('weekly-report/detail/' + id);
  }
}
