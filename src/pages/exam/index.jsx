import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QuizService } from '../../services/quiz-service';
import { Button, Skeleton } from 'antd';
import ExamHeader from './exam-header';
import "./exam.scss";
import Progressbar from './progressbar';
import ExamChoice from './exam-choice';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { ExamActions } from '../../store/exam-slice';
import ExamResult from './exam-result';

const Exam = () => {
    const isExamFinish = useSelector(state => state.exam.isExamFinish);
    const [currentExam, setCurrentExam] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const { id } = useParams();
    const dispatch = useDispatch();

    const getAnswerFromInput = (queValue) => {
        setAnswer(queValue);
    }

    const handleNextQuestion = () => {
        dispatch(ExamActions.addAnswer({ queId: currentExam.questions[activeQuestionIndex]._id, answer }));
        setActiveQuestionIndex(prev => prev + 1);
    }

    const handleFinishExam = () => {
        handleNextQuestion();
        dispatch(ExamActions.examFinish());
    }

    const fetchExam = async () => {
        try {
            const data = await QuizService.getExamQuiz(id);
            setCurrentExam(data.quizzes);
            dispatch(ExamActions.examStart());
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchExam();
    }, [id])

    return (
        currentExam && currentExam.questions.length > 0 ? <div className='exam'>
            {
                isExamFinish ? <ExamResult currentExam={currentExam} /> : <div>
                    <ExamHeader activeQuestionIndex={activeQuestionIndex} currentExam={currentExam} />
                    <Progressbar countQue={currentExam.questions.length} handleFinishExam={handleFinishExam} handleNextQuestion={handleNextQuestion} activeQuestionIndex={activeQuestionIndex} />
                    <div className='exam-question-text'>
                        {currentExam.questions[activeQuestionIndex]?.questionText}
                    </div>
                    <ExamChoice getAnswerFromInput={getAnswerFromInput} question={currentExam.questions[activeQuestionIndex]} />
                    {
                        activeQuestionIndex + 1 === currentExam.questions.length ? <Button onClick={handleFinishExam}>Yakunlash</Button> : <Button onClick={handleNextQuestion} iconPosition='end' icon={<ArrowRightOutlined />}>Keyingisi</Button>
                    }
                </div>
            }
        </div> : <Skeleton active />
    )
}

export default Exam