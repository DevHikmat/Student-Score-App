import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QuizService } from '../../services/quiz-service';
import ContentHeader from '../../UI/content-header/content-header';
import { Button, Drawer, Dropdown, Form, Image, Input, message, Popconfirm, Skeleton, Space, Table } from 'antd';
import { DeleteOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { openNotification } from '../../utils/Messenger';
import { QuestionService } from "../../services/question-service";
import { useDispatch, useSelector } from 'react-redux';
import { QuizActions } from '../../store/quiz-slice';

const { TextArea } = Input;
const { Column } = Table;


const choiceItemCreator = (item) => {
    const { variant2, variant3, variant4 } = item;
    return { items: [{ label: variant2, key: 1 }, { label: variant3, key: 2 }, { label: variant4, key: 3 }] };
}

const QuizView = () => {
    const { isChange, loading } = useSelector(state => state.quiz);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [drawer, setDrawer] = useState(false);
    const [queImg, setQueImg] = useState('');
    const { id } = useParams();
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const openDrawer = () => {
        setDrawer(true);
    }
    const closeDrawer = () => {
        setDrawer(false);
        form.resetFields()
        setQueImg('');
    }

    const handleAddQuestion = async () => {
        const { questionText, correctAnswer, variant2, variant3, variant4 } = form.getFieldsValue();
        if (!questionText || !correctAnswer || !variant2 || !variant3 || !variant4)
            return openNotification("warning", "Maydon bo'sh", "Iltimos barcha maydonni to'ldiring");
        try {
            const formdata = new FormData();
            formdata.append("questionText", questionText);
            formdata.append("correctAnswer", correctAnswer);
            formdata.append("variant2", variant2);
            formdata.append("variant3", variant3);
            formdata.append("variant4", variant4);
            formdata.append("questionImage", queImg);
            formdata.append("quizId", id);
            dispatch(QuizActions.reqQuizStart());
            const data = await QuestionService.addQuestion(formdata);
            message.success(data.message);
            form.resetFields();
            dispatch(QuizActions.reqQuizSuccess());
        } catch (error) {
            console.log(error);
            dispatch(QuizActions.reqQuizFailure())
        }
    }

    const handleDeleteQuestion = async (_id) => {
        try {
            dispatch(QuizActions.reqQuizStart());
            const data = await QuestionService.delQuestion(_id);
            message.success(data.message);
            dispatch(QuizActions.reqQuizSuccess());
        } catch (error) {
            console.log(error);
            dispatch(QuizActions.reqQuizFailure())
        }
    }

    const fetchCurrentQuiz = async () => {
        try {
            const data = await QuizService.getOne(id);
            let quiz = data.quiz[0];
            let newQuestions = quiz.questions.map((item, index) => ({ ...item, key: ++index }));
            quiz.questions = newQuestions;
            setCurrentQuiz(quiz);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchCurrentQuiz();
    }, [id, isChange])

    return (
        <div className='quiz-view'>
            <ContentHeader section="savol" openDrawer={openDrawer} />
            <Drawer onClose={closeDrawer} open={drawer} title="Savolni kiriting.">
                {
                    <label id='addition-label' htmlFor="add-question">
                        {queImg ? <img src={typeof queImg === 'object' ? URL.createObjectURL(queImg) : queImg} alt="question image" /> :
                            <i className="fa-solid fa-plus"></i>}
                        <input accept='image/png, image/jpg, image/jpeg' onChange={(e) => setQueImg(e.target.files[0])} id='add-question' type="file" />
                    </label>
                }
                <Form layout='vertical' form={form}>
                    <Form.Item name="questionText" label="Savol matni">
                        <TextArea />
                    </Form.Item>
                    <Form.Item name="correctAnswer" label="To'g'ri javob">
                        <Input />
                    </Form.Item>
                    <Form.Item name="variant2" label="Xato 1">
                        <Input />
                    </Form.Item>
                    <Form.Item name="variant3" label="Xato 2">
                        <Input />
                    </Form.Item>
                    <Form.Item name="variant4" label="Xato 3">
                        <Input />
                    </Form.Item>
                    <Button loading={loading} disabled={loading} onClick={handleAddQuestion} icon={<PlusOutlined />} type='primary'>Qo'shish</Button>
                </Form>
            </Drawer>

            {
                currentQuiz ? <div>
                    {currentQuiz.questions.length > 0 ? <Table dataSource={currentQuiz.questions}>
                        <Column title="#" dataIndex="key"></Column>
                        <Column title="Savol rasmi" render={(item) => {
                            return item.questionImage ? <Image style={{ width: "50px", height: "50px", objectFit: "cover" }} src={item.questionImage.url} /> : "Rasmsiz!";
                        }}></Column>
                        <Column title="Savol matni" dataIndex="questionText"></Column>
                        <Column title="Javobi" dataIndex="correctAnswer"></Column>
                        <Column title="Variantlar" render={(item) => {
                            return <Dropdown
                                menu={choiceItemCreator(item)}
                                trigger={['click']}>
                                <Space style={{ cursor: "pointer" }}>
                                    ko'rish
                                    <DownOutlined />
                                </Space>
                            </Dropdown>
                        }}></Column>
                        <Column title="Amaliyotlar" render={(item) => {
                            return <>
                                <Popconfirm onConfirm={() => handleDeleteQuestion(item._id)} title="Ishonchingiz komilmi?" okText="ha" cancelText="yo'q" okType='danger'>
                                    <Button icon={<DeleteOutlined />}></Button>
                                </Popconfirm>
                            </>
                        }}></Column>
                    </Table> : <h3 style={{ color: "red" }}>Savollar mavjud emas!</h3>}
                </div> : <Skeleton active />
            }
        </div>
    )
}

export default QuizView