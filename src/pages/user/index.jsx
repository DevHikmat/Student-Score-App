import React, { useEffect, useState } from 'react'
import ContentHeader from '../../UI/content-header/content-header';
import { UserService } from "../../services/user-service";
import { Button, Drawer, Form, Image, Input, message, Popconfirm, Skeleton, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { UserActions } from '../../store/user-slice';
import { AuthService } from '../../services/auth-service';
import { FindUserStatus } from '../../utils/FindUserStatus';
const avatar = 'https://static.vecteezy.com/system/resources/previews/013/360/247/original/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg';

const Student = () => {
    const { role, _id } = useSelector(state => state.auth.currentUser);
    const { isChange, loading } = useSelector(state => state.user);
    const [students, setStudents] = useState(null);
    const [drawer, setDrawer] = useState(false);
    const [isUpdate, setIsUpdate] = useState({ agree: false, user: null });
    const [form] = Form.useForm();

    const rowClassName = (record, index) => {
        return record._id === _id ? 'current-user-row' : '';
    };

    const dispatch = useDispatch()

    const openDrawer = () => {
        setDrawer(true);
    }
    const closeDrawer = () => {
        setDrawer(false);
        setIsUpdate(prev => ({ agree: false, user: null }));
        form.resetFields();
    }

    const handleCreateStudent = async () => {
        try {
            dispatch(UserActions.reqUserStart())
            await AuthService.signup({ ...form.getFieldsValue() });
            message.success("O'quvchi qo'shildi");
            dispatch(UserActions.reqUserSuccess())
            closeDrawer()
        } catch (error) {
            console.log(error);
            dispatch(UserActions.reqUserFailure());
        }
    }

    const handleDeleteStudent = async (_id) => {
        try {
            dispatch(UserActions.reqUserStart())
            const data = await UserService.delUser(_id);
            message.success(data.message);
            dispatch(UserActions.reqUserSuccess())
        } catch (error) {
            console.log(error)
            dispatch(UserActions.reqUserFailure());
        }
    }

    const handleOpenEditable = (user) => {
        setIsUpdate(prev => ({ agree: true, user }));
        openDrawer();
        const updatingUser = students.find(item => item._id === user._id);
        const { firstName, lastName, email } = updatingUser;
        form.setFieldsValue({ firstName, lastName, email });
    }

    const handleUpdateStudent = async () => {
        const newInfo = form.getFieldsValue();
        try {
            if (!newInfo.password) delete newInfo.password;
            if (newInfo.email === isUpdate.user.email) delete newInfo.email;
            dispatch(UserActions.reqUserStart())
            console.log(isUpdate)
            await UserService.updUser(isUpdate.user._id, newInfo);
            closeDrawer();
            dispatch(UserActions.reqUserSuccess())
        } catch (error) {
            console.log(error);
            dispatch(UserActions.reqUserFailure());
        }
    }

    const fetchStudentsHandler = async () => {
        try {
            const data = await UserService.getSortedStudents();
            setStudents(data.users.map((item, index) => ({ ...item, order: index + 1, key: item._id })));
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchStudentsHandler();
    }, [isChange])

    let tableColumns = [
        { key: "order", dataIndex: "order", title: "O'rin", width: 80 },
        { key: "rasmi", render: (item) => <Image width={30} height={30} src={item.profilePicture ? item.profilePicture.url : avatar} />, title: 'Rasmi' },
        { key: "firstname", dataIndex: "firstName", title: "Ism" },
        { key: "lastname", dataIndex: "lastName", title: "Familya" },
        {
            key: "ball", render: (item) => {
                return <span style={{ display: 'flex', gap: "20px", alignItems: "center" }}>
                    <strong>{item.balls}</strong> <span style={{ color: "#e78e25" }} className='fa-solid fa-trophy'></span>
                </span>
            }, title: "Jamlagan ball", width: 150
        },
        {
            key: "level", title: "Maqomi", render: (item) => <b style={{ textTransform: "uppercase", color: "#505050" }}>{FindUserStatus(item.balls)}</b>
        },
    ]
    if (role === 'admin') tableColumns = [...tableColumns, {
        key: "amaliyot", title: "Amaliyot", render: (item) => <div style={{ display: "flex", gap: "15px" }}>
            <Popconfirm onConfirm={() => handleDeleteStudent(item._id)} title="Ishonchiz komilmi?" okText="ha" cancelText="yo'q" okType='danger'>
                <Button icon={<DeleteOutlined />}></Button>
            </Popconfirm>
            <Button icon={<EditOutlined />} onClick={() => handleOpenEditable(item)}></Button>
        </div>
    }];
    return (
        <div className='student'>
            <ContentHeader openDrawer={openDrawer} section="student" />
            {students ? <Table rowClassName={rowClassName} size='small' pagination={{ pageSize: students.length, hideOnSinglePage: true }} columns={tableColumns} dataSource={students} /> : <Skeleton active />}
            <Drawer title={isUpdate.agree ? "Ma'lumotlarni o'zgartrish" : "Student qo'shish"} open={drawer} onClose={closeDrawer}>
                <Form onFinish={isUpdate.agree ? handleUpdateStudent : handleCreateStudent} layout='vertical' form={form}>
                    <Form.Item name="firstName" label="Ism" rules={[{ required: true, message: "Ism kiriting" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Familya" rules={[{ required: true, message: "Familya kiriting" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="E-mail" rules={[{ required: true, message: "Email kiriting" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Parol" rules={[{ required: !isUpdate.agree, message: "Parol kiriting" }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button loading={loading} disabled={loading} htmlType='submit' style={{ marginTop: "30px" }} icon={<PlusOutlined />} type='primary'>Saqlash</Button>
                </Form>
            </Drawer>
        </div>
    )
}

export default Student