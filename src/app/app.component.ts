import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { UserLoginServiceService } from './services/user-login-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isCollapsed = false;

  constructor(
    public userFbService: UserLoginServiceService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) {
    console.log(this.isLoggedin);
  }
  loginForm: FormGroup | null = null;
  isLoggedin: boolean = false;
  public readonly routing = {
    playTable: {
      url: '/pokemon-table',
      header: 'Join Pokemon Table',
    },welcome: {
      url: '/welcome',
      header: 'Profiles',
    },weeklyReport: {
      url: '/weekly-report',
      header: 'Report',
    },

    
  };

  public header = '';
  autoCompletePlayer = ''
  listUsers :any[] = []
  listUserName: string[] = []
  unsubUser: any = null;
  autoCompletePlayerChanging(value: string) {
    const listName: any[] = this.listUsers.map(x=>x.name) || []
    this.listUserName = listName.filter((x:string)=>!value ||  x && x.toLowerCase().includes(value.toLowerCase()));
  }
  async subscribeUserChange() {
    this.unsubUser = await this.firebaseService.subscribeAllUser((users: any) => {
      this.listUsers = users;
      this.autoCompletePlayerChanging(this.autoCompletePlayer);
    });
  }

  ngOnInit() {
    if(!this.header) {
      this.goToRouter(this.routing.welcome);
    }

    this.subscribeUserChange();
    this.checkAndSetGlobalUser(this.userFbService.userFb)
  }

  async checkAndSetGlobalUser(user: any | null) {
    if (!user) {
      return;
    }
    try {
      const userFromFirebase = await this.firebaseService.getUserById(user.id);
      if (userFromFirebase !== 'error' && userFromFirebase && typeof userFromFirebase === 'object') {
        this.userFbService.userFire = userFromFirebase;
      } else {
        this.userFbService.userFire = null;
      }
    } catch (error) {
      this.userFbService.userFire = null
    }
  }

  goToRouter({ url, header }: any): void {
    this.header = header;
    if(url) {
      this.router.navigateByUrl(url)
    }
  }
  warnUserNotInTable = ''
  async loginToSystem() {
    const isHasUser = this.listUsers.some(x=>x.name === this.autoCompletePlayer);

    if(!isHasUser && !this.warnUserNotInTable) {
      this.warnUserNotInTable = 'Không tìm thấy user này, bạn sẽ vẫn muốn tiếp tục?';
      return;
    }

    let addUserResponse = '';
    const newUser = {
      id: this.autoCompletePlayer,
      name: this.autoCompletePlayer,
    }

    if(this.warnUserNotInTable) {
      addUserResponse = await this.firebaseService.addUser(newUser);
      if(addUserResponse != 'error')
      this.warnUserNotInTable = '';
    }

    if(addUserResponse === 'error') {
      alert('error when adding user')
      return;
    }
    this.userFbService.userFb = newUser;
    this.isLoggedin = true;
    if (newUser) {
      await this.checkAndSetGlobalUser(newUser);
    }

    if(!this.userFbService.userFire) {
      alert('error');
    }
  }

  signOut(): void {
    this.userFbService.userFb = null;
    this.userFbService.userFire = null;
  }
}
