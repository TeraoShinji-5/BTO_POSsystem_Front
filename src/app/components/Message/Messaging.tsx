'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image'; 

interface Deal_Details {
    product_name: string;
    quantity: number;
    price: number;
    peer: number;
    tax_percent: number;
    user_name: string;
    // 他のプロパティがあればここに追加
}

interface Messaging {
    buyer_name: string;
    range_name: string;
    seller_name: string;
    message: string;
    // 他のプロパティがあればここに追加
}


export default function GenerateReceipt() {
    const [messaging, setMessaging] = useState<Messaging[]>([]);
    const [buyer_names, setBuyerNames] = useState([]);
    const [range_names, setRangeNames] = useState([]);
    const [seller_names, setSellerNames] = useState([]);
    const [messages, setMessages] = useState([]);
    const [store_id, setStoreId] = useState<number>(0);
    const [staff_id, setStaffId] = useState<number>(0);
    const [machine_id, setMachineId] = useState<number>(0);
    const [total_charge, setTotalCharge] = useState<number>(0);
    const [total_charge_wo_tax, setTotalChargeWithoutTax] = useState<number>(0);
    const [total_peer, setTotalPeer] = useState<number>(0);
    const [deal_details, setDealDetails] = useState<Deal_Details[]>([]);
    const [product_names, setProductNames] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [prices, setPrices] = useState([]);
    const [peers, setPeers] = useState([]);
    const [tax_percents, setTaxPercents] = useState([]);
    const [user_names, setUserNames] = useState([]);
    const buy_time: string | null = useSearchParams().get("buy_time");
    console.log(buy_time);
    const jstDate = convertUTCtoJST(buy_time);

    function convertUTCtoJST(utcDateString: string): string {
        // UTC日時をDateオブジェクトとしてパース
        const date = new Date(utcDateString);

        // 日本時間に変換（UTC + 9時間）
        date.setHours(date.getHours() + 9);

        // 日時をYYYY-MM-DD HH:MM:SS形式にフォーマット
        const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);

        return formattedDate;
    };




    async function fetchTrade() {
        const res = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/trade?buy_time=${buy_time}`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error('Failed to fetch trade');
        }
        return res.json();
    }

    useEffect(() => {
        if (buy_time) {
            const fetchAndSetTrade = async () => {
                const tradeData = await fetchTrade();
                setStoreId(tradeData.store_id);
                setStaffId(tradeData.staff_id);
                setMachineId(tradeData.machine_id);
                setTotalCharge(tradeData.total_charge);
                setTotalChargeWithoutTax(tradeData.total_charge_wo_tax);
                setTotalPeer(tradeData.total_peer);
                console.log(tradeData);
            };
        fetchAndSetTrade();
        }
        },[buy_time]);



    async function fetchDealDetail() {
        const res2 = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/deal_detail?buy_time=${buy_time}`, { cache: "no-cache" });
        if (!res2.ok) {
            throw new Error('Failed to fetch deal_detail');
        }
        return res2.json();
    }

    useEffect(() => {
        if (buy_time) {
            const fetchAndSetDealDetail = async () => {
                const dealDetailData = await fetchDealDetail();
                console.log(dealDetailData);
                setDealDetails(dealDetailData.deal_details);
                // setProductNames(dealDetailData.product_name);
                // setQuantities(dealDetailData.quantity);
                // setPrices(dealDetailData.price);
                // setPeers(dealDetailData.peer);
                // setTaxPercents(dealDetailData.tax_percent);
                // setUserNames(dealDetailData.user_name);
                // console.log(dealDetailData);
        };
        fetchAndSetDealDetail();
        }
        },[buy_time]);



    async function fetchMessage() {
        const res3 = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/message?buy_time=${buy_time}`, { cache: "no-cache" });
        if (!res3.ok) {
            throw new Error('Failed to fetch message');
        }
        return res3.json();
    }

    useEffect(() => {
        if (buy_time) {
            const fetchAndSetMessage = async () => {
                const messageData = await fetchMessage();
                setMessaging(messageData.message_info);
                // setBuyerNames(messageData.buyer_name);
                // setRangeNames(messageData.range_name);
                // setSellerNames(messageData.seller_name);
                // setMessages(messageData.message);
                console.log(messageData);
            };
        fetchAndSetMessage();
        }
        },[buy_time]);



    return (
        <>
        <div className="image-container">
                <Image src="/danchipeer.png" alt="Welcome Image" width={300} height={400} />
            </div>
        <div className="container">
            <div className='font-bold mb-4'>お買い上げありがとうございました！
            </div>
        <div className="text-container">
            <div className='mb-1'>日時：{jstDate}</div>
            <div className='mb-1'>店舗： {store_id}</div>
            <div className='mb-1'>レジ担当者： {staff_id}</div>
            <div className='mb-1'>POSNo.： {machine_id}</div>
            <div className='mb-1 subtotal-line'></div>   
            <div className='font-bold'>購入品目</div>
            {/* 購入品目のリスト表示 */}
            {deal_details.map((deal_detail, index) => (
                <div key={index} className={`pt-4 ${index > 0 ? 'border-t' : ''}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p>{deal_detail.product_name}</p>
                            {deal_detail.price > 0 && (
                                <h3 className="mb-2">{deal_detail.price}円 x {deal_detail.quantity}個 = {deal_detail.price * deal_detail.quantity}円 
                                作った人：{deal_detail.user_name} さん</h3>
                            )}
                            {deal_detail.peer > 0 && (
                                <h3 className="mb-2">{deal_detail.peer}peer x {deal_detail.quantity}個 = {deal_detail.peer * deal_detail.quantity}peer 
                                作った人：{deal_detail.user_name} さん</h3>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <div className='mb-2'>小計： {total_charge_wo_tax} 円（税抜）</div>
            <div className='mb-2 subtotal-line'></div>
            <div className='font-bold mb-2'>合計金額： {total_charge} 円（税込）</div>
            <div className='font-bold mb-2'>合計ぴあ： {total_peer}ぴあ</div>
        </div>

        <div className="print-image-container"> 
            <img src="/footer.png" alt="danchipeer" width={350} height={100}/>
        </div>

        <div className="container">
            <div className='font-bold'>あなたへのメッセージ
            </div>
            
        <div className="container">
        {messaging.map((message_info, index) => (
            <div key={index} className={`pt-4 ${index > 0 ? 'border-t' : ''}`}>
                <div>
                    <div>
                    <div className='mb-1' >{message_info.message}</div>
                    <div className='mb-4'>{message_info.range_name} に住む {message_info.buyer_name} より</div>
                    </div>
                    <button className="mb-4 ml-4 bg-blue-500 hover:bg-blue-700 text-white text-white text-sm font-bold py-1 px-2 rounded mr-2">
                        メッセージを送る
                    </button>
                </div>

        <div className="print-image-container"> 
            <img src="/footer.png" alt="danchipeer" width={350} height={100}/>
        </div>
        
                </div>
            ))}
        </div>
    </div>
    </div>
    </>
)};