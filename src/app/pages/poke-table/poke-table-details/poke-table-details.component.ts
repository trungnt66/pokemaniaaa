import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UserLoginServiceService } from 'src/app/services/user-login-service.service';

@Component({
  selector: 'app-poke-table-details',
  templateUrl: './poke-table-details.component.html',
  styleUrls: ['./poke-table-details.component.css'],
})
export class PokeTableDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private api: FirebaseService,
    private message: NzMessageService,
    public userService: UserLoginServiceService
  ) {
    this.userRef = userService.userFb;
  }
  public userRef: any = null;
  public tableId: any = null;
  public tableDetail: any = null;
  public listPokerist: any = null;
  public isVisible = false;
  public payBackQuantity = 0;
  public loading = false;
  public payBackRef: any = null;
  public currentUserIsKey = false;
  public joinedTable = false;
  public tableBalance = 0;
  public bankerBalance = 0;
  public get canEdit() {
    return this.currentUserIsKey && !this.tableDetail.isEnd;
  }

  public listPokeristTamTinh: any = null;

  ngOnInit(): void {
    this.tableId = this.route.snapshot.params['tableId'];
    this.initFlow();
  }

  ngOnDestroy(): void {
    if (typeof this.unsubPokerist === 'function') {
      this.unsubPokerist();
    }

    if (typeof this.unsubUser === 'function') {
      this.unsubUser();
    }
  }

  async initFlow(skipSubscription?:boolean) {
    if (!this.tableId) {
      return;
    }
    // get table and player
    const result = await this.api.getDataDetailTable(this.tableId);
    if (!result || result === 'error') {
      return;
    }

    // this.listPokerist = result.players;
    this.tableDetail = result.table;
    if(!skipSubscription) {
      await this.subscribePokeristChange();
    }
  }

  unsubPokerist: any = null;

  async subscribePokeristChange() {
    this.unsubPokerist = await this.api.subscribePokerist(async (players: any) => {
      this.listPokerist = players;
      const keyUsers =
        (this.listPokerist && this.listPokerist.filter((x: any) => x.isKey)) ||
        null;
      this.joinedTable =
        this.listPokerist &&
        this.listPokerist.some(
          (x: any) => x.userId === this.userService.userFb.id
        );
      this.currentUserIsKey =
        keyUsers &&
        keyUsers.some((x: any) => x.userId === this.userService.userFb.id);
        
      await this.subscribeUserChange();
    }, this.tableId);
  }

  listUsers :any[] = []

  public listUserName: string[] = []
  
  unsubUser: any = null;
  async subscribeUserChange() {
    if(this.unsubUser && typeof this.unsubUser === 'function') {
      this.unsubUser();
    }
    this.unsubUser = await this.api.subscribeAllUser((users: any) => {
      this.listUsers = users;
      this.autoCompletePlayerChanging(this.autoCompletePlayer);
    });
  }

  autoCompletePlayerChanging(value: string) {
    const listName: any[] = this.listUsers.map(x=>x.name) || []
    debugger
    this.listUserName = listName.filter((x:string)=>!value || (x && x.toLowerCase().includes(value.toLowerCase()))).filter(nX=> {
      return this.listPokerist && !this.listPokerist.some((item:any)=>item.userName === nX);
    });
    this.checkUserDaTrongBan();
  }

  calculateBalance(
    item: any,
    buyInUnit: number,
    payBackQuantity?: number,
    buyInQuantity?: number
  ) {
    buyInUnit = buyInUnit || 0;
    if (!item) {
      return 0;
    }
    debugger;
    return (
      -((buyInQuantity || item.buyInQuantity) * this.tableDetail.buyInUnit) +
      (payBackQuantity || item.returnMoney || 0)
    );
  }

  async loadTru(item: any) {
    if (!item || !item.fireStoreId) {
      return;
    }

    const buyInQuanNew = (item.buyInQuantity || 0) + 1;
    const newBalance = this.calculateBalance(
      item,
      this.tableDetail.buyInUnit,
      0,
      buyInQuanNew
    );

    const result = await this.api.loadTru(
      item.fireStoreId,
      buyInQuanNew,
      newBalance
    );
    if (result === 'success') {
      item.buyInQuantity = buyInQuanNew;
      this.message.success('Load trụ thành công cho ' + item.userName);
    } else {
      this.message.error('Load trụ thất bại');
    }
  }

  async payBack() {
    this.loading = true;
    if (!this.payBackRef || !this.payBackRef.fireStoreId) {
      return;
    }

    const result = await this.api.payBack(
      this.payBackRef.fireStoreId,
      this.payBackQuantity,
      this.calculateBalance(
        this.payBackRef,
        this.tableDetail.buyInUnit,
        this.payBackQuantity
      )
    );
    if (result === 'success') {
      this.payBackRef.returnMoney = this.payBackQuantity;
      this.message.success('Trả lại thành công cho KEY');
    } else {
      this.message.error('Lỗi hệ thống');
    }
    this.loading = false;
    this.isVisible = false;
  }

  async joinTable(user:any = null) {
    const res = await this.api.joinTable(
      user,
      this.tableId,
      this.tableDetail.buyInUnit
    );
    if (res === 'error') {
      this.message.error('Lỗi hệ thống');
      return;
    }

    // this.listPokerist.unshift(res);
    this.message.success('Join bàn thành công');
    // this.joinedTable = true;
  }

  async nhuongKey(pokeristId: string, pokeristName: string) {
    const result = await this.api.themKey(pokeristId);
    if (result === 'success') {
      this.message.success(`Thêm thành công ${pokeristName} làm Key`);
    } else {
      this.message.error('Lỗi hệ thống');
    }
  }

  addPlayerInTableCancel() {
    this.cleanAddUserTable();
  }
  cleanAddUserTable() {
    this.themUserVisible = false;
    this.warnUserNotInTable = '';
    this.autoCompletePlayer = '';
    this.errorUserAlreadyInTable = '';
  }

  warnUserNotInTable = '';
  errorUserAlreadyInTable = '';
  checkUserDaTrongBan() {
    if(this.listPokerist.some((x: any)=>x && x.userName && this.autoCompletePlayer && x.userName.toLowerCase().trim() === this.autoCompletePlayer.toLocaleLowerCase().trim())) {
      this.errorUserAlreadyInTable = 'User đã ở trong bàn rồi';
      return;
    } else {
      this.errorUserAlreadyInTable = ''
    }
  }
  async addPlayerInTable() {
    const isHasUser = this.listUsers.some(x=>x.name === this.autoCompletePlayer);
    this.checkUserDaTrongBan();
    if(this.errorUserAlreadyInTable) {
      return;
    }


    if(!isHasUser && !this.warnUserNotInTable) {
      this.warnUserNotInTable = 'Không tìm thấy user này bạn vẫn muốn thêm user này vào bàn?';
      return;
    }

    let addUserResponse = '';
    const newUser = {
      id: this.autoCompletePlayer,
      name: this.autoCompletePlayer,
    }

    if(this.warnUserNotInTable) {
      addUserResponse = await this.api.addUser(newUser);
    }

    if(addUserResponse === 'error') {
      return;
    }

    this.joinTable(newUser);
    this.cleanAddUserTable();
    this.themUserVisible = false;
  }

  changingPlayer($event: any) {
    
  }

  autoCompletePlayer = ''

  payBackCancel() {
    this.isVisible = false;
    this.payBackRef = null;
    this.payBackQuantity = 0;
  }

  openPayBackModal(item: any) {
    this.payBackRef = item;
    this.payBackQuantity = item.returnMoney;
    this.isVisible = true;
  }

  chotSoVisible = false;

  showChotSo() {
    this.tableBalance = 0;
    this.tableBalance = this.calculateTotalBalance();
    this.ajustmentForChotSo();
    this.chotSoVisible = true;
  }

  themUserVisible = false;
  showThemUser() {
    
    this.themUserVisible = true;
  }

  async chotSo() {
    this.listPokeristTamTinh.push({
      userName: 'banker',
      userId: 'banker',
      fireStoreId: 'banker',
      balance: this.bankerBalance,
    });
    const result = await this.api.chotSo(this.tableDetail.createdTime.toDate() , this.listPokeristTamTinh, this.tableId);
    if(result === 'error') {
      this.message.error('Lỗi hệ thống!');
    } else {
      this.message.success('Chốt sổ thành công!');
      this.initFlow(true);
    }

    this.chotSoVisible = false;
  }

  topPlayer: any = null;
  ajustmentForChotSo() {
    this.bankerBalance = 0
    this.listPokeristTamTinh = JSON.parse(JSON.stringify(this.listPokerist));
    for (const item of this.listPokeristTamTinh) {
      if(item.balance>0) {
        let forBanker = Math.ceil(item.balance * 0.02);
        item.balance = item.balance - forBanker;
        this.bankerBalance += forBanker; 
        item.ajusted = true;
      }
    }

    this.topPlayer = this.listPokeristTamTinh.reduce((prev: any, current: any, idx: number)=>{
      if(idx === 0) {
        return current;
      } else {
        return (current.balance > prev.balance) ? current : prev
      }
      // return;
    })


  }

  calculateTotalBalance() {
    return this.listPokerist
      .map((item: any) => item.balance || 0)
      .reduce((prev: number, current: number) => (prev || 0) + current);
  }
}
