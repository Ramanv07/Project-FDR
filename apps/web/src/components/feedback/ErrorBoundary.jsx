import React from 'react';
import Button from '../ui/Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-lg mx-auto text-center border border-hairline rounded bg-white mt-12">
          <h2 className="text-base font-medium text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-xs text-gray-500 mb-4">
            An unexpected error occurred while rendering this interface.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Reload portal
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
