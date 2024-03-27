import { useEffect } from 'react';

const APP_NAME = 'Farm Management';

interface ITitle {
  title: string;
}

function Title({ title }: ITitle) {
  useEffect(() => {
    document.title = title + ' | ' + APP_NAME;
    return () => {
      document.title = APP_NAME;
    };
  }, [title]);

  return null;
}

export const DocumentTitle = Title;
