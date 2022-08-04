import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { HelmetProvider } from "react-helmet-async";
import reportWebVitals from "./reportWebVitals";
import "./styles/styles.css";
import { client } from "./apollo";
import { App } from "./components/app";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <ApolloProvider client={client}>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </ApolloProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
