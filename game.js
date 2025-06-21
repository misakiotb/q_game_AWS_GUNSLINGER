// AWS Gunslinger Quiz - ゲームロジック

class AWSGunslingerQuiz {
    constructor() {
        this.services = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.gameQuestions = [];
        this.totalQuestions = 10;
        
        this.initializeElements();
        this.loadServices();
        this.setupEventListeners();
        this.setupCrosshair();
    }

    initializeElements() {
        // 画面要素
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.resultScreen = document.getElementById('result-screen');
        this.reviewScreen = document.getElementById('review-screen');
        
        // ゲーム要素
        this.currentQuestionEl = document.getElementById('current-question');
        this.currentScoreEl = document.getElementById('current-score');
        this.categoryBadge = document.getElementById('category-badge');
        this.questionText = document.getElementById('question-text');
        this.targets = document.querySelectorAll('.target');
        this.crosshair = document.getElementById('crosshair');
        this.muzzleFlash = document.getElementById('muzzle-flash');
        
        // 結果要素
        this.finalScoreEl = document.getElementById('final-score');
        this.accuracyEl = document.getElementById('accuracy');
        this.rankNameEl = document.getElementById('rank-name');
        this.rankCommentEl = document.getElementById('rank-comment');
        
        // ボタン
        this.startBtn = document.getElementById('start-btn');
        this.retryBtn = document.getElementById('retry-btn');
        this.reviewBtn = document.getElementById('review-btn');
        this.backToResultBtn = document.getElementById('back-to-result-btn');
        
        // 復習要素
        this.wrongAnswersEl = document.getElementById('wrong-answers');
    }

    loadServices() {
        // AWSサービスデータ
        this.services = [
            {
                correct: "Amazon Q Developer",
                description: "AI搭載の開発者向けアシスタント",
                category: "AI/ML"
            },
            {
                correct: "Amazon Q Business",
                description: "ビジネス向けAIアシスタント",
                category: "AI/ML"
            },
            {
                correct: "Amazon EC2",
                description: "Elastic Compute Cloud - 仮想サーバー",
                category: "Compute"
            },
            {
                correct: "Amazon S3",
                description: "Simple Storage Service - オブジェクトストレージ",
                category: "Storage"
            },
            {
                correct: "AWS Lambda",
                description: "サーバーレスコンピューティング",
                category: "Compute"
            },
            {
                correct: "Amazon RDS",
                description: "Relational Database Service",
                category: "Database"
            },
            {
                correct: "Amazon CloudFront",
                description: "コンテンツ配信ネットワーク (CDN)",
                category: "Networking"
            },
            {
                correct: "AWS CloudFormation",
                description: "Infrastructure as Code サービス",
                category: "Management"
            },
            {
                correct: "Amazon VPC",
                description: "Virtual Private Cloud",
                category: "Networking"
            },
            {
                correct: "Amazon DynamoDB",
                description: "NoSQLデータベース",
                category: "Database"
            },
            {
                correct: "AWS IAM",
                description: "Identity and Access Management",
                category: "Security"
            },
            {
                correct: "Amazon SQS",
                description: "Simple Queue Service",
                category: "Application Integration"
            },
            {
                correct: "Amazon SNS",
                description: "Simple Notification Service",
                category: "Application Integration"
            },
            {
                correct: "AWS CodeCommit",
                description: "マネージドGitリポジトリ",
                category: "Developer Tools"
            },
            {
                correct: "Amazon ECS",
                description: "Elastic Container Service",
                category: "Containers"
            },
            {
                correct: "Amazon EKS",
                description: "Elastic Kubernetes Service",
                category: "Containers"
            },
            {
                correct: "AWS Fargate",
                description: "サーバーレスコンテナ",
                category: "Containers"
            },
            {
                correct: "Amazon CloudWatch",
                description: "モニタリングとログ管理",
                category: "Management"
            },
            {
                correct: "AWS CloudTrail",
                description: "APIコール監査ログ",
                category: "Security"
            },
            {
                correct: "Amazon Route 53",
                description: "DNSウェブサービス",
                category: "Networking"
            },
            {
                correct: "AWS Elastic Beanstalk",
                description: "アプリケーションデプロイメント",
                category: "Compute"
            },
            {
                correct: "Amazon ElastiCache",
                description: "インメモリキャッシュ",
                category: "Database"
            },
            {
                correct: "Amazon Redshift",
                description: "データウェアハウス",
                category: "Analytics"
            },
            {
                correct: "AWS Glue",
                description: "ETLサービス",
                category: "Analytics"
            },
            {
                correct: "Amazon Kinesis",
                description: "リアルタイムデータストリーミング",
                category: "Analytics"
            },
            {
                correct: "AWS Step Functions",
                description: "サーバーレスワークフロー",
                category: "Application Integration"
            },
            {
                correct: "Amazon API Gateway",
                description: "APIの作成・管理・デプロイ",
                category: "Networking"
            },
            {
                correct: "AWS Secrets Manager",
                description: "シークレット管理",
                category: "Security"
            },
            {
                correct: "AWS Systems Manager",
                description: "運用データの一元管理",
                category: "Management"
            },
            {
                correct: "Amazon Cognito",
                description: "ユーザー認証・認可",
                category: "Security"
            }
        ];
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.retryBtn.addEventListener('click', () => this.startGame());
        this.reviewBtn.addEventListener('click', () => this.showReview());
        this.backToResultBtn.addEventListener('click', () => this.showResult());
        
        // ターゲットクリックイベント
        this.targets.forEach((target, index) => {
            target.addEventListener('click', (e) => this.shootTarget(index, e));
        });
    }

    setupCrosshair() {
        document.addEventListener('mousemove', (e) => {
            if (this.gameScreen.classList.contains('active')) {
                this.crosshair.style.display = 'block';
                this.crosshair.style.left = e.clientX + 'px';
                this.crosshair.style.top = e.clientY + 'px';
            } else {
                this.crosshair.style.display = 'none';
            }
        });
    }

    generateWrongOptions(correctName) {
        const wrongOptions = new Set();
        
        // パターン1: Amazon/AWS の接頭語を変更
        if (correctName.startsWith("Amazon ")) {
            wrongOptions.add(correctName.replace("Amazon ", "AWS "));
            wrongOptions.add(correctName.replace("Amazon ", ""));
        } else if (correctName.startsWith("AWS ")) {
            wrongOptions.add(correctName.replace("AWS ", "Amazon "));
            wrongOptions.add(correctName.replace("AWS ", ""));
        }
        
        // パターン2: 大文字小文字を変更
        const parts = correctName.split(' ');
        if (parts.length > 1) {
            const lastWord = parts[parts.length - 1];
            if (lastWord.length > 1) {
                const modifiedParts = [...parts];
                if (lastWord === lastWord.toUpperCase()) {
                    modifiedParts[modifiedParts.length - 1] = lastWord.charAt(0) + lastWord.slice(1).toLowerCase();
                } else {
                    modifiedParts[modifiedParts.length - 1] = lastWord.toUpperCase();
                }
                wrongOptions.add(modifiedParts.join(' '));
            }
        }
        
        // パターン3: スペースの操作
        if (correctName.includes(' ')) {
            wrongOptions.add(correctName.replace(/ /g, ''));
            wrongOptions.add(correctName.replace(/ /g, '-'));
            wrongOptions.add(correctName.replace(/ /g, '  '));
        }
        
        // パターン4: 類似サービス名との混同
        const serviceConfusions = {
            'EC2': ['ECS', 'EKS', 'ECR'],
            'S3': ['SQS', 'SNS', 'SES'],
            'RDS': ['DynamoDB', 'DocumentDB', 'ElastiCache'],
            'Lambda': ['Fargate', 'Batch'],
            'CloudFront': ['CloudWatch', 'CloudTrail'],
            'ECS': ['EC2', 'EKS'],
            'EKS': ['ECS', 'EC2'],
            'SQS': ['SNS', 'S3'],
            'SNS': ['SQS', 'S3'],
            'Q Developer': ['Q Dev', 'Q Development'],
            'Q Business': ['Q Biz', 'Q Enterprise'],
            'Route 53': ['Route53', 'Route 54']
        };
        
        for (const [key, alternatives] of Object.entries(serviceConfusions)) {
            if (correctName.includes(key)) {
                alternatives.forEach(alt => {
                    const wrongOption = correctName.replace(key, alt);
                    if (wrongOption !== correctName) {
                        wrongOptions.add(wrongOption);
                    }
                });
            }
        }
        
        // パターン5: 一般的な間違いパターン
        if (correctName.includes('Amazon')) {
            wrongOptions.add(`AWS Amazon ${correctName.split(' ').slice(1).join(' ')}`);
        }
        if (correctName.includes('AWS')) {
            wrongOptions.add(`Amazon AWS ${correctName.split(' ').slice(1).join(' ')}`);
        }
        
        // 正解を除外
        wrongOptions.delete(correctName);
        
        return Array.from(wrongOptions);
    }

    createQuestion(service) {
        const correctName = service.correct;
        
        // 間違った選択肢を生成
        let wrongOptions = this.generateWrongOptions(correctName);
        
        // 正解と完全に一致するものを除外（大文字小文字、スペースも含めて厳密に）
        wrongOptions = wrongOptions.filter(option => {
            const normalizedOption = option.trim().replace(/\s+/g, ' ');
            const normalizedCorrect = correctName.trim().replace(/\s+/g, ' ');
            return normalizedOption !== normalizedCorrect;
        });
        
        // 重複を除去
        wrongOptions = [...new Set(wrongOptions)];
        
        // 3つの間違った選択肢を選択
        let selectedWrong = [];
        let attempts = 0;
        const maxAttempts = 20;
        
        // 安全な間違い選択肢を生成
        while (selectedWrong.length < 3 && attempts < maxAttempts) {
            attempts++;
            
            if (wrongOptions.length > 0) {
                // 既存の間違い選択肢から選択
                const candidate = wrongOptions.shift();
                if (candidate && candidate !== correctName && !selectedWrong.includes(candidate)) {
                    selectedWrong.push(candidate);
                }
            } else {
                // 追加の間違い選択肢を生成
                const additionalOptions = this.generateAdditionalWrongOptions(correctName, selectedWrong);
                if (additionalOptions.length > 0) {
                    const candidate = additionalOptions[0];
                    if (candidate !== correctName && !selectedWrong.includes(candidate)) {
                        selectedWrong.push(candidate);
                    }
                }
            }
        }
        
        // まだ足りない場合は強制的に生成
        while (selectedWrong.length < 3) {
            const fallbackOption = `${correctName.replace(/^(Amazon|AWS)\s+/, '')} Alternative ${selectedWrong.length + 1}`;
            if (fallbackOption !== correctName && !selectedWrong.includes(fallbackOption)) {
                selectedWrong.push(fallbackOption);
            } else {
                selectedWrong.push(`Option ${selectedWrong.length + 1}`);
            }
        }
        
        // 最終チェック：正解と重複していないことを確認
        selectedWrong = selectedWrong.filter(option => option !== correctName).slice(0, 3);
        
        // 選択肢を作成（正解 + 間違い3つ）
        const options = [correctName, ...selectedWrong];
        
        // 最終的な重複チェック
        const uniqueOptions = [...new Set(options)];
        if (uniqueOptions.length !== 4) {
            console.error('重複エラー:', {
                correct: correctName,
                wrong: selectedWrong,
                options: options,
                unique: uniqueOptions
            });
            
            // 緊急修正：重複がある場合は強制的に異なる選択肢を作成
            const fixedOptions = [correctName];
            for (let i = 1; i <= 3; i++) {
                let fixedOption = `${correctName} (${i})`;
                while (fixedOptions.includes(fixedOption)) {
                    fixedOption = `${correctName} Ver.${i}`;
                }
                fixedOptions.push(fixedOption);
            }
            return this.createQuestionFromOptions(service, fixedOptions);
        }
        
        // 選択肢をシャッフル
        const shuffledOptions = this.shuffleArray(uniqueOptions);
        const correctIndex = shuffledOptions.indexOf(correctName);
        
        // 最終検証
        if (correctIndex === -1) {
            console.error('正解が選択肢に含まれていません:', {
                correct: correctName,
                options: shuffledOptions
            });
            // 緊急修正
            shuffledOptions[0] = correctName;
            return this.createQuestionFromOptions(service, shuffledOptions);
        }
        
        // デバッグ用ログ
        console.log('問題:', service.description);
        console.log('正解:', correctName);
        console.log('選択肢:', shuffledOptions);
        console.log('正解インデックス:', correctIndex);
        
        return {
            question: service.description,
            category: service.category,
            options: shuffledOptions,
            correctIndex: correctIndex,
            service: service
        };
    }

    generateAdditionalWrongOptions(correctName, existingWrong) {
        const additionalOptions = [];
        
        // パターン1: 接頭語の変更
        if (correctName.startsWith('Amazon ')) {
            const withoutPrefix = correctName.replace('Amazon ', '');
            additionalOptions.push(`AWS ${withoutPrefix}`);
            additionalOptions.push(`Microsoft ${withoutPrefix}`);
            additionalOptions.push(`Google ${withoutPrefix}`);
        } else if (correctName.startsWith('AWS ')) {
            const withoutPrefix = correctName.replace('AWS ', '');
            additionalOptions.push(`Amazon ${withoutPrefix}`);
            additionalOptions.push(`Azure ${withoutPrefix}`);
            additionalOptions.push(`Cloud ${withoutPrefix}`);
        }
        
        // パターン2: サフィックスの追加
        additionalOptions.push(`${correctName} Pro`);
        additionalOptions.push(`${correctName} Plus`);
        additionalOptions.push(`${correctName} Enterprise`);
        additionalOptions.push(`${correctName} Service`);
        
        // パターン3: 略語の変更
        const abbreviations = ['EC2', 'S3', 'RDS', 'IAM', 'VPC', 'ECS', 'EKS'];
        abbreviations.forEach(abbr => {
            if (correctName.includes(abbr)) {
                abbreviations.forEach(altAbbr => {
                    if (altAbbr !== abbr) {
                        additionalOptions.push(correctName.replace(abbr, altAbbr));
                    }
                });
            }
        });
        
        // 正解と既存の間違い選択肢を除外
        return additionalOptions.filter(option => 
            option !== correctName && 
            !existingWrong.includes(option) &&
            option.trim() !== correctName.trim()
        );
    }

    createQuestionFromOptions(service, options) {
        const correctName = service.correct;
        const shuffledOptions = this.shuffleArray([...options]);
        const correctIndex = shuffledOptions.indexOf(correctName);
        
        return {
            question: service.description,
            category: service.category,
            options: shuffledOptions,
            correctIndex: correctIndex,
            service: service
        };
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    startGame() {
        // ゲーム状態をリセット
        this.currentQuestion = 0;
        this.score = 0;
        this.wrongAnswers = [];
        
        // 10問をランダムに選択
        const shuffledServices = this.shuffleArray(this.services);
        this.gameQuestions = shuffledServices.slice(0, this.totalQuestions).map(service => 
            this.createQuestion(service)
        );
        
        // 画面切り替え
        this.showScreen('game');
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.gameQuestions[this.currentQuestion];
        
        // カテゴリ名を短縮
        const shortCategory = this.shortenCategory(question.category);
        
        // UI更新
        this.currentQuestionEl.textContent = this.currentQuestion + 1;
        this.currentScoreEl.textContent = this.score;
        this.categoryBadge.textContent = shortCategory;
        this.questionText.textContent = question.question;
        
        // 選択肢を表示
        question.options.forEach((option, index) => {
            const optionEl = document.getElementById(`option-${index}`);
            optionEl.textContent = option;
        });
        
        // ターゲットをリセット
        this.targets.forEach(target => {
            target.classList.remove('shot', 'correct', 'wrong');
            target.style.pointerEvents = 'auto';
            
            // 弾痕とひび割れエフェクトを削除
            const bulletHoles = target.querySelectorAll('.bullet-hole');
            const cracks = target.querySelectorAll('.crack-effect');
            bulletHoles.forEach(hole => hole.remove());
            cracks.forEach(crack => crack.remove());
        });
    }

    shortenCategory(category) {
        // カテゴリ名を短縮して1行に収める
        const categoryMap = {
            'AI/ML': 'AI/ML',
            'Compute': 'Compute',
            'Storage': 'Storage',
            'Database': 'Database',
            'Networking': 'Network',
            'Security': 'Security',
            'Management': 'Manage',
            'Analytics': 'Analytics',
            'Application Integration': 'App Integration',
            'Containers': 'Container',
            'Developer Tools': 'Dev Tools'
        };
        
        return categoryMap[category] || category;
    }

    shootTarget(targetIndex, event) {
        const question = this.gameQuestions[this.currentQuestion];
        const isCorrect = targetIndex === question.correctIndex;
        const target = this.targets[targetIndex];
        
        // クリック座標を取得
        const rect = target.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        // マズルフラッシュエフェクト
        this.showMuzzleFlash(event.clientX, event.clientY);
        
        // 銃声エフェクト（オプション）
        this.playGunshot();
        
        // ターゲットを無効化
        this.targets.forEach(t => t.style.pointerEvents = 'none');
        
        // クリック座標に弾痕を表示
        this.showBulletHole(target, clickX, clickY);
        
        if (isCorrect) {
            // 正解の場合
            target.classList.add('shot', 'correct');
            this.score++;
            this.showFeedback('🎯 見事な射撃だ！', 'success');
        } else {
            // 不正解の場合
            target.classList.add('shot', 'wrong');
            // 正解の的も表示
            this.targets[question.correctIndex].classList.add('correct');
            
            // 間違い答えを記録（正解と異なることを確認）
            const correctAnswer = question.options[question.correctIndex];
            const userAnswer = question.options[targetIndex];
            
            // 正解と回答が同じ場合はエラーログを出力（デバッグ用）
            if (correctAnswer === userAnswer) {
                console.error('正解判定エラー:', {
                    question: question.question,
                    correctIndex: question.correctIndex,
                    userIndex: targetIndex,
                    correctAnswer: correctAnswer,
                    userAnswer: userAnswer,
                    allOptions: question.options
                });
            } else {
                // 正常な間違い答えのみ記録
                this.wrongAnswers.push({
                    question: question.question,
                    category: question.category,
                    correct: correctAnswer,
                    userAnswer: userAnswer
                });
            }
            
            this.showFeedback('💥 外れだ！正解はこっちだった...', 'error');
        }
        
        // 次の問題へ（時間を元に戻す）
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.totalQuestions) {
                this.displayQuestion();
            } else {
                this.showResult();
            }
        }, 2000); // 4000ms から 2000ms に戻す
    }

    showBulletHole(target, x, y) {
        // 既存の弾痕を削除
        const existingHoles = target.querySelectorAll('.bullet-hole');
        existingHoles.forEach(hole => hole.remove());
        
        // 新しい弾痕を作成
        const bulletHole = document.createElement('div');
        bulletHole.className = 'bullet-hole';
        bulletHole.style.left = (x - 10) + 'px'; // 弾痕の中心をクリック位置に合わせる
        bulletHole.style.top = (y - 10) + 'px';
        
        target.appendChild(bulletHole);
        
        // アニメーション開始
        setTimeout(() => {
            bulletHole.style.transform = 'scale(1)';
        }, 50);
        
        // 弾痕周辺にひび割れエフェクトを追加
        this.addCrackEffect(target, x, y);
    }

    addCrackEffect(target, x, y) {
        // ひび割れエフェクトを作成
        for (let i = 0; i < 3; i++) {
            const crack = document.createElement('div');
            crack.className = 'crack-effect';
            crack.style.cssText = `
                position: absolute;
                width: 2px;
                height: ${15 + Math.random() * 10}px;
                background: linear-gradient(to bottom, #333, transparent);
                left: ${x + (Math.random() - 0.5) * 20}px;
                top: ${y + (Math.random() - 0.5) * 20}px;
                transform: rotate(${Math.random() * 360}deg);
                opacity: 0.6;
                z-index: 2;
                pointer-events: none;
            `;
            
            target.appendChild(crack);
            
            // ひび割れを徐々に表示
            setTimeout(() => {
                crack.style.opacity = '0.8';
            }, 100 + i * 50);
        }
    }

    showMuzzleFlash(x, y) {
        this.muzzleFlash.style.left = x + 'px';
        this.muzzleFlash.style.top = y + 'px';
        this.muzzleFlash.classList.add('active');
        
        setTimeout(() => {
            this.muzzleFlash.classList.remove('active');
        }, 100);
    }

    playGunshot() {
        // 簡単な銃声エフェクト（Web Audio API使用）
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Web Audio APIが使用できない場合は無音
            console.log('Audio not supported');
        }
    }

    showFeedback(message, type) {
        // フィードバック表示（表示時間を延長）
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1001;
            animation: fadeInOut 2s ease;
            ${type === 'success' ? 
                'background: rgba(0,128,0,0.9); color: #90EE90; border: 2px solid #32CD32;' : 
                'background: rgba(128,0,0,0.9); color: #FFB6C1; border: 2px solid #DC143C;'
            }
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 2000); // 4000ms から 2000ms に戻す
    }

    showResult() {
        const accuracy = Math.round((this.score / this.totalQuestions) * 100);
        
        // スコア表示
        this.finalScoreEl.textContent = this.score;
        this.accuracyEl.textContent = `的中率: ${accuracy}%`;
        
        // ランク判定
        const rank = this.getRank(accuracy);
        this.rankNameEl.textContent = rank.name;
        this.rankCommentEl.textContent = rank.comment;
        
        // 復習ボタンの表示/非表示
        this.reviewBtn.style.display = this.wrongAnswers.length > 0 ? 'inline-block' : 'none';
        
        this.showScreen('result');
    }

    getRank(accuracy) {
        if (accuracy >= 90) {
            return {
                name: '🤠 伝説のガンスリンガー',
                comment: '完璧な射撃だ！君は真の西部の英雄だ！'
            };
        } else if (accuracy >= 80) {
            return {
                name: '🎯 熟練ガンスリンガー',
                comment: 'なかなかの腕前だ、相棒！'
            };
        } else if (accuracy >= 70) {
            return {
                name: '🔫 駆け出しガンマン',
                comment: 'まずまずの腕前だが、まだまだ修行が必要だ。'
            };
        } else if (accuracy >= 50) {
            return {
                name: '🤔 見習いカウボーイ',
                comment: '射撃の練習を続けよう、パートナー。'
            };
        } else {
            return {
                name: '🐎 馬の世話係',
                comment: '銃よりも馬の世話の方が向いているかもしれない...'
            };
        }
    }

    showReview() {
        this.wrongAnswersEl.innerHTML = '';
        
        if (this.wrongAnswers.length === 0) {
            this.wrongAnswersEl.innerHTML = '<p style="color: #DAA520; text-align: center;">完璧な射撃でした！間違いはありません。</p>';
        } else {
            this.wrongAnswers.forEach((wrong, index) => {
                const item = document.createElement('div');
                item.className = 'wrong-answer-item';
                item.innerHTML = `
                    <div class="wrong-question">
                        <strong>【${wrong.category}】</strong> ${wrong.question}
                    </div>
                    <div class="wrong-details">
                        <div class="correct-answer">
                            <strong>正解:</strong> ${wrong.correct}
                        </div>
                        <div class="user-answer">
                            <strong>あなたの回答:</strong> ${wrong.userAnswer}
                        </div>
                    </div>
                `;
                this.wrongAnswersEl.appendChild(item);
            });
        }
        
        this.showScreen('review');
    }

    showScreen(screenName) {
        // すべての画面を非表示
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 指定された画面を表示
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }
}

// CSS アニメーション追加
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    new AWSGunslingerQuiz();
});
