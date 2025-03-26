import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const TypingAnimation = ({ message, speed = 20 }) => {
  const [displayedMessage, setDisplayedMessage] = useState('');

  useEffect(() => {
    setDisplayedMessage('');

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < message.length) {
        const nextChar = message[currentIndex] || '';
        setDisplayedMessage((prev) => prev + nextChar);
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [message, speed]);

  return <span>{displayedMessage}</span>;
};

TypingAnimation.propTypes = {
  message: PropTypes.string.isRequired,
  speed: PropTypes.number,
};

export default TypingAnimation;