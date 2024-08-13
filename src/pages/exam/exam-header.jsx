import React from 'react'

const ExamHeader = ({ currentExam, activeQuestionIndex }) => {
    const { image, countQuestion, title } = currentExam;
    return (
        <div className='exam-header'>
            <ul className="exam-header-content">
                <li className="exam-header-item">
                    <img src={image?.url} alt={title} />
                    <h3>{title}</h3>
                </li>
                <li className="exam-header-item">
                    <p><span>{activeQuestionIndex + 1}</span> <i>/</i> {countQuestion}</p>
                </li>
            </ul>
        </div>
    )
}

export default ExamHeader