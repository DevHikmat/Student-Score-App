import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { HistoryService } from "../../services/history-service";
import { HistoryActions } from "../../store/history-slice";
import { UserService } from '../../services/user-service';
import { LeftOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Divider, Modal } from 'antd';
import passed from "../../static/passed.mp3";
import fail from "../../static/fail.mp3";
import { Link } from 'react-router-dom';

const ExamResult = ({ currentExam }) => {
    const answerList = useSelector(state => state.auth.currentUser.answerList);
    const answers = useSelector(state => state.exam.answers);
    const userId = useSelector(state => state.auth.currentUser._id);
    const balls = useSelector(state => state.auth.currentUser.balls);
    const { title, countQuestion, _id, questions, maxBall } = currentExam;
    const [starShowingItems, setStarShowingItems] = useState([])
    const [modal, setModal] = useState(true);
    const dispatch = useDispatch();
    const passedRef = useRef(null);
    const failRef = useRef(null);
    const [result, setResult] = useState({
        correctCount: 0,
        currentBall: 0,
        currentStar: 0,
    })


    let addingStars = 0;

    const calcResult = () => {
        let count = 0;
        questions.forEach((item, index) => { if (item.correctAnswer === answers[index].answer) count++; })
        setResult(prev => ({ ...prev, correctCount: count }));
        handleUpdUserBalls(count);
        handleAddHistory(count);
    }

    const handleAddHistory = async (count) => {
        dispatch(HistoryActions.reqHistoryStart())
        try {
            let userStars = await answerList?.find(item => item._id === _id)?.stars;
            if (count === 20) {
                addingStars = 3;
                setResult(prev => ({ ...prev, bonusBall: Math.trunc(maxBall / 4) }))
            }
            else if (count >= 15) addingStars = 2;
            else if (count >= 10) addingStars = 1;
            setResult(prev => ({ ...prev, currentStar: addingStars, correctCount: count }));
            userStars += addingStars;
            let arr = [];
            const history = { title, countQuiz: countQuestion, correctCount: count, userId, quizId: _id, userStars };
            for (let i = 0; i < 3; i++) {
                if (i < addingStars) arr.push(<div key={i} className={`star-${i + 1} filled`}><StarFilled /></div>);
                else arr.push(<div key={i} className={`star-${i + 1} outlined`}><StarOutlined /></div>);
            }
            setStarShowingItems(arr);
            const data = await HistoryService.addHistory(history);
            if (addingStars === 0) failRef.current.play();
            else passedRef.current.play();
            dispatch(HistoryActions.reqHistorySuccess());
        } catch (error) {
            console.log(error);
            dispatch(HistoryActions.reqHistoryFailure())
        }
    }

    const handleUpdUserBalls = async (count) => {
        let currentBall = 0;
        try {
            if (count < 10) currentBall = balls > maxBall ? -maxBall : -balls;
            else if (count <= 15) currentBall = balls > maxBall / 2 ? -maxBall / 2 : -balls;
            else if (count < 19) currentBall = maxBall;
            else {
                currentBall = maxBall + 5;
            }
            setResult(prev => ({ ...prev, currentBall }));
            const data = await UserService.updUser(userId, { balls: balls + currentBall });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        calcResult();
    }, [])

    return (
        <div className='exam-result'>
            <audio ref={passedRef} src={passed}></audio>
            <audio ref={failRef} src={fail}></audio>
            <Modal footer={false} open={modal} title={"Sizning natijangiz!"}>
                <div className="star-box">
                    {starShowingItems.map(item => (item))}
                </div>
                <div className="exam-info">
                    <Divider>To'g'ri javoblar soni: {result.correctCount}</Divider>
                    <Divider>Qo'lga kiritilgan ball: {result.currentBall}</Divider>
                    <Link to="/student" icon={<LeftOutlined />} style={{ border: 'none' }}>Bosh sahifaga qaytish</Link>
                </div>
            </Modal>

        </div>
    )
}

export default ExamResult