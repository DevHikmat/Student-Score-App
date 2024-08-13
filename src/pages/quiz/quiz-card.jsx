import { DeleteOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col } from 'antd'
import React, { memo } from 'react'
import { Link } from 'react-router-dom';

const QuizCard = ({ quizItem, openModal, openDrawer, role, quizInfo }) => {
    const { isAccess, stars } = quizInfo || {};
    const { countQuestion, image, maxBall, ovrStars, title, _id } = quizItem;
    const { url } = image;

    let cardClassname = 'quiz-card';
    if (role !== 'admin') {
        isAccess ? cardClassname += " hoverable" : cardClassname += " disabled-quiz";
    }

    const contentBox = <div className={cardClassname}>
        <div className="card-header">
            {role === "student" && <div className="card-header-star">
                <div className='box'>
                    <span>{stars} / {ovrStars}</span> <i className="fa-solid fa-star"></i>
                </div>
            </div>}
            <img src={url} alt={title} />
            {role === "admin" && <div className="quiz-card-actions">
                <Link to={`quiz/${_id}`}><Button ghost icon={<EyeOutlined />}></Button></Link>
                <Button onClick={() => openDrawer(quizItem)} ghost icon={<SettingOutlined />}></Button>
                <Button onClick={() => openModal(_id)} ghost icon={<DeleteOutlined />}></Button>
            </div>}
        </div>
        <div className="card-body">
            <h3 style={{ textTransform: "uppercase", marginBottom: "10px" }}>{title}</h3>
            <ul>
                <li>Savollar soni: {countQuestion}</li>
                <li>Maximal ball: {maxBall}</li>
                <li>Yulduzlar soni: {ovrStars}</li>
            </ul>
        </div>
    </div>

    return (
        <Col xs={24} sm={24} md={6} lg={6} xxl={6}>
            {role !== "admin" && isAccess ? <Link to={`quiz/${_id}`}>{contentBox}</Link> : contentBox}
        </Col>
    )
}

export default memo(QuizCard)