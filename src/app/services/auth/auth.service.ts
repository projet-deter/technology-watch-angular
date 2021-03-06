import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Endpoint in the API
   * @memberof UserService
   */
  loginEndpoint = "auth/login";
  registerEndpoint = "auth/register";

  /**
   * Current user
   * @memberof UserService
   */
  currentUser: User;

  constructor(private router: Router, public apiService: ApiService) { }

  login(email: string, password: string) {
    this.apiService.postAuth(this.loginEndpoint, {email, password}).then((res) => {
      this.apiService.ACCESS_TOKEN = res['access_token'];
      this.apiService.headers = new HttpHeaders().set('Authorization', this.apiService.ACCESS_TOKEN);
      this.currentUser = this.createUser(res);
      this.router.navigate(['/articles']);
    }).catch((err) => {
      console.error('Error : ' + err[0]);
    });     
  }

  register(body: any) {
    this.apiService.postAuth(this.registerEndpoint, body).then((res) => {
      this.router.navigate(['/login']);
    }).catch((err) => {
      console.error('Error : ' + err[0]);
    });
  }

  logout() {
    this.apiService.ACCESS_TOKEN = null;
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  createUser(data: any): User {
    return new User(
      data['id'],
      data['name'],
      data['email']
    );
  }
}
