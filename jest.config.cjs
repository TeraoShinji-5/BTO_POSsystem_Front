// jest.config.cjs
const config = {
  // Jestが処理するファイルの拡張子を指定
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // TypeScriptやJSXを正しく理解するためのトランスパイラの設定
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // テスト環境の設定。jsdomはブラウザ環境を模倣するために一般的に使用されます
  testEnvironment: 'jsdom',
  // Reactやその他のライブラリからのインポートを扱うためのモジュール名マッピング
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // その他の静的ファイルのマッピングが必要な場合はここに追加
  },
  // テストカバレッジを収集するファイルのパターンを指定
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  // テストを実行するディレクトリまたはファイルのパターンを指定（必要に応じて）
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  // テスト中に参照するリソースのルートディレクトリを指定
  roots: ['<rootDir>/src'],
};

module.exports = config;
