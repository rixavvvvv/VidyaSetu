import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/quizzes/${id}`);
      setQuiz(response.data.data);
      setTimeLeft(response.data.data.duration * 60);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      toast.error("Failed to load quiz");
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    const unanswered = quiz.questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    
    try {
      const formattedAnswers = quiz.questions.map(q => ({
        questionId: q._id,
        userAnswer: answers[q._id] || ''
      }));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/quizzes/${id}/submit`,
        {
          answers: formattedAnswers,
          startedAt: startTime.toISOString()
        }
      );

      toast.success("Quiz submitted successfully!");
      navigate(`/quizzes/${id}/result`, { state: { result: response.data.data } });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error(error.response?.data?.message || "Failed to submit quiz");
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <div className="card bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
              <p className="text-purple-100">{quiz.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <FiClock />
                <span className={timeLeft < 60 ? 'text-red-300' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-sm text-purple-100">Time Remaining</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg dark:text-gray-100">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Object.keys(answers).length} / {quiz.questions.length} answered
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              {quiz.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    currentQuestion === idx
                      ? 'bg-primary-600 text-white'
                      : answers[quiz.questions[idx]._id]
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {quiz.questions[currentQuestion] && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg dark:text-gray-100">
                    {quiz.questions[currentQuestion].questionText}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {quiz.questions[currentQuestion].points} point(s)
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  Type: {quiz.questions[currentQuestion].questionType}
                </p>
              </div>

              {quiz.questions[currentQuestion].questionType === 'mcq' && (
                <div className="space-y-3">
                  {quiz.questions[currentQuestion].options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        answers[quiz.questions[currentQuestion]._id] === option.text
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900 dark:border-primary-500'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={quiz.questions[currentQuestion]._id}
                        value={option.text}
                        checked={answers[quiz.questions[currentQuestion]._id] === option.text}
                        onChange={(e) => handleAnswerChange(quiz.questions[currentQuestion]._id, e.target.value)}
                        className="mr-3"
                      />
                      <span className="font-medium dark:text-gray-100">{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {quiz.questions[currentQuestion].questionType === 'true-false' && (
                <div className="space-y-3">
                  {['True', 'False'].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        answers[quiz.questions[currentQuestion]._id] === option
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900 dark:border-primary-500'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={quiz.questions[currentQuestion]._id}
                        value={option}
                        checked={answers[quiz.questions[currentQuestion]._id] === option}
                        onChange={(e) => handleAnswerChange(quiz.questions[currentQuestion]._id, e.target.value)}
                        className="mr-3"
                      />
                      <span className="font-medium dark:text-gray-100">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {quiz.questions[currentQuestion].questionType === 'short-answer' && (
                <textarea
                  className="input"
                  rows="4"
                  placeholder="Type your answer here..."
                  value={answers[quiz.questions[currentQuestion]._id] || ''}
                  onChange={(e) => handleAnswerChange(quiz.questions[currentQuestion]._id, e.target.value)}
                />
              )}
            </div>
          )}

          <div className="flex justify-between mt-6 pt-6 border-t dark:border-gray-700">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn btn-secondary"
            >
              Previous
            </button>
            
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="btn btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-primary flex items-center gap-2"
              >
                <FiCheckCircle />
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizAttempt;
