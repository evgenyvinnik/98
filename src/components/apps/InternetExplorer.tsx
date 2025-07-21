import React from 'react';
import IframeApp from './IframeApp';

const InternetExplorer: React.FC = () => {
  return <IframeApp src="https://www.google.com/webhp?igu=1" title="Internet Explorer" />;
};

export default InternetExplorer;
