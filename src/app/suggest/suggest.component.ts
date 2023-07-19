import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { debounce } from '../utils/debounce';
import { UsersService } from '../services/users/users.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-suggest',
  templateUrl: './suggest.component.html',
  styleUrls: ['./suggest.component.css'],
})
export class SuggestComponent implements OnDestroy {
  users: User[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private usersService: UsersService) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private async search(query: string) {
    if (query.length === 0) {
      return;
    }
    const findUsersSubscription = this.usersService.findUsers(query).subscribe({
      next: (users) => {
        console.log({ query, users });
        this.users = users;
      },
    });

    this.subscriptions.push(findUsersSubscription);
  }

  private debouncedSearch = debounce(this.search.bind(this), 500);

  onChange(value: string) {
    this.users = [];
    this.debouncedSearch(value.trim());
  }
}
