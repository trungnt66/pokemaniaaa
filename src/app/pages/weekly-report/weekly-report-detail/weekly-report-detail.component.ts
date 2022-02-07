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
  constructor(private route: ActivatedRoute, private api: FirebaseService, private user: UserLoginServiceService) {}
  public id: string | null = null;
  public detailDataSource: any = null;
  ngOnInit(): void {
    this.initFlow();
  }

  public totalBalance = 0;

  public async confirm(pokerist: any){
    if(!this.id) {
      return;
    }

    debugger;

    const result = await this.api.bankedPokerist(pokerist.userId, this.id);
    if(result === 'success') {
      this.initFlow();
    }
  };

  public get isBanker (){
    return this.user.userFire.role === AppConstant.Roles.banker;
  };

  public canBank(userName: string, isBanked: boolean) {
    return userName !== 'banker' && this.isBanker && !isBanked;
  }

  public pokeristKey: any[] = [];
  async initFlow() {
    this.id = this.route.snapshot.params['id'];

    const detailData: any = await this.api.getReportDetail(this.id);
    if (detailData === 'error') {
      return;
    }

    if (detailData && detailData.tables) {
      for (const item of detailData.tables) {
        item.createdTime = item.reatedTime.toDate();
      }

      detailData.tables.sort((a:any,b:any)=>{
        return a.createdTime > b.createdTime ? 1:-1
      })
    }

    this.totalBalance = 0;

    // calculate total
    for (const key of Object.keys(detailData.pokerist)) {
      const item = detailData.pokerist[key];
      item.totalBalance = Object.keys(item.tables || {}).reduce((p, c, i) => {
        debugger;
        if (i === 0) {
          return item.tables[c].balance || 0;
        }
        return (item.tables[c].balance || 0) + (p || 0);
      },0);

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
