import { Component } from "the-world-engine";

export class InvokeOnStart extends Component {
    public invoke = () => {
        // do something
    };

    public start(): void {
        this.invoke();
    }
}
