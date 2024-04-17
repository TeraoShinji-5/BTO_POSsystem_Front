'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import JsBarcode from 'jsbarcode';
import Image from 'next/image'; 


export default function BarcodeGeneratorComponent() {
    const [userName, setUserName] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [peer, setPeer] = useState('');
    const registration_id: string | null = useSearchParams().get("registration_id");


    async function fetchRegistration() {
        const res = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/print?registration_id=${registration_id}`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error('Failed to fetch user');
        }
        return res.json();
    }


    useEffect(() => {
        const fetchAndSetRegistration = async () => {
            const registrationData = await fetchRegistration();
            setProductName(registrationData.product_name);
            setPrice(registrationData.price);
            setPeer(registrationData.peer);
            setUserName(registrationData.user_name);
            console.log(registrationData);

            // バーコード生成のための処理をここに追加
            if (registrationData.barcode) {
                JsBarcode("#barcode", registrationData.barcode.toString(), {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 40,
                    displayValue: true,
                });
            }
        };
        fetchAndSetRegistration();
    }, [registration_id]); // registration_idを依存配列に追加して、この値が変わった時にのみ実行されるようにします。

    return (
        <>
        <div className="print-container">
            <div className="barcode-container">
                <canvas id="barcode"></canvas>
            </div>
            <div className="text-container"> 
                <div className='item-name font-bold mb-1'>商品名：{productName}</div>
                <div className='price font-bold mb-1'>値段： {price}円</div>
                <div className='peer font-bold mb-1'>ぴあ： {peer}ぴあ</div>
                <div className='grower font-bold mb-1'>育てた人： {userName}</div>
            </div>
            <div className="print-image-container"> 
            <img src="/receipt.png" alt="danchipeer" width={350} height={100}/>
        </div>
        </div>
        <div className='button-container'>
            <button className="print-button bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    印刷する
            </button>
        </div>
        </>
    );
}