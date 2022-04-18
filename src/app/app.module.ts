import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import vi from '@angular/common/locales/vi';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule } from 'angularx-social-login';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { FirebaseService } from './services/firebase.service';
import { UserLoginServiceService } from './services/user-login-service.service';


registerLocaleData(vi);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    ReactiveFormsModule,
    SocialLoginModule,
    NzMenuModule,
    NzButtonModule,
    NzAutocompleteModule,
    NzInputModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN },
    // , 
  //   {
  //   provide: 'SocialAuthServiceConfig',
  //   useValue: {
  //     autoLogin: false,
  //     providers: [
  //       {
  //         id: FacebookLoginProvider.PROVIDER_ID,
  //         provider: new FacebookLoginProvider(
  //           '799212517703966'
  //         )
  //       }
  //     ]
  //   } as SocialAuthServiceConfig,
  // },
  UserLoginServiceService,
  FirebaseService,
],
  bootstrap: [AppComponent]
})
export class AppModule { }
