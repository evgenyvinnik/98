import React, { useState, useEffect } from 'react';

const TaskbarClock = () => {
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
  const formattedDate = time.toLocaleString([], { weekday: 'long', month: 'long', day: '2-digit', minute: '2-digit', hour: '2-digit' });

  return (
    <div className="taskbar-time" title={formattedDate} onDoubleClick={() => showMessageBox({iconID: 'info', message: 'Time to get an old clock!'})}>
      {formattedTime}
    </div>
  );
};

export default TaskbarClock;
