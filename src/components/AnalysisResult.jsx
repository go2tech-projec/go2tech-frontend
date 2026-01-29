const AnalysisResult = ({ result }) => {
  if (!result || !result.success) {
    return null;
  }

  const { student_info, courses, domain_scores, strengths, job_recommendations, summary } = result;

  const getMedalEmoji = (index) => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[index] || '';
  };

  const getScoreColor = (score) => {
    if (score >= 3.5) return 'bg-green-500';
    if (score >= 3.0) return 'bg-blue-500';
    if (score >= 2.5) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getScorePercentage = (score) => {
    return (score / 4.0) * 100;
  };

  const getGradeColor = (grade) => {
    if (grade === 'A') return 'text-green-600 bg-green-50';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600 bg-blue-50';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-600 bg-yellow-50';
    if (grade === 'D+' || grade === 'D') return 'text-orange-600 bg-orange-50';
    if (grade === 'F') return 'text-red-600 bg-red-50';
    if (grade === 'IP') return 'text-purple-600 bg-purple-50';
    if (grade === 'S' || grade === 'U' || grade === 'W') return 'text-gray-500 bg-gray-100';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{student_info.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="font-medium text-gray-900">{student_info.student_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Major</p>
            <p className="font-medium text-gray-900">{student_info.major}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Degree</p>
            <p className="font-medium text-gray-900">{student_info.degree}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cumulative GPA</p>
            <p className="font-medium text-gray-900">{student_info.cumulative_gpa.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Credits</p>
            <p className="font-medium text-gray-900">{student_info.total_credits}</p>
          </div>
        </div>
      </div>

      {/* All Courses */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Courses</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="pb-3 text-sm font-semibold text-gray-600">Course Code</th>
                <th className="pb-3 text-sm font-semibold text-gray-600">Course Name</th>
                <th className="pb-3 text-sm font-semibold text-gray-600 text-center">Credits</th>
                <th className="pb-3 text-sm font-semibold text-gray-600 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {courses && courses.map((course, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-mono text-gray-700">{course.course_code}</td>
                  <td className="py-3 text-sm text-gray-800">{course.course_name}</td>
                  <td className="py-3 text-sm text-gray-700 text-center">{course.credits}</td>
                  <td className="py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(course.grade)}`}>
                      {course.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-500 text-right">
          Total: {courses?.length || 0} courses
        </div>
      </div>

      {/* Domain Scores */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Domain Scores</h2>
        <div className="space-y-4">
          {Object.entries(domain_scores).map(([domain, score]) => (
            <div key={domain}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{domain}</span>
                <span className="text-sm font-bold text-gray-900">{score.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getScoreColor(score)}`}
                  style={{ width: `${getScorePercentage(score)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Strengths */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Strengths</h2>
        <div className="space-y-3">
          {strengths.map((strength, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg"
            >
              <span className="text-2xl">{getMedalEmoji(index)}</span>
              <span className="font-medium text-gray-800">{strength}</span>
              {domain_scores[strength] && (
                <span className="ml-auto text-sm font-bold text-blue-600">
                  {domain_scores[strength].toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {job_recommendations.map((job, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
            >
              <p className="font-medium text-gray-800">{job}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{summary.total_courses}</p>
            <p className="text-sm opacity-90">Total Courses</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{summary.total_credits}</p>
            <p className="text-sm opacity-90">Total Credits</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{summary.cumulative_gpa.toFixed(2)}</p>
            <p className="text-sm opacity-90">Cumulative GPA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
