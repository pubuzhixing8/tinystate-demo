import { Component } from '@angular/core';
import { CounterContainer } from './store/CounterStore';
import { UserContainer } from './store/UserStore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    CounterContainer,
    UserContainer
  ]
})
export class AppComponent {
  counter$: Observable<number> = this.counterContainer.select(state => state.count);

  constructor(private counterContainer: CounterContainer, private userContainer: UserContainer) { }

  title = 'tinystate-demo';

  increment() {
    this.counterContainer.increment(1);
  }

  decrement() {
    this.counterContainer.decrement();
  }
}
