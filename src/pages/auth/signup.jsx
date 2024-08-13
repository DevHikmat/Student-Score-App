import { useState } from "react";
import "./auth.scss";
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from "../../services/auth-service";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "../../store/auth-slice";
import { openNotification } from "../../utils/Messenger";

const Signup = () => {
    const loading = useSelector(state => state.auth.loading);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
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
        const { firstName, lastName, email, password } = formData;
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim())
            return openNotification("warning", "Maydon bo'sh", "Iltimos barcha maydonni to'ldiring!");
        dispatch(AuthActions.authStart());
        try {
            const data = await AuthService.signup(formData);
            dispatch(AuthActions.authSuccess(data.user));
            localStorage.setItem('token', data.token);
            localStorage.setItem('myId', data.user._id);
            openNotification('success', "Hisob yaratildi", "Sizga yangi profil ochildi.");
            navigate(`/${data.user.role}`);
        } catch (error) {
            dispatch(AuthActions.authFailure());
        }
    };
    return <div className="auth">
        <div className="auth-container">
            <form name="form1" className="box" onSubmit={handleSubmit}>
                <h4>Profilni <span>Yaratish</span></h4>
                <input value={formData.firstName} onChange={handleChange} type="text" name="firstName" placeholder="Ismingiz" autoComplete="off" />
                <input value={formData.lastName} onChange={handleChange} type="text" name="lastName" placeholder="Familyangiz" autoComplete="off" />
                <input value={formData.email} onChange={handleChange} type="text" name="email" placeholder="Elektron manzil" autoComplete="off" />
                <input value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Parol" id="pwd" autoComplete="off" />
                <button disabled={loading} type="submit" className="btn1">
                    {loading ? "Loading..." : "Yaratish"}
                </button>
            </form>
            <Link to=".." relative="path" className="dnthave">Profil mavjudmi? Kirish</Link>
        </div>
    </div>
}

export default Signup