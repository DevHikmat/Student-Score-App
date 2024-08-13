import React from 'react'

const ExamChoiceItem = ({ getAnswerFromInput, option, _id }) => {
    let inputId = String(Math.random());
    return (
        <li>
            <label htmlFor={inputId}>
                <input onChange={() => getAnswerFromInput(option)} name={_id} id={inputId} type="radio" />
                <span>{option}</span>
            </label>
        </li>
    )
}

export default ExamChoiceItem