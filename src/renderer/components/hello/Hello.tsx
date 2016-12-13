import * as React from "react";

require("../../assets/images/app-icon.png");

export default class Hello extends React.Component<{name: string}, {count: number}> {
    public render() {
        return (
            <div className="hello">
                This is my frist Electron & React Project ~~~~~!
                My Name is {this.props.name}
                <div>
                    You click {this.state.count} times~~~ !!
                </div>
                <img alt="这是一张图片" src="images/app-icon.png" height="200px"/>
                <div>
                <button onClick={this.onButtonClick.bind(this)}>Click Me!</button>
                <button disabled={this.state.count === 0} onClick={this.onResetClick.bind(this)}>Reset</button>
                </div>
            </div>
        );
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            count: 0
        };
    }

    private onButtonClick() {
        this.setState({
            count: this.state.count + 1
        });
    }

    private onResetClick() {
        this.setState({
            count: 0
        });
    }
}