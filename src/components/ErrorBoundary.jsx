import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl shadow-rose-900/5 overflow-hidden text-center p-12">
            <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0 relative">
              <AlertCircle size={40} className="relative z-10" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Oops! Something went wrong.</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We encountered an unexpected error while trying to process your request. 
              Don't worry, our team has been notified.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-colors shrink-0"
              >
                Refresh Page
              </button>
              <Link 
                to="/" 
                onClick={() => this.setState({ hasError: false })}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3.5 px-8 rounded-xl transition-colors shrink-0"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
