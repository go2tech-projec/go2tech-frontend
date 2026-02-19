const DebugView = ({ debugInfo }) => {
  if (!debugInfo) {
    return null;
  }

  // Format debug data as plain text
  const formatDebugText = () => {
    let output = '';

    output += '='.repeat(80) + '\n';
    output += 'DEBUG INFORMATION (TEACHER VIEW)\n';
    output += '='.repeat(80) + '\n\n';

    // Text Statistics
    output += '--- TEXT STATISTICS ---\n';
    output += `Text Length: ${debugInfo.text_length} characters\n`;
    output += `Is Scanned PDF: ${debugInfo.is_scanned ? 'Yes' : 'No'}\n\n`;

    // Raw Text (FIRST - Show original PDF text)
    output += '='.repeat(80) + '\n';
    output += '--- RAW TEXT (EXTRACTED FROM PDF) ---\n';
    output += '='.repeat(80) + '\n';
    output += debugInfo.raw_text + '\n\n';

    // Parsed Data (SECOND - Show data after regex cleaning)
    output += '='.repeat(80) + '\n';
    output += '--- PARSED DATA (AFTER REGEX CLEANING) ---\n';
    output += '='.repeat(80) + '\n\n';

    // Student Info Debug
    if (debugInfo.student_info_debug) {
      output += '>>> STUDENT INFO:\n';
      output += `Found: ${debugInfo.student_info_debug.found ? 'Yes' : 'No'}\n`;
      if (debugInfo.student_info_debug.found) {
        output += `Name: ${debugInfo.student_info_debug.name}\n`;
        output += `Student ID: ${debugInfo.student_info_debug.student_id}\n`;
        output += `Major: ${debugInfo.student_info_debug.major}\n`;
        output += `Degree: ${debugInfo.student_info_debug.degree}\n`;
        output += `GPA: ${debugInfo.student_info_debug.gpa}\n`;
        output += `Credits: ${debugInfo.student_info_debug.credits}\n`;
      }
      output += '\n';
    }

    // Parsed Courses (before categorization)
    if (debugInfo.parsed_courses_raw && debugInfo.parsed_courses_raw.length > 0) {
      output += '>>> COURSES (PARSED, BEFORE CATEGORIZATION):\n';
      output += `Total: ${debugInfo.parsed_courses_raw.length} courses\n\n`;
      debugInfo.parsed_courses_raw.forEach((course, index) => {
        output += `[${index + 1}] ${course.course_code} - ${course.course_name}\n`;
        output += `    Credits: ${course.credits} | Grade: ${course.grade}\n`;
        output += '\n';
      });
    }

    // Courses Statistics
    if (debugInfo.courses_stats) {
      output += '>>> STATISTICS:\n';
      output += `Total Courses: ${debugInfo.courses_stats.total_courses}\n`;
      output += `Courses with Grade: ${debugInfo.courses_stats.courses_with_grade}\n`;
      output += `Courses In Progress: ${debugInfo.courses_stats.courses_in_progress}\n\n`;
    }

    // Categorization Details (THIRD - Show categorized data)
    output += '='.repeat(80) + '\n';
    output += '--- CATEGORIZATION (AFTER KEYWORD MATCHING) ---\n';
    output += '='.repeat(80) + '\n\n';

    if (debugInfo.categorization_details && debugInfo.categorization_details.length > 0) {
      debugInfo.categorization_details.forEach((detail, index) => {
        output += `[${index + 1}] ${detail.course_code} - ${detail.course_name}\n`;
        output += `    Grade: ${detail.grade} | Credits: ${detail.credits}\n`;
        output += `    Categories: ${detail.categories.join(', ')}\n`;
        output += `    Matched Keywords: ${detail.matched_keywords.join(', ')}\n`;
        output += '\n';
      });
    }

    // Regex Patterns Info
    if (debugInfo.regex_patterns_info) {
      output += '='.repeat(80) + '\n';
      output += '--- AVAILABLE CATEGORIES (KEYWORDS) ---\n';
      output += '='.repeat(80) + '\n';
      output += `Total Categories: ${debugInfo.regex_patterns_info.total_categories}\n\n`;
      debugInfo.regex_patterns_info.categories.forEach((cat) => {
        output += `  - ${cat}\n`;
      });
      output += '\n';
    }

    output += '='.repeat(80) + '\n';
    output += 'END OF DEBUG INFORMATION\n';
    output += '='.repeat(80) + '\n';

    return output;
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-6">
      <div className="bg-gray-900 text-green-400 rounded-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-green-300">
            TEACHER MODE - DEBUG OUTPUT
          </h2>
          <button
            onClick={() => {
              navigator.clipboard.writeText(formatDebugText());
              alert('Debug output copied to clipboard!');
            }}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
        <pre className="font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
          {formatDebugText()}
        </pre>
      </div>
    </div>
  );
};

export default DebugView;
