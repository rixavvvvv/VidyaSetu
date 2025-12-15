import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiCheckCircle, FiXCircle, FiAward, FiClock, FiTrendingUp, FiHome } from 'react-icons/fi';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    navigate('/quizzes');
    return null;
  }

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const gradeInfo = getGrade(result.percentage);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <div className={`card text-center py-12 bg-gradient-to-r ${
          result.passed 
            ? 'from-green-600 to-teal-600' 
            : 'from-red-600 to-orange-600'
        } text-white`}>
          <div className="mb-6">
            {result.passed ? (
              <FiCheckCircle className="mx-auto text-white" size={80} />
            ) : (
              <FiXCircle className="mx-auto text-white" size={80} />
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {result.passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
          </h1>
          <p className="text-xl opacity-90">
            {result.passed ? 'You passed the quiz!' : "Don't give up, you can do better!"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg inline-block mb-4">
              <FiAward className="text-blue-600 dark:text-blue-400" size={40} />
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 mb-2">Your Score</h3>
            <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {result.percentage.toFixed(1)}%
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {result.score} / {result.totalPoints} points
            </p>
            <div className={`text-3xl font-bold mt-4 ${gradeInfo.color}`}>
              Grade: {gradeInfo.grade}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold dark:text-gray-100 mb-4">Quiz Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FiClock /> Time Taken
                </span>
                <span className="font-bold dark:text-gray-200">{result.timeTaken} minutes</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FiCheckCircle className="text-green-600" /> Correct Answers
                </span>
                <span className="font-bold text-green-600">
                  {result.answers.filter(a => a.isCorrect).length}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600 flex items-center gap-2">
                  <FiXCircle className="text-red-600" /> Wrong Answers
                </span>
                <span className="font-bold text-red-600">
                  {result.answers.filter(a => !a.isCorrect).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FiTrendingUp /> Attempt Number
                </span>
                <span className="font-bold dark:text-gray-200">#{result.attemptNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-xl dark:text-gray-100 mb-4">Detailed Results</h3>
          <div className="space-y-4">
            {result.answers.map((answer, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  answer.isCorrect 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {answer.isCorrect ? (
                      <FiCheckCircle className="text-green-600" size={24} />
                    ) : (
                      <FiXCircle className="text-red-600" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium dark:text-gray-100 mb-2">Question {index + 1}</p>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-gray-600">Your answer: </span>
                        <span className={answer.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                          {answer.userAnswer || '(Not answered)'}
                        </span>
                      </p>
                      {!answer.isCorrect && (
                        <p>
                          <span className="text-gray-600">Correct answer: </span>
                          <span className="text-green-700 font-medium">
                            {answer.correctAnswer}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold dark:text-gray-200">
                      {answer.pointsEarned} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-lg dark:text-gray-100 mb-4">Performance Feedback</h3>
          <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 mb-4">
            {result.percentage >= 90 && (
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Excellent work!</strong> You've mastered this topic. Keep up the great work!
              </p>
            )}
            {result.percentage >= 70 && result.percentage < 90 && (
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Good job!</strong> You have a solid understanding. Review the questions you missed to improve further.
              </p>
            )}
            {result.percentage >= 50 && result.percentage < 70 && (
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Fair effort!</strong> You're on the right track. Spend more time studying the material and try again.
              </p>
            )}
            {result.percentage < 50 && (
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Keep practicing!</strong> This topic needs more attention. Review the material and don't hesitate to ask for help.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/quizzes" className="btn btn-primary flex items-center gap-2">
            <FiHome />
            Back to Quiz Library
          </Link>
          <Link 
            to={`/quizzes/${result.quiz._id}/attempt`}
            className="btn btn-secondary"
          >
            Retake Quiz
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default QuizResult;
