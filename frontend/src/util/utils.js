export const green = '#1C352E';
export const gold = '#D4A82B';
export const brown = '#8E6F52';
export const violet = '#B58BC2';

export const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
};

export const dialogStyles = {
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    paragraph: {
        margin: '16px 0',
    },
    featuresList: {
        listStyleType: 'disc',
        marginLeft: '24px',
        marginTop: '8px',
    },
    valueDescription: {
        marginTop: '16px',
        marginBottom: '8px',
        fontWeight: 'bold',
    },
    valueList: {
        listStyleType: 'disc', // or 'none' if you prefer no bullets
        marginLeft: '24px',
        marginTop: '8px',
    },
    closeButton: {
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: '1.3rem',
        color: green,
        backgroundColor: brown,
    },
};