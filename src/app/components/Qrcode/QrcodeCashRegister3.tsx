'use client';
import { useEffect, useState } from 'react';
import QrcodeReader from './QrcodeReader';
import { useSearchParams } from 'next/navigation';

interface Product {
    product_id: number;
    product_qrcode: number;
    product_name: string;
    price: number;
    quantity: number;
    tax: number;
    // 他のプロパティがあればここに追加
}

export default function QrcodeReaderComponent() {
    const [scannedTime, setScannedTime] = useState(new Date());
    const [scannedResult, setScannedResult] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(0); // 数量を数値で管理
    const [productTax, setProductTax] = useState<number>(0.1);
    const [total, setTotal] = useState<number>(0);
    const [totalWithTax, setTotalWithTax] = useState<number>(0);
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState('');
    const user_token: string | null = useSearchParams().get("token");


    async function fetchUser(token: string) {
        const res = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/shopping?token=${user_token}`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error('Failed to fetch user');
        }
        return res.json();
    }

    useEffect(() => {
        const fetchAndSetUser = async () => {
        const userData = await fetchUser(token);
        setUserName(userData.user_name);
        // user_tokenがnullでないことを確認し、nullであれば空文字列""を使用
        setToken(user_token !== null ? user_token : "");
        console.log(userData);
        };
        fetchAndSetUser();
    }, []);


    // QRコードを読み取った時の関数
    const onNewScanResult = (result: any) => {
        console.log('QRコードスキャン結果');
        console.log(result);
        setScannedTime(new Date());
        setScannedResult(result);
    };

    // QRコードから商品情報を渡す関数
    async function fetchProduct(scannedResult: any) {
        const encodedQrcode = encodeURIComponent(scannedResult);
        const res = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/qrcode?qrcode=${encodedQrcode}`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error('Failed to fetch product');
        }
        return res.json();
    }

    // 商品情報を購入リストに入れる関数
    useEffect(() => {
        const fetchAndSetProduct = async () => {
            try {
                const newProduct = await fetchProduct(scannedResult);
                setNewProduct(newProduct);
                console.log(newProduct);
                setProducts(prevProducts => {
                    // 既存のproducts配列でproduct_idが一致する商品を探す
                    const existingProductIndex = prevProducts.findIndex(p => p.product_id === newProduct.product_id);
                    if (existingProductIndex !== -1) {
                        // 一致する商品があれば、quantityを更新する
                        const updatedProducts = [...prevProducts];
                        updatedProducts[existingProductIndex] = {
                            ...updatedProducts[existingProductIndex],
                            quantity: updatedProducts[existingProductIndex].quantity + 1,
                        };
                        return updatedProducts;
                    } else {
                        // 新しい商品を追加する（初期個数を設定）
                        return [{ ...newProduct, quantity: 1 }, ...prevProducts];
                    }
                });
                setScannedResult('');
            } catch (error) {
                console.error("Failed to fetch and set product:", error);
            }
        };

        if(scannedResult) {
            fetchAndSetProduct();
        }
    }, [scannedTime, scannedResult]);

    // 合計金額の表示
    useEffect(() => {
        // 税抜き合計金額を計算
        const newTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

        // 税込み合計金額を計算（すべての商品に税率を適用）
        const newTotalWithTax = products.reduce((sum, product) =>
            sum + Math.round((product.price * product.quantity * (1 + productTax)) * 10) / 10, 0);
            console.log(productTax);

        setTotal(Math.round(newTotal)); // 税抜き合計金額をステートにセット
        setTotalWithTax(Math.round(newTotalWithTax)); // 税込み合計金額をステートにセット
        console.log('New Total:', newTotal);
        console.log('New Total With Tax:', newTotalWithTax);
    }, [products, productTax]); // products配列かproductTaxが変わるたびに再計算




    // 商品情報をnewProductにセットする関数
    const handleSetNewProduct = (product: any) => {
        console.log("Received product:", product);
        setProductTax(product.tax_percent);
        console.log(product.tax);
        console.log(productTax);
        setNewProduct(product);
        console.log(product)
        // quantityを整数として更新
        const quantityInt = parseInt(product.quantity, 10);
        setQuantity(quantityInt);
    };

    useEffect(() => {
        console.log("Updated productTax:", productTax);
    }, [productTax]);


    // 選択されている商品を削除する関数
    const handleRemoveProduct = () => {
        if (!newProduct) {
            console.error("No product selected");
            return;
        }
        setProducts(prevProducts => prevProducts.filter(product => product.product_id !== newProduct?.product_id));
        setNewProduct(null); // newProductをnullにリセット
    };

    // 選択されている商品の数量を更新する関数
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuantity = parseInt(event.target.value, 10);
        if (!isNaN(updatedQuantity) && updatedQuantity >= 0) {
            setQuantity(updatedQuantity);
        }
    };

    // 数量の入力が完了したときに呼ばれる関数
    const handleQuantityBlur = () => {
        if (!newProduct) {
            console.error("No product selected");
            return; // newProduct が null の場合はここで処理を終了
        }

        // parseIntを使用せずにquantityを直接参照
        const updatedQuantity = quantity;

        // quantityが負の値でないことを確認
        if (updatedQuantity < 0) {
            console.error("Invalid quantity input");
            return;
        }

        setProducts(prevProducts => {
            // 更新された商品を見つけて一時的に保持する
            const existingProduct = prevProducts.find(product => product.product_id === newProduct.product_id);
            if (!existingProduct) {
            // ここでエラーハンドリングをするか、新しい商品を追加する処理を実装する
            // 例: return prevProducts; // 単純に何も変更せずに戻る
            throw new Error('Product not found'); // またはエラーを投げる
        }
            // 更新された商品を一時的に保持する。ここで`existingProduct`はundefinedではないことが保証されている。
            const updatedProduct = { ...existingProduct, quantity: updatedQuantity };
            
            // 更新された商品を除外した新しい商品リストを作成する
            const filteredProducts = prevProducts.filter(product => product.product_id !== newProduct.product_id);
            
            // 更新された商品をリストの最初に追加する
            return [updatedProduct, ...filteredProducts];
        });

        setNewProduct(prevNewProduct => prevNewProduct ? { ...prevNewProduct, quantity: updatedQuantity } : null);
    };


    // newProduct.quantityをquantityステートにセットする関数
    const handleEditQuantity = () => {
        if (newProduct !== null) {
            setQuantity(newProduct.quantity);
        } else {
            console.error("No product selected or newProduct is null");
            // newProductがnullである場合の処理をここに追加することもできます
            // 例えば、quantityを0にリセットするなど
            // setQuantity(0);
        }
    };

    // newProductが更新されたときにquantityステートも更新する
    useEffect(() => {
        if (newProduct && newProduct.quantity !== undefined) {
            setQuantity(newProduct.quantity);
        }
    }, [newProduct]);

    // 日本時間に変換するための関数
    function getJSTDate() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const jstOffset = 9
         * 60 * 60000; // JSTはUTC+9時間
        return new Date(utc + jstOffset);
    }

    const handlePurchase = async () => {
        // 日本時間の現在時刻を取得
        const currentTime = getJSTDate();

        // ポップアップで合計金額を表示
        window.alert(`合計(税込): ${totalWithTax}円 (税抜: ${total}円)`);

        // TradeDBにデータを保存する
        try {
            // トレード情報を保存
            await fetchAndSetTrade(currentTime);

            // ディール詳細を保存
            await fetchAndDealDetail(currentTime);
        } catch (error) {
            console.error("An error occurred during the purchase process:", error);
        }

        // すべての状態をクリア
        setProducts([]);
        setNewProduct(null);
        setQuantity(0);
        setProductTax(0.1);
        setTotal(0);
        setTotalWithTax(0);
        setUserName('ゲスト');
        setToken('');
    };

    // トレード情報を保存する関数
    const fetchAndSetTrade = async (buyTime: Date) => {
        // buyTimeをISO文字列に変換
        const buyTimeString = buyTime.toISOString();

        const response = await fetch('https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                store_id: 1,
                staff_id: 1,
                machine_id: 1,
                total_charge: totalWithTax,
                total_charge_wo_tax: total,
                buy_time: buyTimeString,
            }),
        });
        if (!response.ok) {
            throw new Error('Trade could not be added');
        }
        const data = await response.json();
        console.log(data);
    };

    // ディール詳細を保存する関数
    const fetchAndDealDetail = async (buyTime: Date) => {
        if (products.length === 0) {
            console.error("商品リストが空です。");
            return;
        }
        // buyTimeをISO文字列に変換
        const buyTimeString = buyTime.toISOString();
        console.log(products);

        const response = await fetch('https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/deal_detail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                products: products.map(product => ({
                    product_qrcode: product.product_qrcode,
                    product_name: product.product_name,
                    price: product.price,
                    quantity: product.quantity,
                    tax_percent: productTax,
                    buy_time: buyTimeString,
                }))
            }),
        });
        if (!response.ok) {
            throw new Error('Deal Detail could not be added');
        }
        const data = await response.json();
        console.log(data);
    };

    return (
        <div className="container"> 
            <div className='font-bold mb-4'>ようこそ {userName}さん！</div>

            {/* バーコードスキャンセクション */}
            <div className="mb-8 border p-4 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-4">バーコードスキャン</h2>
                <QrcodeReader
                onScanSuccess={onNewScanResult}
                onScanFailure={(error: any) => {
                    // console.log('Qr scan error');
                }}
                />
            </div>
                
            {/* スキャン情報表示セクション */}
            <div className="mb-8 border p-4 rounded-lg shadow">
                <div className="1em">
                    <h2 className="text-lg font-bold mb-4">スキャン情報</h2>
                        <div className='mb-1'>スキャン結果：{newProduct?.product_id ?? '未スキャン'}</div>
                        <div className='mb-1'>商品名：{newProduct?.product_name ?? '商品名未定'}</div>
                        <div className='mb-1'>値段：{newProduct?.price ?? 0}円</div>
                        <div className='mb-4'>
                            個数：
                            {newProduct?.quantity !== undefined ? (
                                <div className="inline-flex items-center">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        onBlur={handleQuantityBlur}
                                        min="1"
                                        max="99"
                                        style={{ width: '3em' }}
                                    />
                                    <button onClick={handleEditQuantity}
                                    className="ml-4 bg-blue-500 hover:bg-blue-700 text-white text-white text-sm font-bold py-1 px-2 rounded mr-2">
                                        数量変更
                                    </button>
                                </div>
                            ) : (
                                '商品を選択してください。'
                            )}
                        </div>
                            <button onClick={handleRemoveProduct}
                            className="bg-gray-500 hover:bg-gray-700 text-white text-white text-sm font-bold py-1 px-2 rounded mr-2">
                                リストから削除</button> {/* 削除ボタン */}
                    </div>
                </div>

            {/* カート表示セクション */}
            <div className="mb-8 p-4 border rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">カート</h2>
            {products.map((product, index) => (
                // 商品ごとに上線を引き、最初の商品以外は上線をなくす
                <div key={index}className={`pt-4 ${index > 0 ? 'border-t' : ''}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{product.product_name} </h3>
                            <p>{product.price}円    x{product.quantity}個    {product.price * product.quantity}円</p>
                        </div>
                        <button onClick={() => handleSetNewProduct(product)}className="ml-4 bg-gray-500 hover:bg-gray-700 text-white text-white text-sm font-bold py-1 px-2 rounded mr-2">
                            選択
                        </button>
                    </div>
                </div>
            ))}
            </div>

            {/* 合計金額を表示 */}
                <div className="text-center">
                    <h2 className="font-bold">合計: {totalWithTax} 円 （税抜: {total} 円）</h2>
                    <button onClick={handlePurchase} 
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                        購入</button>
                </div>
    </div>
    );
}








