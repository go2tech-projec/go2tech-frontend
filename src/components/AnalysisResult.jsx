import { useNavigate } from 'react-router-dom';

const AnalysisResult = ({ result }) => {
  const navigate = useNavigate();
  if (!result || !result.success) return null;

  const { student_info, courses, skill_scores, top_skills, job_recommendations, summary } = result;

  const hard_skills = skill_scores?.hard_skills ?? [];
  const soft_skills = skill_scores?.soft_skills ?? [];

  // ── helpers ──────────────────────────────────────────────────────────────

  const getGradeColor = (grade) => {
    if (grade === 'A')              return 'text-green-600 bg-green-50';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600 bg-blue-50';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-600 bg-yellow-50';
    if (grade === 'D+' || grade === 'D') return 'text-orange-600 bg-orange-50';
    if (grade === 'F')              return 'text-red-600 bg-red-50';
    if (grade === 'IP')             return 'text-purple-600 bg-purple-50';
    return 'text-gray-500 bg-gray-100';
  };

  const getLevelColor = (level) => {
    if (level >= 5) return 'bg-green-500';
    if (level >= 4) return 'bg-blue-500';
    if (level >= 3) return 'bg-yellow-400';
    if (level >= 2) return 'bg-orange-400';
    return 'bg-gray-400';
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-400';
    if (score >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'exceeded': return 'bg-green-100 text-green-700';
      case 'met':      return 'bg-blue-100 text-blue-700';
      case 'below':    return 'bg-yellow-100 text-yellow-700';
      case 'missing':  return 'bg-red-100 text-red-700';
      default:         return 'bg-gray-100 text-gray-700';
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">

      {/* ── Student Info ── */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['Name',           student_info.name],
            ['Student ID',     student_info.student_id],
            ['Major',          student_info.major],
            ['Degree',         student_info.degree],
            ['Cumulative GPA', student_info.cumulative_gpa?.toFixed(2)],
            ['Total Credits',  student_info.total_credits],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="font-medium text-gray-900">{value ?? '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── All Courses ── */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          All Courses
          <span className="ml-2 text-base font-normal text-gray-500">({courses?.length ?? 0})</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="pb-3 text-sm font-semibold text-gray-600">Code</th>
                <th className="pb-3 text-sm font-semibold text-gray-600">Course Name</th>
                <th className="pb-3 text-sm font-semibold text-gray-600 text-center">Cr.</th>
                <th className="pb-3 text-sm font-semibold text-gray-600 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 text-sm font-mono text-gray-600">{course.course_code}</td>
                  <td className="py-2 text-sm text-gray-800">{course.course_name}</td>
                  <td className="py-2 text-sm text-gray-700 text-center">{course.credits}</td>
                  <td className="py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getGradeColor(course.grade)}`}>
                      {course.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Summary bar ── */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{summary?.total_courses ?? 0}</p>
            <p className="text-sm opacity-90">Courses</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{summary?.matched_subjects ?? 0}</p>
            <p className="text-sm opacity-90">Matched Subjects</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{summary?.total_hard_skills ?? 0}</p>
            <p className="text-sm opacity-90">Hard Skills</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{summary?.cumulative_gpa?.toFixed(2) ?? '—'}</p>
            <p className="text-sm opacity-90">GPA</p>
          </div>
        </div>
      </div>

      {/* ── Top Skills ── */}
      {top_skills && top_skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Hard Skills</h2>
          <div className="space-y-4">
            {top_skills.map((skill, i) => (
              <div key={skill.skill_id}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{['🥇','🥈','🥉','4️⃣','5️⃣'][i] ?? ''}</span>
                    <span className="font-medium text-gray-800">{skill.skill_name_en}</span>
                    {skill.skill_name_th && (
                      <span className="text-xs text-gray-400">({skill.skill_name_th})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getLevelColor(skill.level)}`}>
                      Level {skill.level}
                    </span>
                    <span className="text-sm font-bold text-gray-700">{skill.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getScoreBarColor(skill.percentage)}`}
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Hard Skills ── */}
      {hard_skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Hard Skills
            <span className="ml-2 text-base font-normal text-gray-500">({hard_skills.length} skills)</span>
          </h2>
          <div className="space-y-3">
            {[...hard_skills].sort((a, b) => b.percentage - a.percentage).map((skill) => (
              <div key={skill.skill_id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{skill.skill_name_en}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getLevelColor(skill.level)}`}>
                      Lv.{skill.level}
                    </span>
                    <span className="text-sm text-gray-600">{skill.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBarColor(skill.percentage)}`}
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Soft Skills ── */}
      {soft_skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Soft Skills
            <span className="ml-2 text-base font-normal text-gray-500">({soft_skills.length} skills)</span>
          </h2>
          <div className="space-y-3">
            {[...soft_skills].sort((a, b) => b.percentage - a.percentage).map((skill) => (
              <div key={skill.skill_id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{skill.skill_name_en}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getLevelColor(skill.level)}`}>
                      Lv.{skill.level}
                    </span>
                    <span className="text-sm text-gray-600">{skill.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-purple-400`}
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Job Recommendations ── */}
      {job_recommendations && job_recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Recommendations</h2>
          <div className="space-y-3">
            {job_recommendations.map((job, index) => (
              <div
                key={job.job_id}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/job/${job.job_id}`, { state: { job } })}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 font-mono">#{index + 1}</span>
                      <p className="font-semibold text-gray-800">{job.job_name_en}</p>
                    </div>
                    {job.job_field?.name_en && (
                      <p className="text-xs text-purple-600 mt-1">{job.job_field.name_en}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-2xl font-bold text-purple-700">{job.overall_score}%</p>
                    <p className="text-xs text-gray-400">match</p>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Hard Skills:</span> {job.hard_skills_score}%
                    <span className="ml-1 text-gray-400">
                      ({job.stats.matched_hard_skills}/{job.stats.total_required_hard_skills})
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Soft Skills:</span> {job.soft_skills_score}%
                    <span className="ml-1 text-gray-400">
                      ({job.stats.matched_soft_skills}/{job.stats.total_required_soft_skills})
                    </span>
                  </div>
                </div>

                {/* Overall score bar */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBarColor(job.overall_score)}`}
                    style={{ width: `${job.overall_score}%` }}
                  />
                </div>

                {/* Click to see full breakdown */}
                <p className="mt-2 text-xs text-purple-400 text-right">Click for details →</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalysisResult;
