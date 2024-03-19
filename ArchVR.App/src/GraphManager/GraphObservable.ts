export class GraphObservable<T> {
  private _observers = new Array<(eventData: T) => void>();
  constructor() {}

  public get observers() {
    return this._observers;
  }

  subscribe(func: (eventData: T) => void) {
    this._observers.push(func);
  }

  unsubscribe(func: (eventData: T) => void) {
    this._observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data: T) {
    this._observers.forEach((observer) => observer(data));
  }
}
