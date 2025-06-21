// AWS Gunslinger Quiz - ゲームロジック（多言語対応）

class AWSGunslingerQuiz {
    constructor() {
        this.services = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.gameQuestions = [];
        this.totalQuestions = 10;
        this.currentLanguage = 'ja';
        
        this.initializeElements();
        this.loadTranslations();
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
        
        // 言語選択
        this.languageSelect = document.getElementById('language-select');
    }

    loadTranslations() {
        this.translations = {
            ja: {
                subtitle: "Service Name Showdown",
                description: "西部の荒野で繰り広げられるAWSサービス名の決闘！<br>正しいサービス名を撃ち抜け、ガンスリンガー！",
                selectLanguage: "言語を選択:",
                startButton: "🔫 決闘開始！",
                questionCounter: "問題",
                score: "的中:",
                gameOver: "決闘終了！",
                accuracy: "的中率:",
                yourTitle: "あなたの称号",
                backToTitle: "🏠 タイトル画面へ",
                reviewMistakes: "📝 間違いを確認",
                missedTargets: "🎯 撃ち損じた標的",
                backToResult: "🔙 結果に戻る",
                correctAnswer: "正解:",
                yourAnswer: "あなたの回答:",
                perfectShot: "完璧な射撃でした！間違いはありません。",
                hitFeedback: "🎯 見事な射撃だ！",
                missFeedback: "💥 外れだ！正解はこっちだった...",
                ranks: {
                    legendary: "🤠 伝説のガンスリンガー",
                    expert: "🎯 熟練ガンスリンガー",
                    rookie: "🔫 駆け出しガンマン",
                    apprentice: "🤔 見習いカウボーイ",
                    stable: "🐎 馬の世話係"
                },
                rankComments: {
                    legendary: "完璧な射撃だ！君は真の西部の英雄だ！",
                    expert: "なかなかの腕前だ、相棒！",
                    rookie: "まずまずの腕前だが、まだまだ修行が必要だ。",
                    apprentice: "射撃の練習を続けよう、パートナー。",
                    stable: "銃よりも馬の世話の方が向いているかもしれない..."
                }
            },
            en: {
                subtitle: "Service Name Showdown",
                description: "AWS service name duel in the wild west!<br>Shoot the correct service name, gunslinger!",
                selectLanguage: "Select Language:",
                startButton: "🔫 Start Duel!",
                questionCounter: "Question",
                score: "Hits:",
                gameOver: "Duel Over!",
                accuracy: "Accuracy:",
                yourTitle: "Your Title",
                backToTitle: "🏠 Back to Title",
                reviewMistakes: "📝 Review Mistakes",
                missedTargets: "🎯 Missed Targets",
                backToResult: "🔙 Back to Results",
                correctAnswer: "Correct:",
                yourAnswer: "Your Answer:",
                perfectShot: "Perfect shooting! No mistakes.",
                hitFeedback: "🎯 Great shot!",
                missFeedback: "💥 Miss! The correct answer was over there...",
                ranks: {
                    legendary: "🤠 Legendary Gunslinger",
                    expert: "🎯 Expert Gunslinger",
                    rookie: "🔫 Rookie Gunman",
                    apprentice: "🤔 Apprentice Cowboy",
                    stable: "🐎 Stable Hand"
                },
                rankComments: {
                    legendary: "Perfect shooting! You are a true western hero!",
                    expert: "Nice shooting, partner!",
                    rookie: "Decent shooting, but more practice needed.",
                    apprentice: "Keep practicing your shooting, partner.",
                    stable: "Maybe taking care of horses suits you better..."
                }
            },
            zh: {
                subtitle: "服务名称对决",
                description: "西部荒野中的AWS服务名称决斗！<br>射中正确的服务名称，枪手！",
                selectLanguage: "选择语言:",
                startButton: "🔫 开始决斗！",
                questionCounter: "问题",
                score: "命中:",
                gameOver: "决斗结束！",
                accuracy: "命中率:",
                yourTitle: "你的称号",
                backToTitle: "🏠 返回标题",
                reviewMistakes: "📝 查看错误",
                missedTargets: "🎯 未命中目标",
                backToResult: "🔙 返回结果",
                correctAnswer: "正确答案:",
                yourAnswer: "你的答案:",
                perfectShot: "完美射击！没有错误。",
                hitFeedback: "🎯 好枪法！",
                missFeedback: "💥 没中！正确答案在那边...",
                ranks: {
                    legendary: "🤠 传奇枪手",
                    expert: "🎯 专家枪手",
                    rookie: "🔫 新手枪手",
                    apprentice: "🤔 学徒牛仔",
                    stable: "🐎 马夫"
                },
                rankComments: {
                    legendary: "完美的射击！你是真正的西部英雄！",
                    expert: "不错的枪法，伙伴！",
                    rookie: "还不错，但还需要更多练习。",
                    apprentice: "继续练习射击，伙伴。",
                    stable: "也许照顾马匹更适合你..."
                }
            },
            ko: {
                subtitle: "서비스 이름 대결",
                description: "서부 황야에서 펼쳐지는 AWS 서비스 이름 결투!<br>정확한 서비스 이름을 쏴라, 건슬링거!",
                selectLanguage: "언어 선택:",
                startButton: "🔫 결투 시작!",
                questionCounter: "문제",
                score: "명중:",
                gameOver: "결투 종료!",
                accuracy: "명중률:",
                yourTitle: "당신의 칭호",
                backToTitle: "🏠 타이틀로 돌아가기",
                reviewMistakes: "📝 실수 확인",
                missedTargets: "🎯 놓친 표적",
                backToResult: "🔙 결과로 돌아가기",
                correctAnswer: "정답:",
                yourAnswer: "당신의 답:",
                perfectShot: "완벽한 사격! 실수가 없습니다.",
                hitFeedback: "🎯 훌륭한 사격!",
                missFeedback: "💥 빗나갔다! 정답은 저쪽이었어...",
                ranks: {
                    legendary: "🤠 전설의 건슬링거",
                    expert: "🎯 숙련된 건슬링거",
                    rookie: "🔫 초보 건맨",
                    apprentice: "🤔 견습 카우보이",
                    stable: "🐎 마구간지기"
                },
                rankComments: {
                    legendary: "완벽한 사격! 당신은 진정한 서부의 영웅입니다!",
                    expert: "좋은 실력이군, 파트너!",
                    rookie: "괜찮은 실력이지만 더 연습이 필요해.",
                    apprentice: "계속 사격 연습을 하자, 파트너.",
                    stable: "총보다는 말 돌보는 게 더 맞을지도..."
                }
            }
        };
    }

    loadServices() {
        // AWSサービスデータ（多言語対応）
        this.services = [
            {
                correct: "Amazon Q Developer",
                descriptions: {
                    ja: "AI搭載の開発者向けアシスタント",
                    en: "AI-powered developer assistant",
                    zh: "AI驱动的开发者助手",
                    ko: "AI 기반 개발자 어시스턴트"
                },
                category: "AI/ML"
            },
            {
                correct: "Amazon Q Business",
                descriptions: {
                    ja: "ビジネス向けAIアシスタント",
                    en: "AI assistant for business",
                    zh: "商业AI助手",
                    ko: "비즈니스용 AI 어시스턴트"
                },
                category: "AI/ML"
            },
            {
                correct: "Amazon EC2",
                descriptions: {
                    ja: "Elastic Compute Cloud - 仮想サーバー",
                    en: "Elastic Compute Cloud - Virtual servers",
                    zh: "弹性计算云 - 虚拟服务器",
                    ko: "탄력적 컴퓨팅 클라우드 - 가상 서버"
                },
                category: "Compute"
            },
            {
                correct: "Amazon S3",
                descriptions: {
                    ja: "Simple Storage Service - オブジェクトストレージ",
                    en: "Simple Storage Service - Object storage",
                    zh: "简单存储服务 - 对象存储",
                    ko: "단순 스토리지 서비스 - 객체 스토리지"
                },
                category: "Storage"
            },
            {
                correct: "AWS Lambda",
                descriptions: {
                    ja: "サーバーレスコンピューティング",
                    en: "Serverless computing",
                    zh: "无服务器计算",
                    ko: "서버리스 컴퓨팅"
                },
                category: "Compute"
            },
            {
                correct: "Amazon RDS",
                descriptions: {
                    ja: "Relational Database Service",
                    en: "Relational Database Service",
                    zh: "关系数据库服务",
                    ko: "관계형 데이터베이스 서비스"
                },
                category: "Database"
            },
            {
                correct: "Amazon CloudFront",
                descriptions: {
                    ja: "コンテンツ配信ネットワーク (CDN)",
                    en: "Content Delivery Network (CDN)",
                    zh: "内容分发网络 (CDN)",
                    ko: "콘텐츠 전송 네트워크 (CDN)"
                },
                category: "Networking"
            },
            {
                correct: "AWS CloudFormation",
                descriptions: {
                    ja: "Infrastructure as Code サービス",
                    en: "Infrastructure as Code service",
                    zh: "基础设施即代码服务",
                    ko: "코드형 인프라 서비스"
                },
                category: "Management"
            },
            {
                correct: "Amazon VPC",
                descriptions: {
                    ja: "Virtual Private Cloud",
                    en: "Virtual Private Cloud",
                    zh: "虚拟私有云",
                    ko: "가상 프라이빗 클라우드"
                },
                category: "Networking"
            },
            {
                correct: "Amazon DynamoDB",
                descriptions: {
                    ja: "NoSQLデータベース",
                    en: "NoSQL database",
                    zh: "NoSQL数据库",
                    ko: "NoSQL 데이터베이스"
                },
                category: "Database"
            },
            {
                correct: "AWS IAM",
                descriptions: {
                    ja: "Identity and Access Management",
                    en: "Identity and Access Management",
                    zh: "身份和访问管理",
                    ko: "자격 증명 및 액세스 관리"
                },
                category: "Security"
            },
            {
                correct: "Amazon SQS",
                descriptions: {
                    ja: "Simple Queue Service",
                    en: "Simple Queue Service",
                    zh: "简单队列服务",
                    ko: "단순 대기열 서비스"
                },
                category: "Application Integration"
            },
            {
                correct: "Amazon SNS",
                descriptions: {
                    ja: "Simple Notification Service",
                    en: "Simple Notification Service",
                    zh: "简单通知服务",
                    ko: "단순 알림 서비스"
                },
                category: "Application Integration"
            },
            {
                correct: "AWS CodeCommit",
                descriptions: {
                    ja: "マネージドGitリポジトリ",
                    en: "Managed Git repository",
                    zh: "托管Git存储库",
                    ko: "관리형 Git 리포지토리"
                },
                category: "Developer Tools"
            },
            {
                correct: "Amazon ECS",
                descriptions: {
                    ja: "Elastic Container Service",
                    en: "Elastic Container Service",
                    zh: "弹性容器服务",
                    ko: "탄력적 컨테이너 서비스"
                },
                category: "Containers"
            },
            {
                correct: "Amazon EKS",
                descriptions: {
                    ja: "Elastic Kubernetes Service",
                    en: "Elastic Kubernetes Service",
                    zh: "弹性Kubernetes服务",
                    ko: "탄력적 Kubernetes 서비스"
                },
                category: "Containers"
            },
            {
                correct: "AWS Fargate",
                descriptions: {
                    ja: "サーバーレスコンテナ",
                    en: "Serverless containers",
                    zh: "无服务器容器",
                    ko: "서버리스 컨테이너"
                },
                category: "Containers"
            },
            {
                correct: "Amazon CloudWatch",
                descriptions: {
                    ja: "モニタリングとログ管理",
                    en: "Monitoring and log management",
                    zh: "监控和日志管理",
                    ko: "모니터링 및 로그 관리"
                },
                category: "Management"
            },
            {
                correct: "AWS CloudTrail",
                descriptions: {
                    ja: "APIコール監査ログ",
                    en: "API call audit logging",
                    zh: "API调用审计日志",
                    ko: "API 호출 감사 로깅"
                },
                category: "Security"
            },
            {
                correct: "Amazon Route 53",
                descriptions: {
                    ja: "DNSウェブサービス",
                    en: "DNS web service",
                    zh: "DNS网络服务",
                    ko: "DNS 웹 서비스"
                },
                category: "Networking"
            },
            {
                correct: "AWS Elastic Beanstalk",
                descriptions: {
                    ja: "アプリケーションデプロイメント",
                    en: "Application deployment",
                    zh: "应用程序部署",
                    ko: "애플리케이션 배포"
                },
                category: "Compute"
            },
            {
                correct: "Amazon ElastiCache",
                descriptions: {
                    ja: "インメモリキャッシュ",
                    en: "In-memory cache",
                    zh: "内存缓存",
                    ko: "인메모리 캐시"
                },
                category: "Database"
            },
            {
                correct: "Amazon Redshift",
                descriptions: {
                    ja: "データウェアハウス",
                    en: "Data warehouse",
                    zh: "数据仓库",
                    ko: "데이터 웨어하우스"
                },
                category: "Analytics"
            },
            {
                correct: "AWS Glue",
                descriptions: {
                    ja: "ETLサービス",
                    en: "ETL service",
                    zh: "ETL服务",
                    ko: "ETL 서비스"
                },
                category: "Analytics"
            },
            {
                correct: "Amazon Kinesis",
                descriptions: {
                    ja: "リアルタイムデータストリーミング",
                    en: "Real-time data streaming",
                    zh: "实时数据流",
                    ko: "실시간 데이터 스트리밍"
                },
                category: "Analytics"
            },
            {
                correct: "AWS Step Functions",
                descriptions: {
                    ja: "サーバーレスワークフロー",
                    en: "Serverless workflow",
                    zh: "无服务器工作流",
                    ko: "서버리스 워크플로"
                },
                category: "Application Integration"
            },
            {
                correct: "Amazon API Gateway",
                descriptions: {
                    ja: "APIの作成・管理・デプロイ",
                    en: "API creation, management, and deployment",
                    zh: "API创建、管理和部署",
                    ko: "API 생성, 관리 및 배포"
                },
                category: "Networking"
            },
            {
                correct: "AWS Secrets Manager",
                descriptions: {
                    ja: "シークレット管理",
                    en: "Secrets management",
                    zh: "密钥管理",
                    ko: "시크릿 관리"
                },
                category: "Security"
            },
            {
                correct: "AWS Systems Manager",
                descriptions: {
                    ja: "運用データの一元管理",
                    en: "Centralized operational data management",
                    zh: "集中运营数据管理",
                    ko: "중앙 집중식 운영 데이터 관리"
                },
                category: "Management"
            },
            {
                correct: "Amazon Cognito",
                descriptions: {
                    ja: "ユーザー認証・認可",
                    en: "User authentication and authorization",
                    zh: "用户身份验证和授权",
                    ko: "사용자 인증 및 권한 부여"
                },
                category: "Security"
            }
        ];
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.retryBtn.addEventListener('click', () => this.backToTitle());
        this.reviewBtn.addEventListener('click', () => this.showReview());
        this.backToResultBtn.addEventListener('click', () => this.showResult());
        
        // 言語選択イベント
        this.languageSelect.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateLanguage();
        });
        
        // ターゲットクリックイベント
        this.targets.forEach((target, index) => {
            target.addEventListener('click', (e) => this.shootTarget(index, e));
        });
    }

    updateLanguage() {
        const t = this.translations[this.currentLanguage];
        
        // data-i18n属性を持つ要素を更新
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                if (element.innerHTML.includes('<span')) {
                    // スパン要素を含む場合は特別処理
                    const spans = element.querySelectorAll('span');
                    if (key === 'questionCounter') {
                        element.innerHTML = `${t[key]} <span id="current-question">${spans[0]?.textContent || '1'}</span>/10`;
                    } else if (key === 'score') {
                        element.innerHTML = `${t[key]} <span id="current-score">${spans[0]?.textContent || '0'}</span>`;
                    } else if (key === 'accuracy') {
                        element.innerHTML = `${t[key]} ${spans[0]?.textContent || '80%'}`;
                    }
                } else {
                    element.innerHTML = t[key];
                }
            }
        });
        
        // 要素の参照を更新
        this.currentQuestionEl = document.getElementById('current-question');
        this.currentScoreEl = document.getElementById('current-score');
        
        // ゲーム中の場合は問題文も更新
        if (this.gameScreen.classList.contains('active') && this.gameQuestions.length > 0) {
            const currentGameQuestion = this.gameQuestions[this.currentQuestion];
            if (currentGameQuestion && currentGameQuestion.service) {
                this.questionText.textContent = currentGameQuestion.service.descriptions[this.currentLanguage] || currentGameQuestion.service.descriptions.ja;
            }
        }
    }

    backToTitle() {
        // ゲーム状態をリセット
        this.currentQuestion = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.gameQuestions = [];
        
        // タイトル画面に戻る
        this.showScreen('start');
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
            question: service.descriptions[this.currentLanguage] || service.descriptions.ja,
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
            question: service.descriptions[this.currentLanguage] || service.descriptions.ja,
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
            this.showFeedback(this.translations[this.currentLanguage].hitFeedback, 'success');
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
            
            this.showFeedback(this.translations[this.currentLanguage].missFeedback, 'error');
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
        const t = this.translations[this.currentLanguage];
        
        // スコア表示
        this.finalScoreEl.textContent = this.score;
        this.accuracyEl.innerHTML = `${t.accuracy} ${accuracy}%`;
        
        // ランク判定
        const rank = this.getRank(accuracy);
        this.rankNameEl.textContent = rank.name;
        this.rankCommentEl.textContent = rank.comment;
        
        // 復習ボタンの表示/非表示
        this.reviewBtn.style.display = this.wrongAnswers.length > 0 ? 'inline-block' : 'none';
        
        this.showScreen('result');
    }

    getRank(accuracy) {
        const t = this.translations[this.currentLanguage];
        
        if (accuracy >= 90) {
            return {
                name: t.ranks.legendary,
                comment: t.rankComments.legendary
            };
        } else if (accuracy >= 80) {
            return {
                name: t.ranks.expert,
                comment: t.rankComments.expert
            };
        } else if (accuracy >= 70) {
            return {
                name: t.ranks.rookie,
                comment: t.rankComments.rookie
            };
        } else if (accuracy >= 50) {
            return {
                name: t.ranks.apprentice,
                comment: t.rankComments.apprentice
            };
        } else {
            return {
                name: t.ranks.stable,
                comment: t.rankComments.stable
            };
        }
    }

    showReview() {
        const t = this.translations[this.currentLanguage];
        this.wrongAnswersEl.innerHTML = '';
        
        if (this.wrongAnswers.length === 0) {
            this.wrongAnswersEl.innerHTML = `<p style="color: #DAA520; text-align: center;">${t.perfectShot}</p>`;
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
                            <strong>${t.correctAnswer}</strong> ${wrong.correct}
                        </div>
                        <div class="user-answer">
                            <strong>${t.yourAnswer}</strong> ${wrong.userAnswer}
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
    const quiz = new AWSGunslingerQuiz();
    // 初期言語設定
    quiz.updateLanguage();
});
