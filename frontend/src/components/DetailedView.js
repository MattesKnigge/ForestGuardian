import React from 'react';

const DetailedView = ({ sensors }) => {
    const isMobile = window.innerWidth <= 768;

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'left', alignItems: 'flex-end', overflowX: 'hidden', position: 'relative' }}>
            <img
                src="/fire.svg"
                alt="Campfire"
                style={{ width: isMobile ? '40%' : '20%', height: 'auto' }}
            />
            <img
                src="/smoke.svg"
                alt="Smoke"
                style={{ position: 'absolute', top: isMobile ? '35%' : '4%', left: isMobile ? '6%' : '3%', width: isMobile ? '50%' : '25%', height: 'auto', opacity: 0.5 }} //TODO: set opacity corresponding to air quality
            />
            <img
                src="/bird_cold.svg"
                alt="Bird"
                style={{ position: 'absolute', top: isMobile ? '40%' : '4%', left: isMobile ? '40%' : '30%', width: isMobile ? '30%' : '20%', height: 'auto' }}
            />
        </div>
    );
};

export default DetailedView;
