# Twitter Translator Chrome Extension

Twitter APIを使用せずに、ブラウザ上で直接ツイートを翻訳するChrome拡張機能です。

## 特徴

- 🔄 **自動翻訳**: スクロール時に自動的にツイートを翻訳
- 🌐 **ワンクリック切り替え**: 翻訳/オリジナルテキストを簡単に切り替え
- 📝 **直接置換**: 元のツイートを翻訳で直接置き換え（重複表示なし）
- 🎨 **ダークモード対応**: Twitter/Xのテーマに合わせて自動調整
- ⚙️ **カスタマイズ可能**: 翻訳元/先言語を自由に設定
- 🆓 **無料**: Google翻訳の無料APIを使用

## インストール方法

1. このリポジトリをクローンまたはダウンロード
   ```bash
   git clone https://github.com/yusuke-j0728/twitter-translator.git
   ```

2. アイコンファイルを準備
   - `icon16.png` (16x16px)
   - `icon48.png` (48x48px)
   - `icon128.png` (128x128px)
   
   ※ ICON_SETUP.txt を参照してください

3. Chromeで拡張機能をインストール
   - Chrome で `chrome://extensions/` を開く
   - 右上の「デベロッパーモード」を有効化
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - このフォルダを選択

## 使い方

1. Twitter.com または X.com にアクセス
2. ツイートが自動的に翻訳されます
3. 各ツイートの右上にある 🌐 ボタンをクリックして、オリジナル/翻訳を切り替え
4. 拡張機能アイコンをクリックして設定を変更
   - 翻訳の有効/無効（無効にすると既存の翻訳もすべて元に戻ります）
   - 翻訳元言語（デフォルト: 自動検出）
   - 翻訳先言語（デフォルト: 英語）
5. 翻訳先言語と同じ言語のツイートは翻訳されません（例: 翻訳先が英語の場合、英語のツイートはそのまま表示）

## ファイル構成

```
twitter-translator/
├── manifest.json       # Chrome拡張機能の設定ファイル
├── content.js         # ツイート検出と翻訳処理
├── background.js      # バックグラウンド処理
├── popup.html        # 設定画面のHTML
├── popup.js          # 設定画面の処理
├── styles.css        # スタイルシート
├── tests/            # Chrome拡張テスト
│   └── content.test.js
├── ios/              # iOS Safari Web Extension
│   └── TwitterTranslator/
│       ├── TwitterTranslator.xcodeproj/
│       ├── TwitterTranslator/        # iOSアプリ本体
│       │   ├── TwitterTranslatorApp.swift
│       │   ├── ContentView.swift
│       │   └── Info.plist
│       ├── TwitterTranslatorExtension/ # Safari拡張機能
│       │   ├── SafariWebExtensionHandler.swift
│       │   ├── Info.plist
│       │   └── Resources/
│       │       ├── manifest.json
│       │       ├── content.js
│       │       ├── popup.html
│       │       ├── popup.js
│       │       ├── background.js
│       │       └── styles.css
│       └── tests/
│           └── extension.test.js
├── Dockerfile        # Docker環境設定
├── docker-compose.yml # Docker Compose設定
├── README.md         # このファイル
├── USAGE.txt         # 使用方法の詳細
└── ICON_SETUP.txt    # アイコン設定ガイド
```

## 対応言語

- 日本語
- 英語
- 韓国語
- 中国語
- スペイン語
- フランス語
- ドイツ語
- その他（自動検出）

## iOS (Safari Web Extension)

iPhoneのSafariでも同じ翻訳機能が使えます。

### iOS版の特徴
- Chrome版と同じ自動翻訳機能
- モバイル対応（タップしやすいボタンサイズ、ダークモード対応）
- `contextMenus` を除外（iOS Safariでは非対応）
- `browser` / `chrome` API両方に対応

### iOSビルド方法

1. Xcode 15以上がインストールされたMacが必要です
2. プロジェクトを開く:
   ```bash
   open ios/TwitterTranslator/TwitterTranslator.xcodeproj
   ```
3. Bundle Identifierを自分のものに変更
   - `com.example.TwitterTranslator` → 自分のID
   - `com.example.TwitterTranslator.Extension` → 自分のID
4. 実機またはシミュレータでビルド・実行
5. iPhoneで「設定」→「Safari」→「機能拡張」→「Twitter Translator」を有効化
6. twitter.com / x.com へのアクセスを許可

### アイコン画像
`ios/TwitterTranslator/TwitterTranslatorExtension/Resources/images/` に以下を配置:
- `icon-48.png`, `icon-96.png`, `icon-128.png`, `icon-256.png`, `icon-512.png`

## テスト

```bash
# Chrome拡張テスト
npm test

# iOS拡張テスト
node ios/TwitterTranslator/tests/extension.test.js

# Dockerで実行
docker-compose run test
```

## 注意事項

- この拡張機能はGoogle翻訳の無料APIを使用しています
- 大量のツイートを翻訳すると、一時的にレート制限がかかる場合があります
- Twitter/Xの仕様変更により動作しなくなる可能性があります

## ライセンス

MIT License

## 作者

yusuke-j0728

## 貢献

プルリクエストや問題報告は歓迎します。