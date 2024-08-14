import { Col, Row } from 'antd';
import React from 'react'
import { useSelector } from 'react-redux'

const ExamShowcase = ({ currentExam }) => {
    const { questions } = currentExam;
    const answers = useSelector(state => state.exam.answers);


    const listItem = (variant, index) => {
        let answer = answers[index].answer;
        let className = '';

        if (answer === variant && variant === questions[index].correctAnswer) className = 'correct';
        else if (answer === variant) className = "incorrect";

        return <li className={className}>{variant}</li>;
    }
    return (
        <div className='show-case-item'>
            <Row gutter={[24, 24]}>
                {questions.map((item, index) => {
                    return <Col span={8} key={item._id}>
                        <div className="show-case-item__card">
                            <h4>{index + 1}-savol. {item.questionText}</h4>
                            <ul style={{ listStyleType: "circle; !important" }}>
                                {listItem(item.correctAnswer, index)}
                                {listItem(item.variant2, index)}
                                {listItem(item.variant3, index)}
                                {listItem(item.variant4, index)}
                            </ul>
                        </div>
                    </Col>
                })}
            </Row>
        </div>
    )
}

export default ExamShowcase