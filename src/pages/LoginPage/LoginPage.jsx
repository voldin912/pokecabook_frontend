import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./bootstrap.min.css";
import "./LoginPage.scss";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';


const PokemonAuth = () => {
    const initialData = {
        email: '',
        password: ''
    }
    const [isLogin, setIsLogin] = useState(true);
    const [input, setInput] = useState(initialData);
    const Navigate = useNavigate();

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setInput({ ...input, [name]: value });
    }

    const handleSubmit = async () => {
        // Correct the condition for email and password comparison
        if(!input.name, !input.email, !input.password){
            toast.error('データを正確に入力してください');
        }
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, input) // Replace with your API endpoint
            .then(response => {
                toast.success(response.data.msg);
                localStorage.setItem("token", response.data.token);
                Navigate('/')
            })
            .catch(error => {
                console.log(error, "error");
                
                toast.error(error.response.data.message);
            });
        // if (input.email === "admin" && input.password === "123") {
        //     Navigate('/');
        //     alert("Welcome, you are admin");
        //     localStorage.setItem("role", "admin");
        // } else {
        //     alert("Sorry,you are not admin");
        // }
    }
    const handleBack = () => {
        Navigate('/')
    }

    console.log(input, "input");

    return (
        <>
            <div className="pokemonAuth flex justify-center items-center bg-gradient-to-b from-yellow-400 to-red-400">
                <div className="authPart bg-white p-6 rounded-lg shadow-lg text-center w-80">
                    <h2 className="text-red-600 text-2xl mb-4">
                        {isLogin ? 'ログイン' : 'Signup'}
                    </h2>
                    {isLogin && (
                        <>
                            <input
                                type="email"
                                name='email'
                                placeholder="メール"
                                className="w-full p-2 mb-3 border-2 border-yellow-400 rounded-md form-control"
                                value={input.email} // Corrected value to input.email
                                onChange={(e) => handleChange(e)}
                            />
                            <input
                                type="password"
                                placeholder="アクション"
                                className="w-full p-2 mb-3 border-2 border-yellow-400 rounded-md form-control"
                                name='password'
                                value={input.password} // Corrected value to input.password
                                onChange={(e) => handleChange(e)}
                            />
                        </>
                    )}
                    <div className="btnG" style={{display:"flex", justifyContent:"space-between" }}>
                        <button
                            className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 w-full"
                            style={{ border: "none", borderRadius: "5px" }}
                            onClick={handleBack}
                        >
                            戻る
                        </button>
                        <button
                            className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 w-full"
                            style={{ border: "none", borderRadius: "5px" }}
                            onClick={handleSubmit}
                        >
                            {isLogin ? 'ログイン' : 'Sign Up'}
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
};

export default PokemonAuth;