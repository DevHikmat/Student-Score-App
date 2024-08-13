import React, { useEffect, useState } from 'react'
import ExamChoiceItem from './exam-choice-item';

const ExamChoice = ({ question, getAnswerFromInput }) => {
    const { correctAnswer, variant2, variant3, variant4, _id } = question || {};
    const initialArray = [correctAnswer, variant2, variant3, variant4];
    const [shuffledArray, setShuffledArray] = useState([]);

    const shuffle = (array) => {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    useEffect(() => {
        document.querySelectorAll("input").forEach(input => input.checked = false);
        setShuffledArray(shuffle([...initialArray]));
    }, [question]);
    return (
        <div className='exam-choices'>
            <ul>
                {shuffledArray.map(item => <ExamChoiceItem key={item} getAnswerFromInput={getAnswerFromInput} option={item} _id={_id} />)}
            </ul>
        </div>
    )
}

export default ExamChoice