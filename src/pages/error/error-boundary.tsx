import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorPage } from '.';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(someError: Error): State {
    // Update state so the next render will show the fallback UI.
    console.log('Error boundary caught an error:', someError);
    return { hasError: true };
  }

  /**
   * TODO: Add loggin errors to the server functionality here
   * @param error
   * @param errorInfo
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage errorNumber={500} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
