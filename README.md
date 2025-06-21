# 🤠 AWS Gunslinger Quiz - 西部劇風サービス名クイズ

西部の荒野で繰り広げられるAWSサービス名の決闘！正しいサービス名を撃ち抜け、ガンスリンガー！

「Amazon」か「AWS」の接頭語、スペースの位置、大文字小文字の組み合わせなど、微妙な違いを含む4つの選択肢から正しいサービス名を射撃で選択する西部劇風ブラウザゲームです。

## 🎮 Amazon Q CLI で作成

このゲームは、[Amazon Q CLI を使ったゲーム開発企画](https://aws.amazon.com/jp/blogs/news/build-games-with-amazon-q-cli-and-score-a-t-shirt/)の一環として、Amazon Q Developer の支援を受けて開発されました。AIアシスタントとの対話を通じて、コードの生成、デバッグ、機能追加を効率的に行い、短時間で本格的なブラウザゲームを完成させることができました。

### Amazon Q Developer の活用例
- **ゲーム設計**: 西部劇テーマのコンセプト設計とUI/UX提案
- **コード生成**: HTML、CSS、JavaScriptの自動生成
- **バグ修正**: 選択肢重複問題やレイアウト調整の解決
- **機能追加**: 射撃エフェクト、弾痕表示、ひび割れアニメーションの実装
- **最適化**: レスポンシブデザインとパフォーマンス改善

## 🎯 特徴

### ゲーム体験
- **西部劇テーマ**: 砂漠の背景、カウボーイフォント、保安官バッジ
- **射撃システム**: クリックした座標に弾痕とひび割れエフェクト
- **クロスヘア**: マウスカーソルが照準器に変化
- **マズルフラッシュ**: クリック時の発砲エフェクト
- **効果音**: Web Audio APIによる銃声エフェクト

### 多言語対応
- **4言語サポート**: 日本語、英語、中国語、韓国語
- **リアルタイム切り替え**: タイトル画面で言語選択、即座に全UI更新
- **完全翻訳**: 問題文、UI、フィードバック、称号まで全て翻訳
- **国旗付きセレクター**: 視覚的に分かりやすい言語選択

### ゲーム内容
- **30以上のAWSサービス**: 実際のサービス名を収録
- **1ゲーム10問**: 集中して楽しめる問題数
- **カテゴリ別出題**: AI/ML、Compute、Storage、Database等
- **間違いやすいパターン**: 実際に間違えやすい選択肢を生成
- **称号システム**: 的中率に応じた西部劇風の称号

### 結果・復習機能
- **かっこいいスコア表示**: 大きな数字とアニメーション
- **間違いレビュー**: 撃ち損じた問題の詳細確認
- **正解と間違いの比較**: 色分けされた見やすい表示

## 📁 ファイル構成

```
q_game/
├── index.html              # メインHTMLファイル
├── style.css              # スタイルシート（西部劇風デザイン）
├── game.js                # ゲームロジック（JavaScript）
├── services_data.json     # サービスデータファイル
├── aws_service_quiz.py    # コマンドライン版（基本）
├── aws_quiz_advanced.py   # コマンドライン版（改良）
└── README.md             # このファイル
```

## 🚀 実行方法

### ブラウザ版（推奨）
```bash
# ローカルサーバーを起動
python3 -m http.server 8000

# ブラウザで以下にアクセス
http://localhost:8000
```

### GitHub Pages の公開環境でも遊べます
https://misakiotb.github.io/q_game_AWS_GUNSLINGER/

### GitHub Pages の公開環境でも遊べます
https://misakiotb.github.io/q_game_AWS_GUNSLINGER/

### コマンドライン版
```bash
# 基本版
python3 aws_service_quiz.py

# 改良版
python3 aws_quiz_advanced.py
```

### GitHub Pages の公開環境でも遊べます
https://misakiotb.github.io/q_game_AWS_GUNSLINGER/

## 🎮 ゲームの流れ

1. **スタート画面**: 
   - 言語選択（🇯🇵日本語、🇺🇸English、🇨🇳中文、🇰🇷한국어）
   - 「決闘開始！」ボタンでゲーム開始
2. **問題画面**: 
   - 4つの横長パネルから正しいサービス名を選択
   - クロスヘア（照準器）でターゲットを狙撃
   - クリックした座標に弾痕とひび割れが表示
3. **結果表示**: 10問終了後、スコアと称号を表示
4. **復習機能**: 間違えた問題の詳細確認が可能
5. **タイトルに戻る**: 言語変更や再プレイが可能

## 🎯 ゲームの特徴

### 視覚的な工夫
- **読みやすいデザイン**: 横長パネルで1行表示、半角スペースが明確に見える
- **リアルな射撃感**: クリック座標に弾痕、周辺にひび割れエフェクト
- **西部劇の雰囲気**: 砂漠の背景、カウボーイフォント、保安官バッジ

### 学習効果
- **微妙な違いを学習**: 「Amazon EC2」と「AWS EC2」の違いなど
- **実践的な知識**: 実際のAWSサービス名を正確に覚えられる
- **復習システム**: 間違えた問題を後で確認可能

## 🏆 称号システム

的中率に応じて西部劇風の称号が付与されます（各言語対応）：

### 日本語
- **90%以上**: 🤠 伝説のガンスリンガー
- **80%以上**: 🎯 熟練ガンスリンガー  
- **70%以上**: 🔫 駆け出しガンマン
- **50%以上**: 🤔 見習いカウボーイ
- **50%未満**: 🐎 馬の世話係

### English
- **90%以上**: 🤠 Legendary Gunslinger
- **80%以上**: 🎯 Expert Gunslinger
- **70%以上**: 🔫 Rookie Gunman
- **50%以上**: 🤔 Apprentice Cowboy
- **50%未満**: 🐎 Stable Hand

### 中文
- **90%以上**: 🤠 传奇枪手
- **80%以上**: 🎯 专家枪手
- **70%以上**: 🔫 新手枪手
- **50%以上**: 🤔 学徒牛仔
- **50%未満**: 🐎 马夫

### 한국어
- **90%以上**: 🤠 전설의 건슬링거
- **80%以上**: 🎯 숙련된 건슬링거
- **70%以上**: 🔫 초보 건맨
- **50%以上**: 🤔 견습 카우보이
- **50%未満**: 🐎 마구간지기

## 📚 収録サービス例

### AI/ML
- Amazon Q Developer, Amazon Q Business

### Compute  
- Amazon EC2, AWS Lambda, AWS Fargate, AWS Elastic Beanstalk

### Storage
- Amazon S3, Amazon EBS

### Database
- Amazon RDS, Amazon DynamoDB, Amazon ElastiCache, Amazon Redshift

### Networking
- Amazon VPC, Amazon CloudFront, Amazon Route 53, Amazon API Gateway

### Security
- AWS IAM, AWS Secrets Manager, Amazon Cognito, AWS CloudTrail

### Management
- AWS CloudFormation, Amazon CloudWatch, AWS Systems Manager

### Analytics
- Amazon Redshift, AWS Glue, Amazon Kinesis

### Application Integration
- Amazon SQS, Amazon SNS, AWS Step Functions

### Containers
- Amazon ECS, Amazon EKS

### Developer Tools
- AWS CodeCommit

## カスタマイズ

`services_data.json`ファイルを編集することで、新しいサービスを追加したり、既存のサービス情報を更新できます。

```json
{
  "services": [
    {
      "correct": "正式なサービス名",
      "description": "サービスの説明",
      "category": "カテゴリ名"
    }
  ]
}
```

## 要件

- Python 3.6以上
- 標準ライブラリのみ使用（追加インストール不要）

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
