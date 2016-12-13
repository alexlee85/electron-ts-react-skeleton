import * as React from "react";

export default class Foo extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="foo">
                I'm Foo
            </div>
        );
    }

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
}

