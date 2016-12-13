import * as React from "react";
import Hello from "./hello/Hello";
import Foo from "./foo/Foo";

export default class App extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="appMain">
                <Hello name="Alex" />
                <Foo />
            </div>
        );
    }
}