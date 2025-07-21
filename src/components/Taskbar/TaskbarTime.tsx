import React, { useState, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  time: {
    fontSize: '12px',
  },
});

const TaskbarTime: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedTitle = time.toLocaleString([], { weekday: 'long', month: 'long', day: '2-digit', minute: '2-digit', hour: '2-digit' });

  return (
    <div {...stylex.props(styles.time)} title={formattedTitle}>
      {formattedTime}
    </div>
  );
};

export default TaskbarTime;
