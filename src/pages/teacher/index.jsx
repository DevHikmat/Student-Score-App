import React, { useState } from 'react'
import ContentHeader from '../../UI/content-header/content-header'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Divider, Drawer, Form, Input, message, Modal, Popconfirm, Row } from 'antd'
import { DeleteFilled, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { AuthService } from '../../services/auth-service'
import { UserService } from '../../services/user-service'
import { openNotification } from '../../utils/Messenger'
import { UserActions } from '../../store/user-slice'
import TeacherCard from './teacher-card'
import "./teacher.scss";

let teacherAvatar = "https://img.freepik.com/free-photo/portrait-young-male-professor-education-day_23-2150980067.jpg";

const Teachers = () => {
    const { teacherList, loading } = useSelector(state => state.user)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingImg, setUpdatingImg] = useState(teacherAvatar);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const handleOpenModal = (teacher) => {
        setIsModalOpen(true);
        setEditingTeacher(teacher);
        const updatingTeacher = teacherList.find(item => item._id === teacher._id);
        const { firstName, lastName, email } = updatingTeacher;
        editForm.setFieldsValue({ firstName, lastName, email });
        if (updatingTeacher.profilePicture) setUpdatingImg(updatingTeacher.profilePicture.url);
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const openDrawer = () => {
        setIsDrawerOpen(true);
    }
    const closeDrawer = () => {
        setIsDrawerOpen(false)
        form.resetFields();
    }

    const getUpdatingTeacherImage = (e) => {
        if (e.target.files[0]) setUpdatingImg(e.target.files[0]);
    }

    const teacherCreateHandler = async () => {
        dispatch(UserActions.reqUserStart());
        const { firstName, lastName, email, password } = form.getFieldsValue();
        if (!firstName || !lastName || !email || !password)
            return openNotification("warning", "Maydon bo'sh", "Iltimos barcha malumotni kiriting");
        try {
            const data = await AuthService.signup({ ...form.getFieldsValue(), role: 'teacher' });
            dispatch(UserActions.addNewTeacher(data.user));
            closeDrawer();
        } catch (error) {
            console.log(error);
            dispatch(UserActions.reqUserFailure());
        }
    }

    const handleUpdateTeacher = async () => {
        dispatch(UserActions.reqUserStart());
        const { firstName, lastName, email } = editForm.getFieldsValue();
        try {
            const formdata = new FormData();
            typeof updatingImg === "object" && formdata.append("profilePicture", updatingImg);
            formdata.append('firstName', firstName);
            formdata.append('lastName', lastName);
            editingTeacher.email !== email && formdata.append('email', email);
            await UserService.updUser(editingTeacher._id, formdata);
            dispatch(UserActions.updateTeacher({ _id: editingTeacher._id, updatedValue: editForm.getFieldsValue() }));
            handleCloseModal();
        } catch (error) {
            dispatch(UserActions.reqUserFailure());
        }
    }

    const handleDeleteTeacher = async () => {
        try {
            const data = await UserService.delUser(editingTeacher._id);
            message.success(data.message);
            dispatch(UserActions.deleteTeacher({ _id: editingTeacher._id }));
            handleCloseModal();
        } catch (error) {
            dispatch(UserActions.reqUserFailure());
        }
    }

    return (
        <div className='teachers'>
            <ContentHeader section="ustoz" openDrawer={openDrawer} />
            <Drawer open={isDrawerOpen} onClose={closeDrawer} title="Ustoz malumotlarini kiriting">
                <Form form={form} layout='vertical'>
                    <Form.Item name="firstName" label="Ism" style={{ marginBottom: "10px" }}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Familya" style={{ marginBottom: "10px" }}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="E-mail" style={{ marginBottom: "10px" }}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Parol">
                        <Input.Password />
                    </Form.Item>
                    <Button loading={loading} disabled={loading} onClick={teacherCreateHandler} icon={<PlusOutlined />}>Qo'shish</Button>
                </Form>
            </Drawer>

            <Modal footer={false} width={800} title="Ustoz ma'lumotlarini yangilash" open={isModalOpen} onCancel={handleCloseModal}>
                <Divider />
                <Row gutter={[24]}>
                    <Col span={10}>
                        <label htmlFor='updating-teacher-avatar'>
                            <img
                                style={{ cursor: "pointer", maxWidth: "100%", height: "200px", objectFit: "cover" }}
                                src={typeof updatingImg === "string" ? updatingImg : URL.createObjectURL(updatingImg)}
                                alt='teacher image' />
                        </label>
                        <input onChange={getUpdatingTeacherImage} style={{ display: "none" }} id='updating-teacher-avatar' type="file" />
                    </Col>
                    <Col span={14}>
                        <Form form={editForm}>
                            <Form.Item name="firstName">
                                <Input />
                            </Form.Item>
                            <Form.Item name="lastName">
                                <Input />
                            </Form.Item>
                            <Form.Item name="email">
                                <Input />
                            </Form.Item>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Button onClick={handleCloseModal} style={{ marginRight: "20px" }}>Bekor qilish</Button>
                                    <Button onClick={handleUpdateTeacher} loading={loading} disabled={loading} type='primary'>Saqlash</Button>
                                </div>
                                <Popconfirm onConfirm={handleDeleteTeacher} title="Rostdanham ushbu ustoz haqidagi barcha ma'lumotlar o'chib ketishini xoxlaysizmi" okText="Ha" cancelText="Yo'q" okType='danger' icon={<DeleteFilled style={{ color: 'red' }} />}>
                                    <Button icon={<DeleteOutlined />} size='small' danger>Ustozni o'chirib tashlash</Button>
                                </Popconfirm>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Modal>

            <Row gutter={[24, 24]}>
                {teacherList?.map(teacher => <TeacherCard teacherAvatar={teacher.profilePicture?.url || teacherAvatar} handleOpenModal={handleOpenModal} key={teacher._id} teacher={teacher} />)}
            </Row>
        </div>
    )
}

export default Teachers