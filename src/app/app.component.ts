import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FacebookLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { FirebaseService } from './services/firebase.service';
import { UserLoginServiceService } from './services/user-login-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isCollapsed = false;

  constructor(
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,
    private userFbService: UserLoginServiceService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) {
    console.log(this.isLoggedin);
  }
  loginForm: FormGroup | null = null;
  socialUser: SocialUser | null = null;
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

  ngOnInit() {
    // this.loginForm = this.formBuilder.group({
    //   email: ['', Validators.required],
    //   password: ['', Validators.required],
    // });

    if (this.userFbService.userFb) {
      this.socialUser = this.userFbService.userFb;
      this.isLoggedin = true;
      this.checkAndSetGlobalUser(this.socialUser);
    } else {
      this.socialAuthService.authState.subscribe((user) => {
        this.userFbService.userFb = user;
        this.socialUser = user;
        this.isLoggedin = user != null;
        this.socialAuthService.authState;
        if (user) {
          this.checkAndSetGlobalUser(this.socialUser);
        }
      });
    }

    if(!this.header) {
      this.goToRouter(this.routing.welcome);
    }
  }

  async checkAndSetGlobalUser(user: SocialUser | null) {
    if (!user) {
      return;
    }
    try {
      const userFromFirebase = await this.firebaseService.getUserById(user.id);
      if(userFromFirebase === 'error') {
        return;
      }

      if (userFromFirebase) {
        this.userFbService.userFire = userFromFirebase;
      } else {
        await this.firebaseService.addUser({
          id: user.id,
          email: user.email,
          name: user.name,
        });

        // re get data from firebase
        const userFromFirebase = await this.firebaseService.getUserById(user.id);
        if(userFromFirebase === 'error') {
          return;
        }
  
        if (userFromFirebase) {
          this.userFbService.userFire = userFromFirebase;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  goToRouter({ url, header }: any): void {
    this.header = header;
    if(url) {
      this.router.navigateByUrl(url)
    }
  }

  signOut(): void {
    this.socialUser = null;
    this.userFbService.userFb = null;
    this.socialAuthService.signOut();
  }
}
