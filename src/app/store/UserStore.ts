
import { Container } from '../../package/container';

export interface UserState {
  count: number;
}

/**
 * A Container is a very simple class that holds your state and some logic for updating it.
 * The shape of the state is described via an interface (in this example: CounterState).
 */
export class UserContainer extends Container<UserState> {
  getInitialState(): UserState {
    return {
      count: 0
    };
  }

  increment(increment: number) {
    this.setState(state => ({ count: state.count + increment }));
  }

  decrement(decrement: number = 1) {
    this.setState(state => ({ count: state.count - decrement }));
  }
}
