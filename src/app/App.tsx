"use client";

import store from "@/store/store";
import { HTMLAttributes, JSX, ReactNode } from "react";
import { Provider } from "react-redux";

type AppProps = {
    children: JSX.Element | ReactNode
} & HTMLAttributes<object>

export default function App(props: AppProps) {
    const { children, ...rest} = props;
    return <Provider store={store} {...rest}>{children}</Provider>;
}
