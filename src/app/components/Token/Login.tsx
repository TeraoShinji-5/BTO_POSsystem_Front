'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
    const formRef = useRef<HTMLFormElement>(null);
    const [userName, setUserName] = useState(''); // ユーザー名の状態を管理
    const [token, setToken] = useState(''); // ユーザー名の状態を管理
    const router = useRouter();

    const handleSend = async (event: any) => {
        event.preventDefault();

        // formRef.currentがnullでないことを確認
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            const body_msg = JSON.stringify({
                user_name: formData.get('user_name'),
                password: formData.get('password'),
            });

            const response = await fetch('https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/login', {
                method: 'POST',
                body: body_msg,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const jsonData = await response.json();
                setToken(jsonData.access_token);
                setUserName(jsonData.user_name);
                console.log(jsonData);
            } else {
                console.error('Login request failed:', response.statusText);
                window.alert(`Login request failed`);
            }
        }
    };

    useEffect(() => {
        console.log(userName);

        // userNameが空でない場合のみ実行
        if (userName) {
            window.alert(`ようこそ ${userName}さん！`);
            router.push(`/mypage?token=${token}`);
        }
    }, [userName, token]); // userNameとtokenが変更されたときにのみ実行

    return (
        <div className='page-container'>
            <div className='login-page'>
                <div className="login-image-column">
                    <Image
                        src="/main.png"
                        alt="Login"
                        width={500} 
                        height={300} 
                        objectFit="contain" 
                    />
                </div>
                <div className="login-form-column">  
                <form ref={formRef} onSubmit={handleSend} className='login-form'>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_name">
                                あなたの名前:
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="user_name" 
                                        name="user_name" 
                                        type="text"
                                        placeholder="姓と名の間に半角スペースを入力" 
                                        required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                パスワード：
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="password" 
                                        name="password" 
                                        type="password" 
                                        placeholder="半角英数字"
                                        required />
                        </div>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                        type="submit">
                            SIGN IN
                        </button>
                    </form>
                </div>

        <div className="footer">
            <Image
                src="/footer.png"
                alt="Footer Image"
                width= {1700} 
                height={300} 
                objectFit="contain" 
            />
        </div>
    </div> 
    </div> 
);
}
