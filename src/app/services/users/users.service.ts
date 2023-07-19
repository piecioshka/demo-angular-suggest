import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersUrl = 'https://fakes.piecioshka.io/users';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(this.usersUrl);
  }

  findUsers(phrase: string, options = {}) {
    return this.http.get<User[]>(`${this.usersUrl}?q=${phrase}`, options);
  }
}
