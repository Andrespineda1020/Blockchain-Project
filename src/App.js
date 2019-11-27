import React from "react";
import NestedList from "./components/NestedList";
import BlockchainList from "./components/BlockchainList";
import "./App.css";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <BlockchainList />
            </header>
        </div>
    );
}

export default App;
