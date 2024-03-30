import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/app/components/Token/Login';

// モック用に追記
jest.mock('next/navigation', () => ({
    useRouter() {
    return {
        route: '/',
        pathname: '/',
        query: {},
        asPath: '/',
        basePath: '/',
        isLocaleDomain: true,
        isReady: true,
        push: jest.fn(),
        prefetch: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        beforePopState: jest.fn(),
        events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
        },
        isFallback: false,
        isPreview: false,
    };
    },
}));

// fetch のモックを作成
global.fetch = jest.fn(() =>
Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ access_token: 'test-token', user_name: '寺尾 真二' }),
})
) as jest.Mock;

describe('Login Component', () => {
it('handles form submit correctly', async () => {
    const { getByLabelText, getByText } = render(<Login />);

    // フォームフィールドに値を入力
    fireEvent.change(getByLabelText('ユーザー名:'), { target: { value: '寺尾 真二' } });
    fireEvent.change(getByLabelText('パスワード：'), { target: { value: '2' } });

    // 送信ボタンをクリック
    fireEvent.click(getByText('SIGN IN'));

    // 正しい body で fetch が呼ばれることを確認
    await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith(
        'https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/login',
        {
        method: 'POST',
        body: JSON.stringify({
            user_name: '寺尾 真二',
            password: '2',
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        }
    )
    );

    // 期待される副作用（例: ユーザー名の設定）を確認
    // この部分は、具体的な実装やテストの目的に応じて調整してください。
});
});