// 개발자 퀴즈 앱
class DevQuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedCategory = 'all';
        this.selectedDifficulty = 'all';
        this.userAnswers = [];
        this.init();
    }

    init() {
        this.setupCategoryButtons();
        this.setupDifficultyButtons();
        this.setupStartButton();
        this.setupResultActions();
        this.setupPremiumButton();
        this.registerServiceWorker();
    }

    setupCategoryButtons() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedCategory = btn.dataset.category;
            });
        });
        // 기본 선택
        document.querySelector('.category-btn[data-category="all"]').classList.add('selected');
    }

    setupDifficultyButtons() {
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDifficulty = btn.dataset.diff;
            });
        });
    }

    setupStartButton() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startQuiz();
        });
    }

    startQuiz() {
        // 문제 필터링
        let filtered = [...quizData];
        
        if (this.selectedCategory !== 'all') {
            filtered = filtered.filter(q => q.category === this.selectedCategory);
        }
        
        if (this.selectedDifficulty !== 'all') {
            filtered = filtered.filter(q => q.difficulty === this.selectedDifficulty);
        }

        // 셔플 및 10개 선택
        this.questions = this.shuffle(filtered).slice(0, 10);
        
        if (this.questions.length < 5) {
            alert('선택한 조건의 문제가 부족합니다. 다른 조건을 선택해주세요.');
            return;
        }

        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];

        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        document.getElementById('result-screen').classList.add('hidden');

        this.showQuestion();
    }

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        
        // 헤더 업데이트
        document.getElementById('question-num').textContent = 
            `[${this.currentQuestion + 1}/${this.questions.length}]`;
        document.getElementById('score-display').textContent = 
            `Score: ${this.score}`;
        
        // 프로그레스 바
        const progress = ((this.currentQuestion) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;

        // 질문 표시
        document.getElementById('question-text').textContent = question.question;

        // 코드 블록
        const codeBlock = document.getElementById('code-block');
        if (question.code) {
            codeBlock.innerHTML = `<code>${this.highlightCode(question.code)}</code>`;
            codeBlock.style.display = 'block';
        } else {
            codeBlock.style.display = 'none';
        }

        // 옵션 표시
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `${index + 1}. ${option}`;
            btn.addEventListener('click', () => this.selectAnswer(index));
            container.appendChild(btn);
        });
    }

    highlightCode(code) {
        // 간단한 구문 강조
        return code
            .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|this)\b/g, 
                '<span style="color:#c586c0">$1</span>')
            .replace(/'([^']*)'/g, '<span style="color:#ce9178">\'$1\'</span>')
            .replace(/"([^"]*)"/g, '<span style="color:#ce9178">"$1"</span>')
            .replace(/\b(console|Promise|setTimeout|Math)\b/g, 
                '<span style="color:#dcdcaa">$1</span>')
            .replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$1</span>')
            .replace(/(\/\/.*)/g, '<span style="color:#6a9955">$1</span>');
    }

    selectAnswer(index) {
        const question = this.questions[this.currentQuestion];
        const buttons = document.querySelectorAll('.option-btn');
        
        // 모든 버튼 비활성화
        buttons.forEach(btn => btn.disabled = true);

        // 정답/오답 표시
        buttons[index].classList.add(index === question.answer ? 'correct' : 'wrong');
        if (index !== question.answer) {
            buttons[question.answer].classList.add('correct');
        }

        // 점수 계산
        if (index === question.answer) {
            const points = { easy: 10, normal: 15, hard: 20 };
            this.score += points[question.difficulty] || 10;
        }

        // 사용자 답변 저장
        this.userAnswers.push({
            question: question,
            userAnswer: index,
            isCorrect: index === question.answer
        });

        // 다음 문제로
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.questions.length) {
                this.showQuestion();
            } else {
                this.showResult();
            }
        }, 1500);
    }

    showResult() {
        document.getElementById('quiz-screen').classList.add('hidden');
        document.getElementById('result-screen').classList.remove('hidden');
        document.getElementById('premium-result').classList.add('hidden');

        const correctCount = this.userAnswers.filter(a => a.isCorrect).length;
        const maxScore = this.questions.reduce((sum, q) => {
            const points = { easy: 10, normal: 15, hard: 20 };
            return sum + (points[q.difficulty] || 10);
        }, 0);

        document.getElementById('correct-count').textContent = 
            `${correctCount}/${this.questions.length}`;
        document.getElementById('final-score').textContent = this.score;

        // 등급 계산
        const percentage = (this.score / maxScore) * 100;
        let grade, message;
        
        if (percentage >= 90) {
            grade = 'S';
            message = '🎉 완벽한 실력! 당신은 시니어 개발자급입니다.';
        } else if (percentage >= 80) {
            grade = 'A';
            message = '👏 훌륭합니다! 탄탄한 기본기를 갖추고 있습니다.';
        } else if (percentage >= 70) {
            grade = 'B';
            message = '👍 좋습니다! 조금만 더 공부하면 A등급!';
        } else if (percentage >= 60) {
            grade = 'C';
            message = '📚 기본은 있지만 더 학습이 필요합니다.';
        } else if (percentage >= 50) {
            grade = 'D';
            message = '💪 아직 갈 길이 멀지만, 포기하지 마세요!';
        } else {
            grade = 'F';
            message = '📖 기초부터 다시! 하지만 시작이 반입니다.';
        }

        document.getElementById('grade').textContent = grade;
        document.getElementById('result-message').textContent = message;

        // 통계 저장
        this.saveStats();
    }

    saveStats() {
        const stats = JSON.parse(localStorage.getItem('devQuizStats') || '{}');
        stats.totalGames = (stats.totalGames || 0) + 1;
        stats.totalScore = (stats.totalScore || 0) + this.score;
        stats.highScore = Math.max(stats.highScore || 0, this.score);
        localStorage.setItem('devQuizStats', JSON.stringify(stats));
    }

    setupResultActions() {
        document.getElementById('retry-btn').addEventListener('click', () => {
            document.getElementById('result-screen').classList.add('hidden');
            document.getElementById('start-screen').classList.remove('hidden');
        });

        document.getElementById('share-btn').addEventListener('click', () => {
            this.shareResult();
        });
    }

    shareResult() {
        const correctCount = this.userAnswers.filter(a => a.isCorrect).length;
        const grade = document.getElementById('grade').textContent;
        
        const text = `🖥️ 개발자 퀴즈 결과\n\n` +
            `✅ 정답: ${correctCount}/${this.questions.length}\n` +
            `📊 점수: ${this.score}\n` +
            `🏆 등급: ${grade}\n\n` +
            `당신의 개발 실력을 테스트해보세요!`;

        if (navigator.share) {
            navigator.share({ title: '개발자 퀴즈', text });
        } else {
            navigator.clipboard.writeText(text);
            alert('결과가 클립보드에 복사되었습니다!');
        }
    }

    setupPremiumButton() {
        document.getElementById('premium-btn').addEventListener('click', () => {
            this.showInterstitialAd(() => {
                this.showPremiumContent();
            });
        });
    }

    showInterstitialAd(callback) {
        const adModal = document.getElementById('interstitial-ad');
        const closeBtn = document.getElementById('close-ad');
        const countdown = document.getElementById('countdown');

        adModal.classList.remove('hidden');
        closeBtn.disabled = true;

        let seconds = 5;
        countdown.textContent = seconds;

        const timer = setInterval(() => {
            seconds--;
            countdown.textContent = seconds;

            if (seconds <= 0) {
                clearInterval(timer);
                closeBtn.disabled = false;
                closeBtn.textContent = '닫기';

                closeBtn.onclick = () => {
                    adModal.classList.add('hidden');
                    closeBtn.textContent = '닫기 (5)';
                    if (callback) callback();
                };
            }
        }, 1000);
    }

    showPremiumContent() {
        const wrongAnswers = this.userAnswers.filter(a => !a.isCorrect);
        
        let content = '';
        
        if (wrongAnswers.length === 0) {
            content = '🎉 완벽! 모든 문제를 맞추셨습니다!\n\n';
            content += '축하합니다! 당신은 정말 뛰어난 개발자입니다.\n';
            content += '더 어려운 난이도에 도전해보세요!';
        } else {
            content = '📚 오답 노트\n\n';
            
            wrongAnswers.forEach((item, idx) => {
                const q = item.question;
                content += `━━━━━━━━━━━━━━━━━━━━\n`;
                content += `❌ 문제 ${idx + 1}\n`;
                content += `${q.question}\n\n`;
                content += `당신의 답: ${q.options[item.userAnswer]}\n`;
                content += `정답: ${q.options[q.answer]}\n\n`;
                content += `💡 해설:\n${q.explanation}\n\n`;
            });

            content += `━━━━━━━━━━━━━━━━━━━━\n`;
            content += `📊 카테고리별 분석\n\n`;
            
            // 카테고리별 분석
            const categoryStats = {};
            this.userAnswers.forEach(item => {
                const cat = item.question.category;
                if (!categoryStats[cat]) {
                    categoryStats[cat] = { correct: 0, total: 0 };
                }
                categoryStats[cat].total++;
                if (item.isCorrect) categoryStats[cat].correct++;
            });

            const catNames = {
                javascript: 'JavaScript',
                python: 'Python',
                web: '웹개발',
                database: 'DB/SQL',
                cs: 'CS기초',
                git: 'Git',
                devops: 'DevOps'
            };

            for (const [cat, stats] of Object.entries(categoryStats)) {
                const pct = Math.round((stats.correct / stats.total) * 100);
                content += `${catNames[cat] || cat}: ${stats.correct}/${stats.total} (${pct}%)\n`;
            }

            content += `\n💪 추천 학습 분야:\n`;
            const weakCategories = Object.entries(categoryStats)
                .filter(([_, stats]) => (stats.correct / stats.total) < 0.7)
                .map(([cat, _]) => catNames[cat] || cat);
            
            if (weakCategories.length > 0) {
                content += weakCategories.join(', ');
            } else {
                content += '전체적으로 균형 잡힌 실력입니다!';
            }
        }

        document.getElementById('premium-content').textContent = content;
        document.getElementById('premium-result').classList.remove('hidden');
        document.getElementById('premium-result').scrollIntoView({ behavior: 'smooth' });
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('Service Worker registered'))
                .catch(err => console.log('SW registration failed:', err));
        }
    }
}

// 앱 시작
document.addEventListener('DOMContentLoaded', () => {
    new DevQuizApp();
});
