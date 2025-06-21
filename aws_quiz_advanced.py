#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AWS サービス名クイズゲーム (改良版)
外部JSONファイルからデータを読み込み、より高度な機能を提供
"""

import random
import json
import os
from typing import List, Dict, Tuple

class AWSServiceQuizAdvanced:
    def __init__(self, data_file: str = "services_data.json"):
        self.data_file = data_file
        self.services = self.load_services()
        self.score = 0
        self.total_questions = 0
        self.wrong_answers = []  # 間違えた問題を記録
        
    def load_services(self) -> List[Dict]:
        """JSONファイルからAWSサービスのデータを読み込み"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('services', [])
        except FileNotFoundError:
            print(f"データファイル '{self.data_file}' が見つかりません。")
            print("デフォルトのサービスデータを使用します。")
            return self.get_default_services()
        except json.JSONDecodeError:
            print(f"データファイル '{self.data_file}' の形式が正しくありません。")
            return self.get_default_services()
    
    def get_default_services(self) -> List[Dict]:
        """デフォルトのサービスデータ"""
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
            }
        ]
    
    def generate_wrong_options(self, correct_name: str) -> List[str]:
        """正解に似た間違った選択肢を生成"""
        wrong_options = set()
        
        # パターン1: Amazon/AWS の接頭語を変更
        if correct_name.startswith("Amazon "):
            wrong_options.add(correct_name.replace("Amazon ", "AWS "))
            wrong_options.add(correct_name.replace("Amazon ", ""))  # 接頭語を削除
        elif correct_name.startswith("AWS "):
            wrong_options.add(correct_name.replace("AWS ", "Amazon "))
            wrong_options.add(correct_name.replace("AWS ", ""))  # 接頭語を削除
        
        # パターン2: 大文字小文字を変更
        parts = correct_name.split()
        if len(parts) > 1:
            # 最後の単語の大文字小文字を変更
            last_word = parts[-1]
            if last_word.isupper() and len(last_word) > 1:
                parts_copy = parts.copy()
                parts_copy[-1] = last_word.capitalize()
                wrong_options.add(" ".join(parts_copy))
            elif last_word.islower():
                parts_copy = parts.copy()
                parts_copy[-1] = last_word.upper()
                wrong_options.add(" ".join(parts_copy))
            else:
                parts_copy = parts.copy()
                parts_copy[-1] = last_word.lower()
                wrong_options.add(" ".join(parts_copy))
        
        # パターン3: スペースの操作
        if " " in correct_name:
            # スペースを削除
            wrong_options.add(correct_name.replace(" ", ""))
            # 余分なスペースを追加
            wrong_options.add(correct_name.replace(" ", "  "))
            # ハイフンに変更
            wrong_options.add(correct_name.replace(" ", "-"))
        
        # パターン4: 類似サービス名との混同
        service_confusions = {
            "EC2": ["ECS", "EKS", "ECR", "ELB"],
            "S3": ["SQS", "SNS", "SES", "SWF"],
            "RDS": ["DynamoDB", "DocumentDB", "Neptune", "ElastiCache"],
            "Lambda": ["Fargate", "Batch", "Step Functions"],
            "CloudFront": ["CloudWatch", "CloudTrail", "CloudFormation"],
            "ECS": ["EC2", "EKS", "ECR"],
            "EKS": ["ECS", "EC2", "ECR"],
            "SQS": ["SNS", "SES", "S3"],
            "SNS": ["SQS", "SES", "S3"],
            "CodeCommit": ["CodeBuild", "CodeDeploy", "CodePipeline"],
            "Kinesis": ["Kafka", "Redshift", "Glue"]
        }
        
        for key, alternatives in service_confusions.items():
            if key in correct_name:
                for alt in alternatives:
                    wrong_option = correct_name.replace(key, alt)
                    if wrong_option != correct_name:
                        wrong_options.add(wrong_option)
        
        # パターン5: 一般的な間違いパターン
        common_mistakes = {
            "Q Developer": ["Q Dev", "Q Development", "Q Code"],
            "Q Business": ["Q Biz", "Q Enterprise", "Q Corp"],
            "Route 53": ["Route53", "Route 54", "Route 52"],
            "API Gateway": ["API Gate", "Gateway API", "API Portal"]
        }
        
        for key, alternatives in common_mistakes.items():
            if key in correct_name:
                for alt in alternatives:
                    wrong_option = correct_name.replace(key, alt)
                    wrong_options.add(wrong_option)
        
        # 正解と同じものを除外
        wrong_options.discard(correct_name)
        
        return list(wrong_options)
    
    def create_question(self, service: Dict) -> Tuple[str, List[str], int]:
        """問題を作成"""
        correct_name = service["correct"]
        description = service["description"]
        category = service["category"]
        
        # 間違った選択肢を生成
        wrong_options = self.generate_wrong_options(correct_name)
        
        # 3つの間違った選択肢を選択
        selected_wrong = random.sample(wrong_options, min(3, len(wrong_options)))
        
        # 足りない場合は追加生成
        while len(selected_wrong) < 3:
            # より創造的な間違った選択肢を追加
            if "Amazon" in correct_name:
                selected_wrong.append(f"AWS Amazon {correct_name.split(' ', 1)[1]}")
            elif "AWS" in correct_name:
                selected_wrong.append(f"Amazon AWS {correct_name.split(' ', 1)[1]}")
            else:
                selected_wrong.append(f"Amazon {correct_name}")
            
            # 重複を除去
            selected_wrong = list(set(selected_wrong))
        
        # 選択肢をシャッフル
        options = [correct_name] + selected_wrong[:3]
        random.shuffle(options)
        correct_index = options.index(correct_name)
        
        question = f"【{category}】{description}のサービス名は？"
        
        return question, options, correct_index
    
    def play_quiz(self, num_questions: int = 10, category_filter: str = None):
        """クイズを開始"""
        print("=" * 60)
        print("🎯 AWS サービス名クイズ (改良版)")
        print("=" * 60)
        
        # カテゴリフィルタリング
        available_services = self.services
        if category_filter:
            available_services = [s for s in self.services if s["category"] == category_filter]
            print(f"カテゴリ: {category_filter}")
        
        if not available_services:
            print("指定されたカテゴリにサービスが見つかりません。")
            return
        
        print(f"問題数: {num_questions}問")
        print(f"利用可能サービス数: {len(available_services)}個")
        print("正しいサービス名を選択してください。")
        print("-" * 60)
        
        # ランダムにサービスを選択
        selected_services = random.sample(
            available_services, 
            min(num_questions, len(available_services))
        )
        
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
                self.wrong_answers.append({
                    "question": question,
                    "correct": options[correct_index],
                    "user_answer": options[user_choice],
                    "service": service
                })
            
            self.total_questions += 1
            print(f"現在のスコア: {self.score}/{self.total_questions}")
        
        # 最終結果
        self.show_final_result()
    
    def show_final_result(self):
        """最終結果を表示"""
        print("\n" + "=" * 60)
        print("🏆 クイズ終了！")
        print("=" * 60)
        print(f"最終スコア: {self.score}/{self.total_questions}")
        
        percentage = (self.score / self.total_questions) * 100 if self.total_questions > 0 else 0
        print(f"正答率: {percentage:.1f}%")
        
        # 評価コメント
        if percentage >= 90:
            print("🌟 素晴らしい！AWSサービス名マスターです！")
        elif percentage >= 70:
            print("👍 よくできました！AWSの知識が豊富ですね。")
        elif percentage >= 50:
            print("📚 まずまずです。もう少し学習を続けましょう。")
        else:
            print("💪 頑張りましょう！AWSドキュメントを読んで復習してみてください。")
        
        # 間違えた問題の復習
        if self.wrong_answers:
            print("\n📝 間違えた問題の復習:")
            print("-" * 40)
            for i, wrong in enumerate(self.wrong_answers, 1):
                print(f"{i}. {wrong['question']}")
                print(f"   正解: {wrong['correct']}")
                print(f"   あなたの回答: {wrong['user_answer']}")
                print()
    
    def show_categories(self):
        """利用可能なカテゴリを表示"""
        categories = set(service["category"] for service in self.services)
        print("利用可能なカテゴリ:")
        for i, category in enumerate(sorted(categories), 1):
            count = len([s for s in self.services if s["category"] == category])
            print(f"  {i}. {category} ({count}個)")
        return sorted(categories)

def main():
    """メイン関数"""
    quiz = AWSServiceQuizAdvanced()
    
    print("AWS サービス名クイズ (改良版) へようこそ！")
    print(f"総サービス数: {len(quiz.services)}個")
    
    while True:
        print("\n" + "=" * 40)
        print("メニュー:")
        print("1. 全カテゴリからクイズ")
        print("2. カテゴリを指定してクイズ")
        print("3. カテゴリ一覧を表示")
        print("4. 終了")
        
        choice = input("選択してください (1-4): ").strip()
        
        if choice == "1":
            # 問題数の設定
            try:
                num_questions = input(f"\n問題数を入力してください (1-{len(quiz.services)}, デフォルト: 10): ").strip()
                if not num_questions:
                    num_questions = 10
                else:
                    num_questions = int(num_questions)
                
                if 1 <= num_questions <= len(quiz.services):
                    quiz.score = 0
                    quiz.total_questions = 0
                    quiz.wrong_answers = []
                    quiz.play_quiz(num_questions)
                else:
                    print(f"1から{len(quiz.services)}の間で入力してください。")
            except ValueError:
                print("数字を入力してください。")
        
        elif choice == "2":
            # カテゴリ指定クイズ
            categories = quiz.show_categories()
            try:
                cat_choice = input(f"\nカテゴリ番号を選択してください (1-{len(categories)}): ").strip()
                cat_index = int(cat_choice) - 1
                if 0 <= cat_index < len(categories):
                    selected_category = categories[cat_index]
                    category_services = [s for s in quiz.services if s["category"] == selected_category]
                    
                    num_questions = input(f"問題数を入力してください (1-{len(category_services)}, デフォルト: 5): ").strip()
                    if not num_questions:
                        num_questions = 5
                    else:
                        num_questions = int(num_questions)
                    
                    if 1 <= num_questions <= len(category_services):
                        quiz.score = 0
                        quiz.total_questions = 0
                        quiz.wrong_answers = []
                        quiz.play_quiz(num_questions, selected_category)
                    else:
                        print(f"1から{len(category_services)}の間で入力してください。")
                else:
                    print("無効な選択です。")
            except ValueError:
                print("数字を入力してください。")
        
        elif choice == "3":
            quiz.show_categories()
        
        elif choice == "4":
            print("ありがとうございました！")
            break
        
        else:
            print("1から4の数字を選択してください。")

if __name__ == "__main__":
    main()
