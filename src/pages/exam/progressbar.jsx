import React, { useEffect, useState } from 'react'

const initialTime = 50;

const Progressbar = ({ activeQuestionIndex, handleNextQuestion, countQue, handleFinishExam }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft <= 0 && countQue === activeQuestionIndex + 1) return handleFinishExam();
        if (timeLeft <= 0) return handleNextQuestion();
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000)
        return () => clearInterval(intervalId)
    }, [timeLeft])

    useEffect(() => {
        setTimeLeft(initialTime);
    }, [activeQuestionIndex])

    const progress = (timeLeft / initialTime) * 100;


    return (
        <div className='progressbar'>
            <div className='progressbar-content'>
                <div className='progressbar-inner' style={{ width: `${progress}%` }}>
                    <small>{timeLeft} s</small>
                </div>
            </div>
        </div>
    )
}

export default Progressbar