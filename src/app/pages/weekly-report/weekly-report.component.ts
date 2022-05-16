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
  public rainbowColor: any = [];

  ngOnInit(): void {
    this.initFlow();
  }

  public createRainBowByLength(size: number) {
    var rainbow = new Array(size);

    for (var i = 0; i < size; i++) {
      var red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
      var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
      var green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

      rainbow[i] = "#" + red + green + blue;
    }

    function sin_to_hex(i: any, phase: any) {
      var sin = Math.sin(Math.PI / size * 2 * i + phase);
      var int = Math.floor(sin * 127) + 128;
      var hex = int.toString(16);

      return hex.length === 1 ? "0" + hex : hex;
    }

    // rainbow.reverse();

    return rainbow;
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
      
      this.rainbowColor = this.createRainBowByLength(this.topPlayer.length);
      console.log()
    }
  }

  public async gotoReport(id: string) {
    this.router.navigateByUrl('weekly-report/detail/' + id);
  }
}
