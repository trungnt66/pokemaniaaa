import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UserLoginServiceService } from 'src/app/services/user-login-service.service';

@Component({
  selector: 'app-poke-table',
  templateUrl: './poke-table.component.html',
  styleUrls: ['./poke-table.component.css'],
})
export class PokeTableComponent implements OnInit {
  constructor(
    private api: FirebaseService,
    private userService: UserLoginServiceService,
    private message: NzMessageService,
    private router: Router,
  ) {}
  public listTable: any;
  public isVisible = false;
  public currentTime: any = null;
  public buyIn = 150;
  public loading = false;
  public get showTable() {
    return this.listTable && typeof this.listTable === 'object';
  }

  async ngOnInit() {
    this.loading = true;
    const getListTableResult = await this.api.getListTable();
    if (getListTableResult !== 'error') {
      this.listTable = getListTableResult || [];
    }
    
    this.loading = false;
  }

  public async confirm() {
    this.loading = true
    try {
      await this.api.createTable(
        this.userService.userFire,
        this.currentTime,
        this.buyIn
      );
      const getListTableResult = await this.api.getListTable();
      if (getListTableResult !== 'error') {
        this.listTable = getListTableResult || [];
      }
      this.isVisible = false;
      this.message.success('Create table success');
    } catch (error) {
      this.message.error('Server Error');
    } finally {
      this.loading = false;
    }
  }

  public showModelAddNew() {
    this.currentTime = new Date();
    this.isVisible = true;
  }

  public async gotoTable(tableId: string) {
    this.router.navigateByUrl('pokemon-table/detail/'+tableId)
  }

  public cancel() {}
}
