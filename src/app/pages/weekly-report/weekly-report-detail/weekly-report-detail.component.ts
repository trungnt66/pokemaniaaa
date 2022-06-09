import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UserLoginServiceService } from 'src/app/services/user-login-service.service';
import AppConstant from '../../../constants/app.constant';

@Component({
  selector: 'app-weekly-report-detail',
  templateUrl: './weekly-report-detail.component.html',
  styleUrls: ['./weekly-report-detail.component.css'],
})
export class WeeklyReportDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private api: FirebaseService, private user: UserLoginServiceService) { }
  public id: string | null = null;
  public detailDataSource: any = null;
  ngOnInit(): void {
    this.initFlow();
  }

  public totalBalance = 0;

  public async confirm(pokerist: any) {
    if (!this.id) {
      return;
    }

    const result = await this.api.bankedPokerist(pokerist.userId, this.id);
    if (result === 'success') {
      this.initFlow();
    }
  };

  public copyToClipBoard(balance: any) {
    var copyText = balance + '';
  
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText);
  }

  public get isBanker() {
    return this.user.userFire.role === AppConstant.Roles.banker;
  };

  public canBank(userName: string, isBanked: boolean) {
    return userName !== 'banker' && this.isBanker && !isBanked;
  }

  tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function (s: any) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s: any, c: any) { return s.replace(/{(\w+)}/g, function (m: any, p: any) { return c[p]; }) }
    return function (table: any, name: any) {
      if (!table.nodeType) table = document.getElementById(table)
      var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
      window.location.href = uri + base64(format(template, ctx))
    }
  })()

  public pokeristKey: any[] = [];
  async initFlow() {
    this.id = this.route.snapshot.params['id'];

    const detailData: any = await this.api.getReportDetail(this.id);
    console.log(detailData.tables);
    if (detailData === 'error') {
      return;
    }

    if (detailData && detailData.tables) {
      for (const item of detailData.tables) {
        item.createdTime = item.reatedTime.toDate();
      }

      detailData.tables.sort((a: any, b: any) => {
        return a.createdTime > b.createdTime ? 1 : -1
      })
    }

    this.totalBalance = 0;

    // calculate total
    for (const key of Object.keys(detailData.pokerist)) {
      const item = detailData.pokerist[key];
      item.totalBalance = Object.keys(item.tables || {}).reduce((p, c, i) => {
        if (i === 0) {
          return item.tables[c].balance || 0;
        }
        return (item.tables[c].balance || 0) + (p || 0);
      }, 0);

      this.totalBalance += item.totalBalance;
    }

    this.pokeristKey = Object.keys(detailData.pokerist).sort(
      (a, b) => {
        if (a === 'banker') {
          return 1;
        }

        if (b === 'banker') {
          return -1;
        }

        return detailData.pokerist[a].totalBalance >
          detailData.pokerist[b].totalBalance
          ? -1
          : 1;
      }
    );

    // total = 

    this.detailDataSource = detailData;
  }
}
