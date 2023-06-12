import React, { useState } from 'react';
import "./ReadMore.css"

const ReadMore = ({ text }) => {
    const [showFullText, setShowFullText] = useState(false);

    const toggleText = () => {
        setShowFullText(!showFullText);
    };

    const truncateLength = 500;
    const shouldTruncate = text.length > truncateLength;

    return (
        <div className="read-more">
            <div className="text">
                {showFullText ? text : shouldTruncate ? text.slice(0, truncateLength) + '...' : text}
                {!showFullText && shouldTruncate && (
                    <div className="fade-out"></div>
                )}
            </div>
            {shouldTruncate && (
                <button onClick={toggleText} className="toggle-button">
                    {showFullText ? 'Prikaži manje' : 'Prikaži više'}
                </button>
            )}
        </div>
    );
};

export default ReadMore;
