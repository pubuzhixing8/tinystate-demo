import { Observable } from 'rxjs';
import { map, distinctUntilChanged, observeOn } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import { Subscription } from 'rxjs';
import { RootContainer } from './root_container';
import { Injectable, Optional, Inject } from '@angular/core';

let containerId = -1;

@Injectable()
export abstract class Container<S extends object> {
  private _setState$ = new Subject<Partial<S>>();
  private _setStateSubscription: Subscription;
  private _state$ = new BehaviorSubject<S>(Object.assign({}, this.getInitialState()));
  private _defaultContainerInstanceId = `${this._getClassName()}@${++containerId}`;

  constructor(
    @Optional()
    @Inject(RootContainer)
    private _rootContainer: RootContainer | null
  ) {
    if (this._rootContainer) {
      this._rootContainer.registerContainer(this);
    }
    this._setStateSubscription = this._subscribeToSetState();
  }

  /**
   * setState updates the state of the container. The returned Observable completes when the state
   * state updated is completed.
   */
  protected setState(stateFn: (currentState: Readonly<S>) => Partial<S>) {
    this._setState$.next(stateFn(this._state$.value));
  }

  /**
   * Implement this method to describe the initial state of your container.
   */
  protected abstract getInitialState(): S;

  /**
   * select selects parts of current the state or the whole state.
   *
   * @final
   */
  select<K>(selectFn: (state: Readonly<S>) => K): Observable<K> {
    return this._state$.pipe(
      map(state => selectFn(state as Readonly<S>)),
      distinctUntilChanged(),
      observeOn(async)
    );
  }

  private _subscribeToSetState(): Subscription {
    return this._setState$.subscribe(partialState => {
      this._state$.next(Object.assign({}, this._state$.value, partialState));
    });
  }

  /**
   * When you override this method, you have to call the destroy method in your ngOnDestroy method.
   */
  // tslint:disable-next-line:use-life-cycle-interface
  protected ngOnDestroy() {
    this.destroy();
  }

  /**
   * Call this method if ngOnDestroy is overwritten.
   *
   * @final
   */
  protected destroy() {
    this._setStateSubscription.unsubscribe();
    this._state$.complete();
    if (this._rootContainer) {
      this._rootContainer.unregisterContainer(this);
    }
  }

  /**
   * You can override this method if you want to give your container instance a custom id.
   * The returned id must be unique in the application.
   */
  getContainerInstanceId(): string {
    return this._defaultContainerInstanceId;
  }

  private _getClassName(): string {
    return this.constructor.name;
  }
}
