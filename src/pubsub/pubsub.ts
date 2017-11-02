import es6BindAll = require("es6bindall");

type CallBackData = number | string | void | undefined;
type CallbackSub = (data?: CallBackData) => void;
interface IPubsub {
  [index: string]: [(data?: CallBackData) => void];
}
class Pubsub {
  public pubsub: IPubsub;
  private bindMethods: string[] = ["subscribe", "unsubscribe", "publish"];
  constructor() {
    this.pubsub = {};
    es6BindAll(this, this.bindMethods);
  }
  public subscribe(eventName: string, fn: CallbackSub): void {
    this.pubsub[eventName] = this.pubsub[eventName] || [];
    this.pubsub[eventName].push(fn);
  }
  public unsubscribe(eventName: string, fn: CallbackSub): void {
    if (this.pubsub[eventName]) {
      for (let i: number = 0; i < this.pubsub[eventName].length; i++) {
        if (this.pubsub[eventName][i] === fn) {
          this.pubsub[eventName].splice(i, 1);
          break;
        }
      }
    }
  }
  public publish(eventName: string, data?: CallBackData): void {
    if (this.pubsub[eventName]) {
      this.pubsub[eventName].forEach(function(fn: CallbackSub) {
        fn(data);
      });
    }
  }
}

export default Pubsub;
