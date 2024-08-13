import React, { useEffect, useState } from "react";
import Login from "./pages/auth/login";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Admin from "./pages/admin/Admin";
import Student from "./pages/student";
import { AuthService } from "./services/auth-service";
import { openNotification } from "./utils/Messenger";
import { ROLES } from "./utils/constants";
import { Loader } from "./UI/loader/loader";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "./store/auth-slice";
import { UserService } from "./services/user-service";
import { UserActions } from "./store/user-slice";

const customRouteCreator = (path, element) => {
  return { id: String(Math.random()), path, element };
};

const adminRoutes = [customRouteCreator("/admin/*", <Admin />)];
const studentRoutes = [customRouteCreator("/student/*", <Student />)];
const guestRoutes = [customRouteCreator("/auth", <Login />)];

const App = () => {
  const [existingRoutes, setExistingRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const authCheckHandler = async (myId) => {
    dispatch(AuthActions.authStart());
    try {
      const data = await AuthService.getInfo(myId);
      const role = data.user.role;
      if (role === ROLES.STUDENT) {
        setExistingRoutes(studentRoutes);
        !pathname.includes(ROLES.STUDENT) && navigate("/student");
      } else if (role === ROLES.ADMIN) {
        setExistingRoutes(adminRoutes);
        !pathname.includes(ROLES.ADMIN) && navigate("/admin");
      }
      dispatch(AuthActions.authSuccess(data.user));
    } catch (error) {
      setExistingRoutes(guestRoutes);
      !pathname.includes("auth") && navigate("/auth");
      dispatch(AuthActions.authFailure());
      openNotification("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const myId = localStorage.getItem("myId");
    if (myId) authCheckHandler(myId);
    else {
      setExistingRoutes(guestRoutes);
      !pathname.includes("auth") && navigate("/auth");
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchAllTeachers = async () => {
    try {
      const data = await UserService.getTeacher();
      dispatch(UserActions.saveTeachers(data.teacher));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllTeachers();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <Routes>
        {existingRoutes.map((item) => (
          <Route key={item.id} path={item.path} element={item.element} />
        ))}
      </Routes>
    </div>
  );
};

export default App;
