import { Component, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

import { UsersService } from '../services/users/users.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-suggest',
  templateUrl: './suggest.component.html',
  styleUrls: ['./suggest.component.css'],
})
export class SuggestComponent {
  searchInput = new FormControl();
  users: Signal<User[]>;

  constructor(private usersService: UsersService) {
    const users$ = this.searchInput.valueChanges.pipe(
      filter((query) => query.length > 0),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query) =>
        // switch to new search observable each time the term changes
        this.usersService.findUsers(query)
      ),
      takeUntilDestroyed() // ngOnDestroy not needed anymore
    );

    this.users = toSignal(users$, { initialValue: [] });
  }
}
