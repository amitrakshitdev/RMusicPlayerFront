import React from "react";
import clsx from "clsx";

type SectionProps = {
    heading: string;
    subHeading?: string;
    secondaryButton?: React.JSX.Element;
} & React.PropsWithChildren;

export default function Section(props: SectionProps) {
    const { heading, children, subHeading, secondaryButton } = props;
    return (
        <section>
            <header className={clsx(["flex items-center justify-between"])}>
                <div className={clsx(["flex flex-col"])}>
                    <h1 className={clsx(["text-2xl"])}>{heading}</h1>
                    {subHeading && (
                        <h3 className={clsx(["opacity-50"])}>{subHeading}</h3>
                    )}
                </div>
                {secondaryButton && <div>
                    {secondaryButton}
                </div>}
            </header>
            <div
                className={clsx([
                    "mt-2 relative min-h-50 h-auto",
                    "overflow-x-scroll w-full",
                ])}
            >
                {children}
            </div>
        </section>
    );
}
