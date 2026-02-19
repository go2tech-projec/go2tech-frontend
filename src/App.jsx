import { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import DebugView from './components/DebugView';
import { transcriptAPI } from './services/api';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [teacherMode, setTeacherMode] = useState(false);

  const handleFileSelect = async (file) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Use debug API if teacher mode is enabled
      const result = teacherMode
        ? await transcriptAPI.analyzeTranscriptDebug(file)
        : await transcriptAPI.analyzeTranscript(file);

      if (result.success) {
        setAnalysisResult(result);
      } else {
        setError(result.message || 'Analysis failed');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while analyzing the transcript');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                GO2TECH
              </h1>
              <p className="text-gray-600 mt-1">
                Transcript Analysis - Tech Job Platform
              </p>
            </div>

            {/* Teacher Mode Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Teacher Mode</span>
              <button
                onClick={() => setTeacherMode(!teacherMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  teacherMode ? 'bg-amber-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    teacherMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Upload Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Upload Your Transcript
            </h2>
            <p className="text-gray-600">
              Upload your academic transcript to discover your strengths and get job recommendations
            </p>
          </div>

          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="mt-4 text-gray-600 font-medium">Analyzing your transcript...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Result */}
          {analysisResult && !isLoading && (
            <>
              <AnalysisResult result={analysisResult} />
              {/* Debug View (Teacher Mode) */}
              {teacherMode && analysisResult.debug_info && (
                <DebugView debugInfo={analysisResult.debug_info} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>GO2TECH - Tech Job Platform</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
