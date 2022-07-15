import { Component } from 'the-world-engine';

export class InvokeOnStart extends Component {
    public invoke = () => {
        // do something
    };

    public awake(): void {
        this.invoke();
        this.destroy();
    }
}
