import { useLocation, useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status) {
    case 'exceeded': return 'bg-green-500';
    case 'met':      return 'bg-blue-500';
    case 'below':    return 'bg-yellow-500';
    case 'missing':  return 'bg-red-500';
    default:         return 'bg-gray-400';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'exceeded': return 'Exceeded ✓';
    case 'met':      return 'Met ✓';
    case 'below':    return 'Below';
    case 'missing':  return 'Missing';
    default:         return status;
  }
};

const getRowBg = (status) => {
  switch (status) {
    case 'exceeded': return 'bg-green-50';
    case 'met':      return 'bg-blue-50';
    case 'below':    return 'bg-yellow-50';
    case 'missing':  return 'bg-red-50';
    default:         return '';
  }
};

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  if (score >= 20) return 'text-orange-500';
  return 'text-red-600';
};

const JobDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { job } = location.state || {};

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Job not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const exceededSkills = job.hard_skill_details.filter(s => s.status === 'exceeded');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header bar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Results
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">

        {/* Job header card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{job.job_name_en}</h1>
              {job.job_field?.name_en && (
                <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                  {job.job_field.name_en}
                </span>
              )}
              {job.job_group?.name_en && (
                <span className="inline-block mt-2 ml-2 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  {job.job_group.name_en}
                </span>
              )}
            </div>
            <div className="text-center flex-shrink-0">
              <p className={`text-5xl font-bold ${getScoreColor(job.overall_score)}`}>
                {job.overall_score}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Match Score</p>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                job.overall_score >= 80 ? 'bg-green-500' :
                job.overall_score >= 60 ? 'bg-blue-500' :
                job.overall_score >= 40 ? 'bg-yellow-400' :
                job.overall_score >= 20 ? 'bg-orange-400' : 'bg-red-400'
              }`}
              style={{ width: `${job.overall_score}%` }}
            />
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-5">
            <p className="text-3xl font-bold text-gray-800">{job.hard_skills_score}%</p>
            <p className="text-sm text-gray-500 mt-1">Hard Skills Score</p>
            <p className="text-xs text-gray-400 mt-1">
              {job.stats.matched_hard_skills} / {job.stats.total_required_hard_skills} skills matched
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5">
            <p className="text-3xl font-bold text-gray-800">{job.soft_skills_score}%</p>
            <p className="text-sm text-gray-500 mt-1">Soft Skills Score</p>
            <p className="text-xs text-gray-400 mt-1">
              {job.stats.matched_soft_skills} / {job.stats.total_required_soft_skills} skills matched
            </p>
          </div>
        </div>

        {/* Hard Skills Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Hard Skills Breakdown</h2>
          <p className="text-xs text-gray-500 mb-4 px-3 py-2 bg-gray-50 rounded-lg">
            Score per skill = min(Your Level ÷ Required Level, 1.0) × 100% &nbsp;|&nbsp; Overall = Average of all skill scores
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-3 text-left font-semibold text-gray-600">Skill</th>
                  <th className="pb-3 text-center font-semibold text-gray-600">Required</th>
                  <th className="pb-3 text-center font-semibold text-gray-600">Your Level</th>
                  <th className="pb-3 text-center font-semibold text-gray-600">Your %</th>
                  <th className="pb-3 text-center font-semibold text-gray-600">Score</th>
                  <th className="pb-3 text-center font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {job.hard_skill_details.map((skill, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${getRowBg(skill.status)}`}>
                    <td className="py-3 font-medium text-gray-800">{skill.skill_name_en}</td>
                    <td className="py-3 text-center text-gray-600">Lv.{skill.required_level}</td>
                    <td className="py-3 text-center text-gray-600">
                      {skill.user_level > 0 ? `Lv.${skill.user_level}` : '—'}
                    </td>
                    <td className="py-3 text-center text-gray-600">
                      {skill.user_percentage > 0 ? `${skill.user_percentage}%` : '—'}
                    </td>
                    <td className="py-3 text-center font-semibold text-gray-800">
                      {(skill.score * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white ${getStatusColor(skill.status)}`}>
                        {getStatusLabel(skill.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td colSpan="4" className="py-3 font-bold text-gray-700">Average Score</td>
                  <td className="py-3 text-center font-bold text-gray-900">{job.hard_skills_score}%</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Missing Skills */}
        {job.missing_hard_skills.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-red-700 mb-2">Missing Skills</h2>
            <p className="text-sm text-red-600 mb-3">
              These skills are required but were not found in your transcript:
            </p>
            <ul className="space-y-2">
              {job.missing_hard_skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-red-800">
                  <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="font-medium">{skill.skill_name_en}</span>
                  <span className="text-red-500">— Required Level: {skill.required_level}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exceeded Skills */}
        {exceededSkills.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-green-700 mb-2">Skills You Exceed ✓</h2>
            <ul className="space-y-2">
              {exceededSkills.map((skill, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-green-800">
                  <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="font-medium">{skill.skill_name_en}</span>
                  <span className="text-green-600">
                    — Your Level: {skill.user_level} / Required: {skill.required_level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </main>
    </div>
  );
};

export default JobDetail;
