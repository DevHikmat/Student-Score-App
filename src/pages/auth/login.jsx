import { useNavigate } from "react-router-dom";
import "./auth.scss";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { openNotification } from "../../utils/Messenger";
import { AuthActions } from "../../store/auth-slice";
import { AuthService } from "../../services/auth-service";

const Login = () => {
    const loading = useSelector(state => state.auth.loading);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        if (!email.trim() || !password.trim())
            return openNotification("warning", "Maydon bo'sh", "Iltimos barcha maydonni to'ldiring!");
        dispatch(AuthActions.authStart());
        try {
            const data = await AuthService.login(formData);
            console.log(data);
            dispatch(AuthActions.authSuccess(data.user));
            localStorage.setItem('token', data.token);
            localStorage.setItem('myId', data.user._id);
            openNotification('success', "Kirish", "Shaxs ma'lumotlari tasdiqlandi");
            navigate(`/${data.user.role}`);
        } catch (error) {
            dispatch(AuthActions.authFailure());
        }
    };
    return <div className="auth">
        <div className="auth-container">
            <form name="form1" className="box" onSubmit={handleSubmit}>
                <h4>Profilga <span>KIRISH</span></h4>
                <input value={formData.email} onChange={handleChange} type="text" name="email" placeholder="Elektron manzil" autoComplete="off" />
                <input value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Parol" id="pwd" autoComplete="off" />
                <button disabled={loading} type="submit" className="btn1">
                    {loading ? "Loading..." : "Kirish"}
                </button>
            </form>
        </div>
    </div>
}

export default Login