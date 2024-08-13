import React, { useEffect, useState } from 'react'
import ContentHeader from '../../UI/content-header/content-header';
import { UserService } from "../../services/user-service";
import { Button, Drawer, Form, Image, Input, message, Popconfirm, Skeleton, Table } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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
        form.resetFields()
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
        key: "amaliyot", title: "Amaliyot", render: (item) => <Popconfirm onConfirm={() => handleDeleteStudent(item._id)} title="Ishonchiz komilmi?" okText="ha" cancelText="yo'q" okType='danger'>
            <Button icon={<DeleteOutlined />}></Button>
        </Popconfirm>
    }];
    return (
        <div className='student'>
            <ContentHeader openDrawer={openDrawer} section="student" />
            {students ? <Table rowClassName={rowClassName} size='small' pagination={{ pageSize: students.length, hideOnSinglePage: true }} columns={tableColumns} dataSource={students} /> : <Skeleton active />}
            <Drawer title="Student qo'shish" open={drawer} onClose={closeDrawer}>
                <Form onFinish={handleCreateStudent} layout='vertical' form={form}>
                    <Form.Item name="firstName" label="Ism" rules={[{ required: true, message: "Ism kiriting" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Familya" rules={[{ required: true, message: "Familya kiriting" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="E-mail" rules={[{ required: true, message: "Email kiriting" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Parol" rules={[{ required: true, message: "Parol kiriting" }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button loading={loading} disabled={loading} htmlType='submit' style={{ marginTop: "30px" }} icon={<PlusOutlined />} type='primary'>Yaratish</Button>
                </Form>
            </Drawer>
        </div>
    )
}

export default Student