import React from 'react';

const contributors = [
    { name: 'Niklas Lugowski', githubUsername: 'NiklasLugi' },
    { name: 'Mattes Knigge', githubUsername: 'whosmattes' },
    { name: 'Julian Schöpe', githubUsername: 'j.schoepe' },
    { name: 'Alireza Jalili Baleh', githubUsername: 'Alireza.Jalili' },
    { name: 'Hooman Taghi Zadehi', githubUsername: 'hooman.taghi' },
];

const githubURL = 'https://gitlab.com/';

const handleGitHubLinkClick = (githubUsername) => {
    window.open(`${githubURL}${githubUsername}`, '_blank');
};

const Credits = () => {
    const contributorsList = contributors.map((contributor, index) => (
        <span key={index} className="credit-link" onClick={() => handleGitHubLinkClick(contributor.githubUsername)}>
            {contributor.name}{index < contributors.length - 1 ? ', ' : ''}
        </span>
    ));

    return (
        <div className="footer-container">
            <div className="credits-content">
                <p>
                    Built by: {contributorsList} |{' '}
                    <span className="credit-link" onClick={() => handleGitHubLinkClick('whosmattes/sensorknoten-vogelhaus')}>
                        Visit our GitLab
                    </span>{' '}
                    |{' '}
                    <a className="country" href="https://5g-smart-country.de" target="_blank" rel="noreferrer">
                        5G Smart Country
                    </a>{' '}
                    | 2023
                </p>
            </div>
        </div>
    );
};

export default Credits;
