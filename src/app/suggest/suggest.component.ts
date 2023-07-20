import { Component } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

import { UsersService } from '../services/users/users.service';
import { User } from '../interfaces/user';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-suggest',
  templateUrl: './suggest.component.html',
  styleUrls: ['./suggest.component.css'],
})
export class SuggestComponent {
  searchInput = new FormControl();
  users$ = new BehaviorSubject<User[]>([]);

  constructor(private usersService: UsersService) {
    this.searchInput.valueChanges
      .pipe(
        filter(query => query.length > 0),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query =>
          // switch to new search observable each time the term changes
          this.usersService.findUsers(query)),
        takeUntilDestroyed(), // ngOnDestroy not needed anymore
      )
      .subscribe(this.users$);
  }
}
