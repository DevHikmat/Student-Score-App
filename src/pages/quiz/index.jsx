import React, { useEffect, useState } from 'react'
import { QuizService } from "../../services/quiz-service";
import { useDispatch, useSelector } from 'react-redux';
import { QuizActions } from '../../store/quiz-slice';
import { Button, Drawer, Form, Input, message, Modal, Row, Skeleton } from 'antd';
import QuizCard from './quiz-card';
import "./quiz.scss";
import ContentHeader from '../../UI/content-header/content-header';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { openNotification } from '../../utils/Messenger';

const Quiz = () => {
    const { role, answerList } = useSelector(state => state.auth.currentUser);
    const { loading, isChange } = useSelector(state => state.quiz);
    const [quizzes, setQuizzes] = useState(null);
    const [quizImg, setQuizImg] = useState('');
    const [public_id, setPublic_id] = useState(null);
    const [tempId, setTempId] = useState(null);
    const [isQuizUpdate, setIsQuizUpdate] = useState(false);

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [modal, setModal] = useState(false);
    const [drawer, setDrawer] = useState(false);

    const openModal = (_id) => {
        setModal(true);
        setTempId(_id);
    }

    const openDrawer = (quizItem) => {
        setDrawer(true);
        if (quizItem && quizItem.type && quizItem.target) {
            setIsQuizUpdate(false);
        } else {
            setIsQuizUpdate(true);
            const { title, countQuestion, maxBall, ovrStars, image, _id } = quizItem;
            form.setFieldsValue({ title, countQuestion, maxBall, ovrStars });
            setQuizImg(image.url);
            setPublic_id(image.public_id);
            setTempId(_id);
        }
    }
    const closeDrawer = () => {
        setDrawer(false);
        form.resetFields();
        setQuizImg('');
        setPublic_id(null);
    }

    const fetchQuizHandler = async () => {
        try {
            const data = await QuizService.getAll();
            console.log(data.quiz)
            setQuizzes(data.quiz);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchQuizHandler();
    }, [isChange])

    const handleChangeQuiz = async () => {
        const { title, countQuestion, maxBall, ovrStars } = form.getFieldsValue();
        if (!title || !countQuestion || !maxBall || !ovrStars || !quizImg)
            return openNotification("warning", "Maydon bo'sh", "Iltimos, barcha maydonni to'ldiring!");
        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('countQuestion', countQuestion);
        formdata.append('maxBall', maxBall);
        formdata.append('ovrStars', ovrStars);
        if (isQuizUpdate) {
            typeof quizImg === "object" && formdata.append('image', quizImg);
            typeof quizImg === "object" && formdata.append('public_id', public_id);
        } else {
            formdata.append('image', quizImg);
        }
        try {
            dispatch(QuizActions.reqQuizStart());
            const data = isQuizUpdate ? await QuizService.updQuiz(tempId, formdata) : await QuizService.addQuiz(formdata);
            dispatch(QuizActions.reqQuizSuccess());
            message.success(data.message);
            closeDrawer();
        } catch (error) {
            console.log(error)
            dispatch(QuizActions.reqQuizFailure());
        }
    }

    const handleDeleteQuiz = async () => {
        dispatch(QuizActions.reqQuizStart());
        try {
            const data = await QuizService.delQuiz(tempId);
            message.success(data.message);
            dispatch(QuizActions.reqQuizSuccess())
            setModal(false);
        } catch (error) {
            console.log(error);
            dispatch(QuizActions.reqQuizFailure());
        }
    }
    return (
        <div className='quiz'>
            <ContentHeader section={"quiz"} openDrawer={openDrawer} />
            {quizzes ? (
                quizzes.length > 0 ? <div>
                    <Row gutter={[24, 24]}>
                        {quizzes.map((item, index) => (<QuizCard quizInfo={answerList[index]} role={role} key={item._id} quizItem={item} openDrawer={openDrawer} openModal={openModal} />))}
                    </Row>
                    <Modal style={{ top: "20px" }} onOk={handleDeleteQuiz} okText="ha" okType='danger' cancelText="Bekor qilish" title={<span>
                        <InfoCircleOutlined style={{ marginRight: 8, color: "red" }} />
                        Ishonchingiz komilmi ?
                    </span>} onCancel={() => setModal(false)} open={modal}>
                        <p>Kategoriyani o'chirishni rostdan ham xoxlaysizmi?</p>
                    </Modal>
                </div> : <h3 style={{ color: "red" }}>Quizlar mavjud emas!</h3>
            ) : <Skeleton active />}
            <Drawer width={440} onClose={closeDrawer} open={drawer} title="Yangi quiz qo'shish">
                <div id="addition">
                    <label htmlFor='new-quiz-image' id='addition-label'>
                        {quizImg ? <img src={typeof quizImg === "object" ? URL.createObjectURL(quizImg) : quizImg} alt="image" /> :
                            <i className='fa-solid fa-plus'></i>}
                        <input onChange={(e) => setQuizImg(e.target.files[0])} id='new-quiz-image' type="file" accept='image/png, image/jpg, image/jpeg' />
                    </label>
                    <Form form={form} labelAlign='left' labelCol={{ span: 8 }}>
                        <Form.Item name="title" label="Quiz nomi">
                            <Input />
                        </Form.Item>
                        <Form.Item name="countQuestion" label="Savollar soni">
                            <Input />
                        </Form.Item>
                        <Form.Item name="maxBall" label="Maximum ball">
                            <Input />
                        </Form.Item>
                        <Form.Item name="ovrStars" label="Urinishlar soni">
                            <Input />
                        </Form.Item>
                        <Button loading={loading} disabled={loading} onClick={handleChangeQuiz} icon={<PlusOutlined />} type='primary'>
                            {isQuizUpdate ? "O'zgarishlarni saqlash" : "Quizni qo'shish"}
                        </Button>
                    </Form>
                </div>
            </Drawer>
        </div>
    )
}

export default Quiz