import { Variants } from "motion/react";

const playerVariants : Variants = {
    full: {
        height: '100%',
        padding: '16px', // Adjust as needed
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    small: {
        height: '20dvh', // Or a fixed smaller height
        padding: '8px 16px', // Adjust as needed
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row', // Arrange items horizontally in the footer
        position: 'fixed',
        bottom: 0,
        zIndex: 50, // Ensure it's above other content
    },
};

const albumArtVariants: Variants = {
    full: {
        width: 'auto',
        height: 'auto',
        maxWidth: '85%',
    },
    small: {
        width: 'auto', // Smaller size in footer
        height: '50%',
        maxHeight: "20px"
    },
};

const songDetailsVariants: Variants = {
    full: {
        opacity: 1,
        marginTop: '16px',
    },
    small: {
        opacity: 1, // Keep visible
        marginLeft: '16px',
        marginTop: 0,
    },
};

const controlsVariants : Variants = {
    full: {
        width: '100%',
        marginTop: '16px',
        justifyContent: 'space-between',
    },
    small: {
        width: 'auto',
        marginLeft: 'auto', // Push to the right
        marginTop: 0,
        justifyContent: 'flex-end',
    },
};


export {
    playerVariants,
    albumArtVariants,
    songDetailsVariants,
    controlsVariants,
};