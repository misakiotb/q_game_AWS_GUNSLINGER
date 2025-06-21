#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AWS サービス名クイズゲーム
AWSサービスの正式名称を当てるクイズゲーム
"""

import random
import json
from typing import List, Dict, Tuple

class AWSServiceQuiz:
    def __init__(self):
        self.services = self.load_services()
        self.score = 0
        self.total_questions = 0
        
    def load_services(self) -> List[Dict]:
        """AWSサービスのデータを読み込み"""
        return [
            {
                "correct": "Amazon Q Developer",
                "description": "AI搭載の開発者向けアシスタント",
                "category": "AI/ML"
            },
            {
                "correct": "Amazon EC2",
                "description": "仮想サーバーサービス",
                "category": "Compute"
            },
            {
                "correct": "Amazon S3",
                "description": "オブジェクトストレージサービス",
                "category": "Storage"
            },
            {
                "correct": "AWS Lambda",
                "description": "サーバーレスコンピューティング",
                "category": "Compute"
            },
            {
                "correct": "Amazon RDS",
                "description": "リレーショナルデータベースサービス",
                "category": "Database"
            },
            {
                "correct": "Amazon CloudFront",
                "description": "コンテンツ配信ネットワーク",
                "category": "Networking"
            },
            {
                "correct": "AWS CloudFormation",
                "description": "インフラストラクチャ as Code",
                "category": "Management"
            },
            {
                "correct": "Amazon VPC",
                "description": "仮想プライベートクラウド",
                "category": "Networking"
            },
            {
                "correct": "Amazon DynamoDB",
                "description": "NoSQLデータベース",
                "category": "Database"
            },
            {
                "correct": "AWS IAM",
                "description": "アイデンティティとアクセス管理",
                "category": "Security"
            },
            {
                "correct": "Amazon SQS",
                "description": "メッセージキューサービス",
                "category": "Application Integration"
            },
            {
                "correct": "Amazon SNS",
                "description": "通知サービス",
                "category": "Application Integration"
            },
            {
                "correct": "AWS CodeCommit",
                "description": "Gitリポジトリサービス",
                "category": "Developer Tools"
            },
            {
                "correct": "Amazon ECS",
                "description": "コンテナオーケストレーション",
                "category": "Containers"
            },
            {
                "correct": "Amazon EKS",
                "description": "Kubernetesサービス",
                "category": "Containers"
            }
        ]
    
    def generate_wrong_options(self, correct_name: str) -> List[str]:
        """正解に似た間違った選択肢を生成"""
        wrong_options = []
        
        # パターン1: Amazon/AWS の接頭語を変更
        if correct_name.startswith("Amazon "):
            wrong_options.append(correct_name.replace("Amazon ", "AWS "))
        elif correct_name.startswith("AWS "):
            wrong_options.append(correct_name.replace("AWS ", "Amazon "))
        
        # パターン2: 大文字小文字を変更
        parts = correct_name.split()
        if len(parts) > 1:
            # 最後の単語の大文字小文字を変更
            last_word = parts[-1]
            if last_word.isupper():
                parts[-1] = last_word.lower()
            elif last_word.islower():
                parts[-1] = last_word.upper()
            else:
                parts[-1] = last_word.lower()
            wrong_options.append(" ".join(parts))
        
        # パターン3: スペースを削除または追加
        if " " in correct_name:
            # スペースを削除
            wrong_options.append(correct_name.replace(" ", ""))
            # 余分なスペースを追加
            wrong_options.append(correct_name.replace(" ", "  "))
        
        # パターン4: 類似サービス名との混同
        similar_services = {
            "EC2": ["ECS", "EKS", "ECR"],
            "S3": ["SQS", "SNS", "SES"],
            "RDS": ["DynamoDB", "DocumentDB", "Neptune"],
            "Lambda": ["Fargate", "Batch", "Step Functions"],
            "CloudFront": ["CloudWatch", "CloudTrail", "CloudFormation"]
        }
        
        for key, alternatives in similar_services.items():
            if key in correct_name:
                for alt in alternatives:
                    wrong_option = correct_name.replace(key, alt)
                    if wrong_option != correct_name:
                        wrong_options.append(wrong_option)
                        break
        
        # 重複を除去し、最大3つまでに制限
        unique_wrong_options = list(set(wrong_options))
        return unique_wrong_options[:3]
    
    def create_question(self, service: Dict) -> Tuple[str, List[str], int]:
        """問題を作成"""
        correct_name = service["correct"]
        description = service["description"]
        category = service["category"]
        
        # 間違った選択肢を生成
        wrong_options = self.generate_wrong_options(correct_name)
        
        # 足りない場合は追加の間違った選択肢を生成
        while len(wrong_options) < 3:
            # より創造的な間違った選択肢を追加
            if "Amazon" in correct_name:
                wrong_options.append(correct_name.replace("Amazon", "AWS Amazon"))
            elif "AWS" in correct_name:
                wrong_options.append(correct_name.replace("AWS", "Amazon AWS"))
            else:
                wrong_options.append(f"AWS {correct_name}")
        
        # 選択肢をシャッフル
        options = [correct_name] + wrong_options[:3]
        random.shuffle(options)
        correct_index = options.index(correct_name)
        
        question = f"【{category}】{description}のサービス名は？"
        
        return question, options, correct_index
    
    def play_quiz(self, num_questions: int = 10):
        """クイズを開始"""
        print("=" * 50)
        print("🎯 AWS サービス名クイズ")
        print("=" * 50)
        print(f"問題数: {num_questions}問")
        print("正しいサービス名を選択してください。")
        print("-" * 50)
        
        # ランダムにサービスを選択
        selected_services = random.sample(self.services, min(num_questions, len(self.services)))
        
        for i, service in enumerate(selected_services, 1):
            print(f"\n問題 {i}/{num_questions}")
            question, options, correct_index = self.create_question(service)
            
            print(f"Q: {question}")
            print()
            for j, option in enumerate(options, 1):
                print(f"  {j}. {option}")
            
            # ユーザーの回答を取得
            while True:
                try:
                    answer = input("\n答えを選択してください (1-4): ").strip()
                    if answer in ['1', '2', '3', '4']:
                        user_choice = int(answer) - 1
                        break
                    else:
                        print("1から4の数字を入力してください。")
                except (ValueError, KeyboardInterrupt):
                    print("1から4の数字を入力してください。")
            
            # 正解判定
            if user_choice == correct_index:
                print("✅ 正解！")
                self.score += 1
            else:
                print(f"❌ 不正解。正解は: {options[correct_index]}")
            
            self.total_questions += 1
            print(f"現在のスコア: {self.score}/{self.total_questions}")
        
        # 最終結果
        self.show_final_result()
    
    def show_final_result(self):
        """最終結果を表示"""
        print("\n" + "=" * 50)
        print("🏆 クイズ終了！")
        print("=" * 50)
        print(f"最終スコア: {self.score}/{self.total_questions}")
        
        percentage = (self.score / self.total_questions) * 100 if self.total_questions > 0 else 0
        print(f"正答率: {percentage:.1f}%")
        
        if percentage >= 90:
            print("🌟 素晴らしい！AWSサービス名マスターです！")
        elif percentage >= 70:
            print("👍 よくできました！AWSの知識が豊富ですね。")
        elif percentage >= 50:
            print("📚 まずまずです。もう少し学習を続けましょう。")
        else:
            print("💪 頑張りましょう！AWSドキュメントを読んで復習してみてください。")

def main():
    """メイン関数"""
    quiz = AWSServiceQuiz()
    
    print("AWS サービス名クイズへようこそ！")
    
    while True:
        try:
            num_questions = input("\n問題数を入力してください (デフォルト: 10): ").strip()
            if not num_questions:
                num_questions = 10
            else:
                num_questions = int(num_questions)
            
            if 1 <= num_questions <= len(quiz.services):
                break
            else:
                print(f"1から{len(quiz.services)}の間で入力してください。")
        except ValueError:
            print("数字を入力してください。")
    
    quiz.play_quiz(num_questions)
    
    # 再プレイの確認
    while True:
        play_again = input("\nもう一度プレイしますか？ (y/n): ").strip().lower()
        if play_again in ['y', 'yes', 'はい']:
            quiz.score = 0
            quiz.total_questions = 0
            quiz.play_quiz(num_questions)
        elif play_again in ['n', 'no', 'いいえ']:
            print("ありがとうございました！")
            break
        else:
            print("y または n を入力してください。")

if __name__ == "__main__":
    main()
