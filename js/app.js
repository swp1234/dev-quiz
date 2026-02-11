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
        try {
            this.initTheme();
            this.setupCategoryButtons();
            this.setupDifficultyButtons();
            this.setupStartButton();
            this.setupDailyChallenge();
            this.setupResultActions();
            this.setupPremiumButton();
            this.renderStatsDashboard();
            this.registerServiceWorker();
            this.setupThemeToggle();
        } catch (e) {
            const errorMsg = window.i18n?.t('daily.appInitError') || 'App initialization error:';
            console.error(errorMsg, e);
        }
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';
        }
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
            alert(window.i18n?.t('alerts.notEnoughQuestions') || 'Not enough questions for the selected criteria. Please choose different options.');
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
            message = window.i18n?.t('grades.S') || '🎉 Perfect! You\'re at senior developer level.';
        } else if (percentage >= 80) {
            grade = 'A';
            message = window.i18n?.t('grades.A') || '👏 Excellent! You have solid fundamentals.';
        } else if (percentage >= 70) {
            grade = 'B';
            message = window.i18n?.t('grades.B') || '👍 Good! A bit more study and you\'ll reach grade A!';
        } else if (percentage >= 60) {
            grade = 'C';
            message = window.i18n?.t('grades.C') || '📚 You have the basics, but need more learning.';
        } else if (percentage >= 50) {
            grade = 'D';
            message = window.i18n?.t('grades.D') || '💪 You have a long way to go, but don\'t give up!';
        } else {
            grade = 'F';
            message = window.i18n?.t('grades.F') || '📖 Start from the basics! But remember, getting started is half the battle!';
        }

        document.getElementById('grade').textContent = grade;
        document.getElementById('result-message').textContent = message;

        // 일일 챌린지 완료 처리
        if (this.isDailyChallenge) {
            const today = new Date().toDateString();
            localStorage.setItem('devQuizDaily', JSON.stringify({
                date: today,
                completed: true,
                score: this.score,
                grade: grade
            }));
            this.isDailyChallenge = false;

            // 버튼 업데이트
            const dailyBtn = document.getElementById('daily-btn');
            if (dailyBtn) {
                dailyBtn.style.opacity = '0.5';
                const completedText = window.i18n?.t('daily.completed') || 'Today\'s challenge complete!';
                dailyBtn.innerHTML = `<span class="daily-icon">✅</span> ${completedText}`;
            }
        }

        // 통계 저장
        this.saveStats();
    }

    saveStats() {
        const stats = JSON.parse(localStorage.getItem('devQuizStats') || '{}');
        stats.totalGames = (stats.totalGames || 0) + 1;
        stats.totalScore = (stats.totalScore || 0) + this.score;
        stats.highScore = Math.max(stats.highScore || 0, this.score);

        // 정답률 추적
        const correctCount = this.userAnswers.filter(a => a.isCorrect).length;
        stats.totalCorrect = (stats.totalCorrect || 0) + correctCount;
        stats.totalQuestions = (stats.totalQuestions || 0) + this.questions.length;

        // 연속일 추적
        const today = new Date().toDateString();
        if (stats.lastPlayDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (stats.lastPlayDate === yesterday.toDateString()) {
                stats.streak = (stats.streak || 0) + 1;
            } else if (stats.lastPlayDate) {
                stats.streak = 1;
            } else {
                stats.streak = 1;
            }
            stats.lastPlayDate = today;
        }

        localStorage.setItem('devQuizStats', JSON.stringify(stats));
        this.renderStatsDashboard();
    }

    // 일일 챌린지 설정
    setupDailyChallenge() {
        const dailyBtn = document.getElementById('daily-btn');
        if (!dailyBtn) return;

        // 연속일 표시
        const stats = JSON.parse(localStorage.getItem('devQuizStats') || '{}');
        const streakEl = document.getElementById('daily-streak');
        if (stats.streak && stats.streak > 0) {
            const streakTemplate = window.i18n?.t('daily.streakDays') || '🔥 {count} days';
            streakEl.textContent = streakTemplate.replace('{count}', stats.streak);
        }

        // 오늘 이미 완료했는지 확인
        const today = new Date().toDateString();
        const dailyData = JSON.parse(localStorage.getItem('devQuizDaily') || '{}');
        if (dailyData.date === today && dailyData.completed) {
            dailyBtn.style.opacity = '0.5';
            const completedText = window.i18n?.t('daily.completed') || 'Today\'s challenge complete!';
            dailyBtn.innerHTML = `<span class="daily-icon">✅</span> ${completedText}`;
        }

        dailyBtn.addEventListener('click', () => {
            this.startDailyChallenge();
        });
    }

    startDailyChallenge() {
        const today = new Date().toDateString();
        const dailyData = JSON.parse(localStorage.getItem('devQuizDaily') || '{}');

        if (dailyData.date === today && dailyData.completed) {
            const msg = window.i18n?.t('daily.alreadyCompleted') || 'You\'ve already completed today\'s challenge! Try again tomorrow.';
            alert(msg);
            return;
        }

        // 날짜 기반 시드로 모든 사용자에게 같은 문제 제공
        const seed = this.hashCode(today);
        const shuffled = [...quizData].sort((a, b) => {
            const ha = this.hashCode(today + a.question);
            const hb = this.hashCode(today + b.question);
            return ha - hb;
        });

        this.questions = shuffled.slice(0, 10);
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isDailyChallenge = true;

        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        document.getElementById('result-screen').classList.add('hidden');

        this.showQuestion();
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    // 통계 대시보드 렌더링
    renderStatsDashboard() {
        const stats = JSON.parse(localStorage.getItem('devQuizStats') || '{}');

        const gamesEl = document.getElementById('stat-games');
        const highEl = document.getElementById('stat-high');
        const streakEl = document.getElementById('stat-streak');
        const avgEl = document.getElementById('stat-avg');

        if (gamesEl) gamesEl.textContent = stats?.totalGames || 0;
        if (highEl) highEl.textContent = stats?.highScore || 0;
        if (streakEl) streakEl.textContent = stats?.streak || 0;
        if (avgEl) {
            const rate = (stats?.totalQuestions || 0) > 0
                ? Math.round(((stats?.totalCorrect || 0) / (stats?.totalQuestions || 1)) * 100)
                : 0;
            avgEl.textContent = `${rate}%`;
        }
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

        const template = window.i18n?.t('share.text') || '🖥️ Developer Quiz Results\n\n✅ Correct: {correct}/{total}\n📊 Score: {score}\n🏆 Grade: {grade}\n\nTest your coding skills!';
        const text = template
            .replace('{correct}', correctCount)
            .replace('{total}', this.questions.length)
            .replace('{score}', this.score)
            .replace('{grade}', grade);

        const shareTitle = window.i18n?.t('share.title') || 'Developer Quiz';

        if (navigator.share) {
            navigator.share({ title: shareTitle, text });
        } else {
            navigator.clipboard.writeText(text);
            const copiedMsg = window.i18n?.t('share.copied') || 'Result copied to clipboard!';
            alert(copiedMsg);
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
                const closeText = window.i18n?.t('ads.close') || 'Close';
                closeBtn.textContent = closeText;

                closeBtn.onclick = () => {
                    adModal.classList.add('hidden');
                    const closeDefault = window.i18n?.t('ads.closeCountdown') || 'Close ({count})';
                    closeBtn.textContent = closeDefault.replace('{count}', '5');
                    if (callback) callback();
                };
            }
        }, 1000);
    }

    showPremiumContent() {
        const wrongAnswers = this.userAnswers.filter(a => !a.isCorrect);

        let content = '';

        if (wrongAnswers.length === 0) {
            content = window.i18n?.t('premium.perfect') || '🎉 Perfect! You got all the questions right!\n\nCongratulations! You\'re a truly outstanding developer.\nTry challenging higher difficulty levels!';
        } else {
            const wrongNotesLabel = window.i18n?.t('premium.wrongNotes') || '📚 Wrong Answer Notes';
            content = `${wrongNotesLabel}\n\n`;

            wrongAnswers.forEach((item, idx) => {
                const q = item.question;
                const separator = window.i18n?.t('premium.separator') || '━━━━━━━━━━━━━━━━━━━━';
                const problemLabel = window.i18n?.t('premium.problem') || '❌ Problem {number}';
                const yourAnswerLabel = window.i18n?.t('premium.yourAnswer') || 'Your Answer:';
                const answerLabel = window.i18n?.t('premium.answer') || 'Answer:';
                const explanationLabel = window.i18n?.t('premium.explanation') || '💡 Explanation:';

                content += `${separator}\n`;
                content += `${problemLabel.replace('{number}', idx + 1)}\n`;
                content += `${q.question}\n\n`;
                content += `${yourAnswerLabel} ${q.options[item.userAnswer]}\n`;
                content += `${answerLabel} ${q.options[q.answer]}\n\n`;
                content += `${explanationLabel}\n${q.explanation}\n\n`;
            });

            const separator = window.i18n?.t('premium.separator') || '━━━━━━━━━━━━━━━━━━━━';
            const categoryLabel = window.i18n?.t('premium.categoryAnalysis') || '📊 Category Analysis';
            content += `${separator}\n${categoryLabel}\n\n`;

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
                javascript: window.i18n?.t('premium.categories.javascript') || 'JavaScript',
                python: window.i18n?.t('premium.categories.python') || 'Python',
                web: window.i18n?.t('premium.categories.web') || 'Web Development',
                database: window.i18n?.t('premium.categories.database') || 'DB/SQL',
                cs: window.i18n?.t('premium.categories.cs') || 'CS Fundamentals',
                git: window.i18n?.t('premium.categories.git') || 'Git',
                devops: window.i18n?.t('premium.categories.devops') || 'DevOps'
            };

            for (const [cat, stats] of Object.entries(categoryStats)) {
                const pct = Math.round((stats.correct / stats.total) * 100);
                content += `${catNames[cat] || cat}: ${stats.correct}/${stats.total} (${pct}%)\n`;
            }

            const recommendLabel = window.i18n?.t('premium.recommendations') || '💪 Recommended Learning Areas:';
            content += `\n${recommendLabel}\n`;
            const weakCategories = Object.entries(categoryStats)
                .filter(([_, stats]) => (stats.correct / stats.total) < 0.7)
                .map(([cat, _]) => catNames[cat] || cat);

            if (weakCategories.length > 0) {
                content += weakCategories.join(', ');
            } else {
                const balancedMsg = window.i18n?.t('premium.balanced') || 'Your skills are well-balanced overall!';
                content += balancedMsg;
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

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
            });
        }
    }
}

// i18n 초기화 및 앱 시작
(async function initI18n() {
    try {
        await i18n.loadTranslations(i18n.getCurrentLanguage());
        i18n.updateUI();

        const langToggle = document.getElementById('lang-toggle');
        const langMenu = document.getElementById('lang-menu');
        const langOptions = document.querySelectorAll('.lang-option');

        document.querySelector(`[data-lang="${i18n.getCurrentLanguage()}"]`)?.classList.add('active');

        langToggle?.addEventListener('click', () => langMenu.classList.toggle('hidden'));

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) langMenu?.classList.add('hidden');
        });

        langOptions.forEach(opt => {
            opt.addEventListener('click', async () => {
                await i18n.setLanguage(opt.getAttribute('data-lang'));
                langOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                langMenu.classList.add('hidden');
            });
        });
    } catch (e) {
        console.warn('i18n init failed:', e);
    }

    new DevQuizApp();

    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 300);
    }
})();
