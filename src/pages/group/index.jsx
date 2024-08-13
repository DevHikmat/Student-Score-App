import React, { useEffect, useState } from 'react'
import { GroupService } from "../../services/group-service"
import ContentHeader from '../../UI/content-header/content-header';
import { Button, Drawer, Form, Input, message, Modal, Popconfirm, Select, Skeleton, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { openNotification } from '../../utils/Messenger';
import { GroupActions } from "../../store/group-slice";
import moment from 'moment';
const { Column } = Table;

const Group = () => {
    const teacherList = useSelector(state => state.user.teacherList);
    const { loading, groupList } = useSelector(state => state.group);
    const [drawer, setDrawer] = useState(false);
    const [modal, setModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const openModal = (group) => {
        setModal(true);
        setEditingGroup(group);
        const teacher = teacherList.find(item => item._id === group.teacherId);
        const teacherId = teacher ? teacher.firstName + " " + teacher.lastName : "";
        editForm.setFieldsValue({
            name: group.name,
            teacherId
        })
    }
    const closeModal = () => {
        setModal(false);
    }

    const openDrawer = () => {
        setDrawer(true);
    }
    const closeDrawer = () => {
        setDrawer(false)
        form.resetFields();
    }

    const fetchGroupHandler = async () => {
        try {
            const data = await GroupService.getAll();
            dispatch(GroupActions.reqGroupSuccess(data.gropus.map((item, index) => ({ ...item, key: ++index }))));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchGroupHandler();
    }, [])

    const handleSubmitGroup = async () => {
        const { name, teacherId } = form.getFieldsValue();
        if (!name || !teacherId) return openNotification("warning", "Maydon bo'sh", "Iltimos barcha maydonni to'ldiring.")
        dispatch(GroupActions.reqGroupStart())
        try {
            const data = await GroupService.addGroup({ name, teacherId });
            dispatch(GroupActions.addNewGroup(data.newGroup));
            message.success(data.message);
            closeDrawer();
        } catch (error) {
            dispatch(GroupActions.reqGroupFailure())
        }
    }
    const existingTeacherInfo = (teacherId) => {
        let result = 'mavjud emas';
        const existingTeacher = teacherList.find(teacher => teacher._id === teacherId);
        if (existingTeacher) result = `${existingTeacher.firstName} ${existingTeacher.lastName}`;
        return result;
    }
    const handleDeleteGroup = async (_id) => {
        try {
            const data = await GroupService.delGroup(_id);
            message.success(data.message);
            dispatch(GroupActions.delGroupById({ _id }));
        } catch (error) {
            console.log(error)
        }
    }
    const handleUpdateGroup = async () => {
        const { name, teacherId } = editForm.getFieldsValue();
        if (!name || !teacherId) { return openNotification("warning", "Iltimos, barcha maydonni to'ldiring."); }
        dispatch(GroupActions.reqGroupStart());
        try {
            let newGroup = { teacherId };
            if (editingGroup.name !== name) newGroup.name = name;
            const data = await GroupService.updGroup(editingGroup._id, newGroup);
            dispatch(GroupActions.updGroupById({ _id: editingGroup._id, newGroup }));
            message.success(data.message);
            closeModal();
        } catch (error) {
            dispatch(GroupActions.reqGroupFailure());
        }
    }

    return (
        <div className='group'>
            <ContentHeader section="guruh" openDrawer={openDrawer} />
            <Drawer onClose={closeDrawer} open={drawer} title="Yangi gruh qo'shish">
                <Form form={form} layout='vertical'>
                    <Form.Item name="name" label="Guruh nomi">
                        <Input />
                    </Form.Item>
                    <Form.Item name="teacherId" label="Qaysi ustozga">
                        <Select>
                            {teacherList.map(item => {
                                return <Select.Option key={item._id} value={item._id}>{item.firstName} {item.lastName}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Button loading={loading} disabled={loading} onClick={handleSubmitGroup} icon={<PlusOutlined />}>Guruhni yaratish</Button>
                </Form>
            </Drawer>

            {
                groupList?.length > 0 ? <Table dataSource={groupList}>
                    <Column title="#" dataIndex="key"></Column>
                    <Column title="Ustoz" render={(group) => existingTeacherInfo(group.teacherId)}></Column>
                    <Column title="Guruh nomi" dataIndex="name"></Column>
                    <Column title="Ochilgan sana" render={(group) => moment(group.createdAt).format('lll')}></Column>
                    <Column title="O'zgartirildi" render={(group) => moment(group.updatedAt).format('lll')}></Column>
                    <Column title="Amaliyotlar" render={(group) => {
                        return <div style={{ display: "flex", gap: "15px" }}>
                            <Button onClick={() => openModal(group)} size='small' icon={<EditOutlined />}></Button>
                            <Popconfirm onConfirm={() => handleDeleteGroup(group._id)} title="Rostdanham o'chirmoqchimisiz?" okText="ha" cancelText="yo'q" okType='danger'>
                                <Button size='small' icon={<DeleteOutlined />}></Button>
                            </Popconfirm>
                        </div>
                    }}></Column>
                </Table> : <Skeleton active />
            }

            <Modal footer={false} title="Guruh ma'lumotlarini o'zgartrish" open={modal} onCancel={closeModal}>
                <Form form={editForm} layout='vertical'>
                    <Form.Item name="name" label="Guruh nomi">
                        <Input />
                    </Form.Item>
                    <Form.Item name="teacherId" label="Guruh bog'langan ustoz">
                        <Select>
                            {teacherList.map(item => {
                                return <Select.Option key={item._id} value={item._id}>{item.firstName} {item.lastName}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Button loading={loading} disabled={loading} onClick={handleUpdateGroup} type='primary'>Saqlash</Button>
                </Form>
            </Modal>
        </div>
    )
}

export default Group