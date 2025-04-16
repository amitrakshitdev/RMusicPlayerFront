import clsx from "clsx";

type SectionProps = {
    heading: string;
    subHeading?: string;
} & React.PropsWithChildren


export default function Section(props: SectionProps) {
    const { heading, children, subHeading } = props;
    return (
        <section>
            <h1 className={clsx(["text-2xl"])}>{heading}</h1>
           { subHeading && <h3 className={clsx(["opacity-50"])}>{subHeading}</h3>}
            <div className={clsx(["mt-2 relative min-h-50 h-auto", "overflow-x-scroll w-full",])}>
                {children}
            </div>
        </section>
    );
}
