import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { HistoryService } from "../../services/history-service";
import { HistoryActions } from "../../store/history-slice";
import { UserService } from '../../services/user-service';
import { LeftOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import passed from "../../static/passed.mp3";
import fail from "../../static/fail.mp3";
import { Link } from 'react-router-dom';
import ExamShowcase from './exam-showcase';

const ExamResult = ({ currentExam }) => {
    const answers = useSelector(state => state.exam.answers);
    const userId = useSelector(state => state.auth.currentUser._id);
    const balls = useSelector(state => state.auth.currentUser.balls);
    const { title, countQuestion, _id, questions, maxBall } = currentExam;
    const [starShowingItems, setStarShowingItems] = useState([])
    const dispatch = useDispatch();
    const passedRef = useRef(null);
    const failRef = useRef(null);
    const [result, setResult] = useState(null);

    const handleAddHistory = async () => {
        let answer = { correctCount: 0 };
        questions.forEach((item, index) => item.correctAnswer === answers[index].answer && (answer.correctCount += 1));
        dispatch(HistoryActions.reqHistoryStart())
        let count = answer.correctCount;
        try {
            if (count === countQuestion) answer = { ...answer, currentStar: 3, bonusBall: Math.trunc(maxBall / 4), currentBall: maxBall };
            else if (count >= Math.round(countQuestion * 3 / 4)) answer = { ...answer, currentStar: 2, bonusBall: 0, currentBall: maxBall };
            else if (count >= Math.round(countQuestion / 2)) answer = { ...answer, currentStar: 1, bonusBall: 0, currnetBall: balls >= maxBall / 2 ? -maxBall / 2 : -balls };
            else answer = { ...answer, currentStar: 0, bonusBall: 0, currentBall: balls >= maxBall ? -maxBall : -balls };

            setResult(answer);
            let arr = [];

            const history = { title, countQuiz: countQuestion, correctCount: count, userId, quizId: _id, userStars: answer.currentStar };
            await HistoryService.addHistory(history);
            dispatch(HistoryActions.reqHistorySuccess());

            for (let i = 0; i < 3; i++) {
                if (i < answer.currentStar) arr.push(<div key={i} className={`star-${i + 1} filled`}><StarFilled /></div>);
                else arr.push(<div key={i} className={`star-${i + 1} outlined`}><StarOutlined /></div>);
            }

            setStarShowingItems(arr);
            if (answer.currentStar === 0) failRef.current.play();
            else passedRef.current.play();

        } catch (error) {
            console.log(error);
            dispatch(HistoryActions.reqHistoryFailure())
        }
    }

    const handleUpdUserBalls = async () => {
        if (!result) return;
        try {
            await UserService.updUser(userId, { balls: balls + (result.currentBall + result.bonusBall) });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleAddHistory()
    }, [])

    useEffect(() => {
        handleUpdUserBalls()
    }, [result])

    return (
        result && <div className='exam-result'>
            <audio ref={passedRef} src={passed}></audio>
            <audio ref={failRef} src={fail}></audio>
            <div className="star-box">
                {starShowingItems.map(item => (item))}
            </div>
            <div className="exam-info">
                <Divider>To'g'ri javoblar soni: {result.correctCount}</Divider>
                <Divider>
                    <span>{result.currentBall >= 0 ? "Qo'lga kiritilgan ball: " : "Jarima ball: "} {result.currentBall}</span>
                </Divider>
                <Divider>Bonus ball: {result.bonusBall}</Divider>
                <Link to="/student" icon={<LeftOutlined />} style={{ border: 'none' }}>Bosh sahifaga qaytish</Link>
            </div>
            <div className="show-case">
                <h3 className="text-center">Javoblar tahlili</h3>
                <ExamShowcase currentExam={currentExam} />
            </div>
        </div>
    )
}

export default ExamResult