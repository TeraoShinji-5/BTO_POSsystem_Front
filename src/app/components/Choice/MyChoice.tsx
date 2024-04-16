'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image'; 

export default function MychoiceComponent() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState('');
    const user_token: string | null = useSearchParams().get("token");

    async function fetchUser(token: string) {
        const res = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/shopping?token=${token}`, { cache: "no-cache" });
        if (!res.ok) {
        throw new Error('Failed to fetch user');
        }
        return res.json();
    }

    useEffect(() => {
        if (user_token) { // user_tokenが存在する場合のみfetchを実行
        const fetchAndSetUser = async () => {
            const userData = await fetchUser(user_token);
            setUserName(userData.user_name);
            setToken(user_token);
            console.log(userData);
        };
        fetchAndSetUser();
        }
    }, [user_token]); // 依存配列にuser_tokenを追加

    // 登録画面に遷移する関数
    const handleSetRegistration = () => {
        console.log('handleSetRegistration is called');
        router.push(`/registration?token=${token}`);
    };

    // 購入画面に遷移する関数
    const handleSetShopping = () => {
        console.log('handleSetShopping is called');
        router.push(`/shopping?token=${token}`);
    };

    return (
        <>
            <div className="image-container">
                <Image src="/danchipeer.png" alt="Welcome Image" width={400} height={400} />
            </div>
            <div className="container">
                <div className='font-bold mb-4'>ようこそ {userName}さん！</div>
                <div className="button-container">
                    <div className="description">商品を登録する場合はこちらのボタンを押してください。</div>
                    <button className="button bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={handleSetRegistration}>
                        商品登録
                    </button>
                </div>
                <div className="button-container">
                    <div className="description">商品を購入する場合はこちらのボタンを押してください。</div>
                    <button className="button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={handleSetShopping}>
                        購入する
                    </button>
                </div>
            </div>
        </>
    );
}