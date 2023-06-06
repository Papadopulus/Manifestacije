import React, { useState, useEffect } from "react";
import "./Countdown.css";

const Countdown = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        dana: Math.floor(difference / (1000 * 60 * 60 * 24)),
        sati: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minuta: Math.floor((difference / 1000 / 60) % 60),
        sekundi: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown">
      {Object.keys(timeLeft).map((interval, index) => (
        <div key={index}>
          {timeLeft[interval]} {interval}
        </div>
      ))}
    </div>
  );
};

export default Countdown;
