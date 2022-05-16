import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.css'],
})
export class WeeklyReportComponent implements OnInit {
  constructor(private api: FirebaseService, private router: Router) { }

  public listReport: any = [];
  public topPlayer: any = [];

  ngOnInit(): void {
    this.initFlow();
  }

  async initFlow() {
    const res = await this.api.getListReports();
    const res2 = await this.api.getTopPlayerAllTheTime();
    if (res !== 'error') {
      this.listReport = res;
    }

    if (res2 !== 'error' && typeof res2 === 'object') {
      this.topPlayer = Object.keys(res2).map(x => { return { name: x, ...res2[x] } }).sort((a, b) => {
        return a.totalQuantity > b.totalQuantity ? -1 : 1;
      });
    }
  }

  public async gotoReport(id: string) {
    this.router.navigateByUrl('weekly-report/detail/' + id);
  }
}
