import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { User } from "../models/user.model";

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private http: Http) { }

  register(user: User) {
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('/api/user/register', body, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  login(user: User, remember: Boolean = false) {
    user.remember = remember;
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('/api/user/login', body, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  logout() {
    return this.http.get('/api/user/logout')
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  recoverPassword(email: String) {
    const body = JSON.stringify({ email: email, password: 'xxxxxx' });
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('/api/user/password/recover', body, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  resetPassword(token: String, password: String) {
    const body = JSON.stringify({ email: 'xxxxxx', password: password });
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('/api/user/password/reset/' + token, body, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  getUser() {
    return this.http.get('/api/user/getuser')
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        var errobj = error.json();
        errobj['status'] = error.status;    // tuck the status code into the response

        return Observable.throw(errobj);
      });
  }

  isLoggedIn() { return true; }
}