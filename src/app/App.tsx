"use client";

import store from "@/store/store";
import { JSX, ReactNode } from "react";
import { Provider } from "react-redux";

type AppProps = {
    children: JSX.Element | ReactNode
}

export default function App(props: AppProps) {
    const { children } = props;
    return <Provider store={store}>{children}</Provider>;
}
