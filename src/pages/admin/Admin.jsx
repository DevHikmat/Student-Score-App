import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import SidebarLink from '../../components/SidebarLink'
import Student from '../user'
import Group from '../group'
import Quiz from '../quiz'
import Profile from '../profile'
import { Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActions } from '../../store/auth-slice'
import Teachers from '../teacher'
import QuizView from '../quiz-view'

const sidebarItems = [
    { to: "/admin", text: "Quizlar", icon: "fa-layer-group" },
    { to: "/admin/groups", text: "guruhlar", icon: "fa-users-rectangle" },
    { to: "/admin/students", text: "o'quvchilar", icon: "fa-users" },
    { to: "/admin/teachers", text: "Ustozlar", icon: "fa-person-chalkboard" },
    { to: "/admin/profile", text: "Sozlamalar", icon: "fa-gear" },
]
let profileUrl = "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";

const Admin = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const [activeIndex, setActiveIndex] = useState(+localStorage.getItem("activeindex"));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.setItem("activeindex", activeIndex);
    }, [activeIndex])

    const handleLogout = () => {
        localStorage.removeItem("activeindex")
        localStorage.removeItem("myId")
        localStorage.removeItem("token")
        navigate("/auth");
        dispatch(AuthActions.logout());
    }

    if (currentUser.profilePicture) profileUrl = currentUser.profilePicture.url;


    return (
        <div className="admin">
            <div className="bg-gray-200">
                <div className="sidebar">
                    <div>
                        <Link to="/admin" className="link brand-logo">Webstar Game</Link>
                        <div className="sidebar-links">
                            {sidebarItems.map((item, index) => (
                                <SidebarLink
                                    icon={item.icon}
                                    key={String(Math.random())}
                                    index={index}
                                    setActiveIndex={setActiveIndex}
                                    to={item.to}
                                    text={item.text}
                                    active={index === activeIndex ? "active" : ""}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="logout">
                        <Button onClick={handleLogout} block danger><i className="fa-solid fa-arrow-left"></i> chiqish</Button>
                    </div>
                </div>
                <div className="main">
                    <div className="top-bar">
                        <div className="page-title">
                            <div className="top-bar-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="icon"
                                >
                                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                                </svg>
                            </div>
                            Dashboard
                        </div>
                        <ul className="menu-items">
                            <li>
                                <a href="#" className="menu-link">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="menu-link">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            d="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z"
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="menu-link">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            d="M4 8a6 6 0 0 1 4.03-5.67 2 2 0 1 1 3.95 0A6 6 0 0 1 16 8v6l3 2v1H1v-1l3-2V8zm8 10a2 2 0 1 1-4 0h4z"
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <Link to="profile" className="action">
                                    <div className="user-info">
                                        <div
                                            className="user-icon"
                                            style={{ background: `url(${profileUrl}) no-repeat center center / cover` }}
                                        ></div>
                                        {currentUser.firstName} {currentUser.lastName}
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="content">
                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-8/12">
                                <div className="p-4">
                                    <div className="flex justify-between mt-2 mb-3">
                                        <div className="text-gray-600 ">Funds overview</div>
                                        <div className="text-gray-900 uppercase text-sm font-bold">
                                            All Reports
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-sm shadow">
                                        <div className="route-wrapper p-4">
                                            <Routes>
                                                <Route path='/' element={<Quiz />} />
                                                <Route path='students' element={<Student />} />
                                                <Route path='groups' element={<Group />} />
                                                <Route path='profile' element={<Profile />} />
                                                <Route path='teachers' element={<Teachers />} />
                                                <Route path='quiz/:id' element={<QuizView />} />
                                            </Routes>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin