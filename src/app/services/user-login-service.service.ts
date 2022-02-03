import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserLoginServiceService {
  constructor() {}
  private readonly _userFbKey = 'userFb';

  public get userFb() {
    const userFb = localStorage.getItem(this._userFbKey);
    return userFb ? JSON.parse(userFb) : null;
  }

  public set userFb(value) {
    localStorage.setItem(
      this._userFbKey,
      value ? JSON.stringify(value) : ''
    );
  }

  public userFire: any = null;
}
