// 개발자 퀴즈 데이터
const quizData = [
    // JavaScript 카테고리
    {
        category: "javascript",
        difficulty: "easy",
        question: "JavaScript에서 변수를 선언할 때 사용하지 않는 키워드는?",
        options: ["let", "const", "var", "int"],
        answer: 3,
        explanation: "JavaScript에서는 let, const, var를 사용하여 변수를 선언합니다. int는 Java나 C 같은 언어에서 사용하는 키워드입니다."
    },
    {
        category: "javascript",
        difficulty: "easy",
        question: "console.log(typeof null)의 출력값은?",
        code: "console.log(typeof null);",
        options: ["null", "undefined", "object", "boolean"],
        answer: 2,
        explanation: "JavaScript의 오래된 버그로, typeof null은 'object'를 반환합니다. 이는 초기 JavaScript 구현의 실수이며 하위 호환성을 위해 유지되고 있습니다."
    },
    {
        category: "javascript",
        difficulty: "normal",
        question: "다음 코드의 출력값은?",
        code: "console.log([] == ![]);",
        options: ["true", "false", "undefined", "Error"],
        answer: 0,
        explanation: "![]는 false로 평가됩니다. [] == false에서 []는 빈 문자열 ''로, false는 0으로 변환되어 '' == 0이 됩니다. ''도 0으로 변환되어 0 == 0이므로 true입니다."
    },
    {
        category: "javascript",
        difficulty: "normal",
        question: "Promise.all()은 언제 reject되나요?",
        options: [
            "모든 Promise가 reject될 때",
            "하나라도 reject될 때",
            "마지막 Promise가 reject될 때",
            "절대 reject되지 않음"
        ],
        answer: 1,
        explanation: "Promise.all()은 전달된 Promise 중 하나라도 reject되면 즉시 reject됩니다. 모든 Promise가 성공해야 resolve됩니다."
    },
    {
        category: "javascript",
        difficulty: "hard",
        question: "다음 코드의 출력 순서는?",
        code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
        options: ["1, 2, 3, 4", "1, 4, 3, 2", "1, 4, 2, 3", "1, 3, 4, 2"],
        answer: 1,
        explanation: "동기 코드(1, 4)가 먼저 실행되고, 마이크로태스크 큐의 Promise(3)가 매크로태스크 큐의 setTimeout(2)보다 먼저 실행됩니다."
    },
    {
        category: "javascript",
        difficulty: "hard",
        question: "JavaScript의 클로저(Closure)란?",
        options: [
            "함수를 종료하는 명령어",
            "외부 함수의 변수에 접근할 수 있는 내부 함수",
            "객체를 복사하는 방법",
            "배열을 닫는 괄호"
        ],
        answer: 1,
        explanation: "클로저는 함수가 선언될 때의 렉시컬 환경을 기억하여, 함수가 외부 스코프의 변수에 접근할 수 있게 해주는 기능입니다."
    },
    {
        category: "javascript",
        difficulty: "normal",
        question: "ES6에서 도입된 화살표 함수의 특징이 아닌 것은?",
        options: [
            "자체 this를 갖지 않음",
            "arguments 객체를 갖지 않음",
            "생성자로 사용 가능",
            "더 짧은 문법"
        ],
        answer: 2,
        explanation: "화살표 함수는 생성자로 사용할 수 없습니다. new 키워드와 함께 호출하면 TypeError가 발생합니다."
    },

    // Python 카테고리
    {
        category: "python",
        difficulty: "easy",
        question: "Python에서 리스트의 마지막 요소에 접근하는 방법은?",
        options: ["list[0]", "list[-1]", "list.last()", "list.end()"],
        answer: 1,
        explanation: "Python에서 음수 인덱스를 사용하면 뒤에서부터 접근합니다. -1은 마지막 요소를 의미합니다."
    },
    {
        category: "python",
        difficulty: "easy",
        question: "Python에서 문자열을 반복하는 올바른 방법은?",
        code: "for char in 'hello':\n    print(char)",
        options: [
            "문자 하나씩 출력",
            "전체 문자열을 5번 출력",
            "에러 발생",
            "아무것도 출력되지 않음"
        ],
        answer: 0,
        explanation: "Python의 문자열은 iterable이므로 for 루프로 각 문자에 순차적으로 접근할 수 있습니다."
    },
    {
        category: "python",
        difficulty: "normal",
        question: "Python의 리스트 컴프리헨션 결과는?",
        code: "[x**2 for x in range(5) if x % 2 == 0]",
        options: ["[0, 4, 16]", "[0, 1, 4, 9, 16]", "[1, 9]", "[0, 2, 4]"],
        answer: 0,
        explanation: "range(5)는 0~4, if x % 2 == 0은 짝수만 필터링(0, 2, 4), x**2로 제곱하면 [0, 4, 16]입니다."
    },
    {
        category: "python",
        difficulty: "normal",
        question: "Python에서 *args와 **kwargs의 차이점은?",
        options: [
            "*args는 키워드, **kwargs는 위치 인자",
            "*args는 위치 인자, **kwargs는 키워드 인자",
            "둘 다 동일함",
            "*args는 필수, **kwargs는 선택"
        ],
        answer: 1,
        explanation: "*args는 임의의 개수의 위치 인자를 튜플로 받고, **kwargs는 임의의 개수의 키워드 인자를 딕셔너리로 받습니다."
    },
    {
        category: "python",
        difficulty: "hard",
        question: "Python의 GIL(Global Interpreter Lock)에 대한 설명으로 옳은 것은?",
        options: [
            "멀티스레딩을 완전히 불가능하게 함",
            "한 번에 하나의 스레드만 Python 바이트코드 실행",
            "I/O 작업도 차단함",
            "멀티프로세싱에도 적용됨"
        ],
        answer: 1,
        explanation: "GIL은 한 번에 하나의 스레드만 Python 바이트코드를 실행할 수 있게 합니다. I/O 작업 시에는 GIL이 해제되며, 멀티프로세싱은 GIL의 영향을 받지 않습니다."
    },
    {
        category: "python",
        difficulty: "hard",
        question: "다음 코드의 출력값은?",
        code: "def f(a, L=[]):\n    L.append(a)\n    return L\n\nprint(f(1))\nprint(f(2))",
        options: ["[1] [2]", "[1] [1, 2]", "[1, 2] [1, 2]", "Error"],
        answer: 1,
        explanation: "Python에서 기본 인자는 함수 정의 시 한 번만 평가됩니다. 가변 객체(리스트)를 기본 인자로 사용하면 같은 객체가 공유되어 [1], [1, 2]가 출력됩니다."
    },

    // 웹개발 카테고리
    {
        category: "web",
        difficulty: "easy",
        question: "HTML에서 외부 CSS 파일을 연결할 때 사용하는 태그는?",
        options: ["<style>", "<css>", "<link>", "<script>"],
        answer: 2,
        explanation: "<link rel='stylesheet' href='style.css'>와 같이 <link> 태그를 사용하여 외부 CSS 파일을 연결합니다."
    },
    {
        category: "web",
        difficulty: "easy",
        question: "CSS에서 display: flex를 사용했을 때 기본 방향은?",
        options: ["column", "row", "row-reverse", "column-reverse"],
        answer: 1,
        explanation: "Flexbox의 기본 flex-direction은 row로, 자식 요소들이 가로 방향으로 배치됩니다."
    },
    {
        category: "web",
        difficulty: "normal",
        question: "HTTP 상태 코드 404의 의미는?",
        options: [
            "서버 오류",
            "리소스를 찾을 수 없음",
            "권한 없음",
            "리다이렉트"
        ],
        answer: 1,
        explanation: "404 Not Found는 요청한 리소스를 서버에서 찾을 수 없음을 의미합니다. 가장 흔히 접하는 에러 코드입니다."
    },
    {
        category: "web",
        difficulty: "normal",
        question: "CORS(Cross-Origin Resource Sharing)의 목적은?",
        options: [
            "서버 성능 향상",
            "다른 출처 간의 리소스 공유 제어",
            "데이터 압축",
            "캐싱 관리"
        ],
        answer: 1,
        explanation: "CORS는 브라우저의 보안 정책으로, 다른 출처(도메인, 프로토콜, 포트)의 리소스 요청을 제어합니다."
    },
    {
        category: "web",
        difficulty: "hard",
        question: "CSR(Client-Side Rendering)과 SSR(Server-Side Rendering)의 차이점은?",
        options: [
            "CSR이 SEO에 더 유리함",
            "SSR은 서버에서 HTML을 생성하여 전송",
            "CSR은 초기 로딩이 더 빠름",
            "SSR은 JavaScript가 필요 없음"
        ],
        answer: 1,
        explanation: "SSR은 서버에서 완성된 HTML을 생성하여 전송하므로 초기 로딩이 빠르고 SEO에 유리합니다. CSR은 브라우저에서 JavaScript로 렌더링합니다."
    },
    {
        category: "web",
        difficulty: "hard",
        question: "PWA(Progressive Web App)의 필수 구성 요소가 아닌 것은?",
        options: [
            "Service Worker",
            "Web App Manifest",
            "HTTPS",
            "WebSocket"
        ],
        answer: 3,
        explanation: "PWA는 Service Worker, Web App Manifest, HTTPS가 필수입니다. WebSocket은 실시간 통신을 위한 것으로 PWA 필수 요소가 아닙니다."
    },

    // DB/SQL 카테고리
    {
        category: "database",
        difficulty: "easy",
        question: "SQL에서 모든 열을 선택할 때 사용하는 문자는?",
        options: ["@", "*", "#", "&"],
        answer: 1,
        explanation: "SELECT * FROM table은 해당 테이블의 모든 열을 선택합니다. *는 '모든 것'을 의미합니다."
    },
    {
        category: "database",
        difficulty: "easy",
        question: "PRIMARY KEY의 특징이 아닌 것은?",
        options: [
            "유일한 값이어야 함",
            "NULL을 허용함",
            "테이블당 하나만 존재",
            "자동으로 인덱스 생성"
        ],
        answer: 1,
        explanation: "PRIMARY KEY는 유일성(UNIQUE)과 NOT NULL 제약조건을 가집니다. NULL 값을 허용하지 않습니다."
    },
    {
        category: "database",
        difficulty: "normal",
        question: "INNER JOIN과 LEFT JOIN의 차이점은?",
        options: [
            "INNER JOIN은 더 빠름",
            "LEFT JOIN은 왼쪽 테이블의 모든 행을 포함",
            "INNER JOIN은 더 많은 결과를 반환",
            "차이가 없음"
        ],
        answer: 1,
        explanation: "LEFT JOIN은 왼쪽 테이블의 모든 행을 포함하고, 매칭되지 않는 오른쪽 열은 NULL로 채웁니다. INNER JOIN은 양쪽 테이블에서 매칭되는 행만 반환합니다."
    },
    {
        category: "database",
        difficulty: "normal",
        question: "NoSQL 데이터베이스의 특징이 아닌 것은?",
        options: [
            "스키마가 유연함",
            "수평적 확장이 용이함",
            "ACID 트랜잭션을 항상 보장함",
            "비정형 데이터 처리에 적합"
        ],
        answer: 2,
        explanation: "대부분의 NoSQL 데이터베이스는 완전한 ACID 트랜잭션을 보장하지 않고, 대신 BASE(Basically Available, Soft state, Eventually consistent) 모델을 따릅니다."
    },
    {
        category: "database",
        difficulty: "hard",
        question: "데이터베이스 정규화의 목적이 아닌 것은?",
        options: [
            "데이터 중복 제거",
            "데이터 무결성 향상",
            "쿼리 성능 향상",
            "이상 현상 방지"
        ],
        answer: 2,
        explanation: "정규화는 데이터 중복 제거, 무결성 향상, 이상 현상 방지가 목적입니다. 오히려 정규화로 인해 JOIN이 많아져 쿼리 성능이 저하될 수 있습니다."
    },

    // CS 기초 카테고리
    {
        category: "cs",
        difficulty: "easy",
        question: "Big O 표기법에서 O(1)의 의미는?",
        options: [
            "선형 시간",
            "상수 시간",
            "로그 시간",
            "이차 시간"
        ],
        answer: 1,
        explanation: "O(1)은 상수 시간 복잡도로, 입력 크기와 관계없이 일정한 시간이 걸림을 의미합니다."
    },
    {
        category: "cs",
        difficulty: "easy",
        question: "스택(Stack)의 동작 원리는?",
        options: ["FIFO", "LIFO", "Random", "Priority"],
        answer: 1,
        explanation: "스택은 LIFO(Last In, First Out) 원리로 동작합니다. 마지막에 들어간 요소가 먼저 나옵니다."
    },
    {
        category: "cs",
        difficulty: "normal",
        question: "이진 탐색(Binary Search)의 시간 복잡도는?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        answer: 1,
        explanation: "이진 탐색은 매 단계마다 탐색 범위를 절반으로 줄이므로 O(log n)의 시간 복잡도를 가집니다."
    },
    {
        category: "cs",
        difficulty: "normal",
        question: "해시 테이블에서 충돌(Collision)을 해결하는 방법이 아닌 것은?",
        options: [
            "체이닝",
            "오픈 어드레싱",
            "이중 해싱",
            "버블 정렬"
        ],
        answer: 3,
        explanation: "버블 정렬은 정렬 알고리즘입니다. 해시 충돌 해결 방법으로는 체이닝, 오픈 어드레싱, 이중 해싱 등이 있습니다."
    },
    {
        category: "cs",
        difficulty: "hard",
        question: "TCP와 UDP의 차이점으로 옳은 것은?",
        options: [
            "UDP는 연결 지향적",
            "TCP는 순서를 보장하지 않음",
            "UDP는 더 빠르지만 신뢰성이 낮음",
            "TCP는 브로드캐스트 지원"
        ],
        answer: 2,
        explanation: "UDP는 비연결형으로 헤더가 작고 빠르지만 신뢰성이 낮습니다. TCP는 연결 지향적이며 순서와 신뢰성을 보장합니다."
    },
    {
        category: "cs",
        difficulty: "hard",
        question: "동적 프로그래밍(Dynamic Programming)의 핵심 원리는?",
        options: [
            "분할 정복",
            "메모이제이션",
            "그리디",
            "백트래킹"
        ],
        answer: 1,
        explanation: "동적 프로그래밍의 핵심은 메모이제이션으로, 이미 계산한 결과를 저장하여 중복 계산을 피합니다. 최적 부분 구조와 중복되는 부분 문제가 특징입니다."
    },

    // Git 카테고리
    {
        category: "git",
        difficulty: "easy",
        question: "Git에서 파일을 스테이징 영역에 추가하는 명령어는?",
        options: ["git commit", "git add", "git push", "git stage"],
        answer: 1,
        explanation: "git add는 파일을 스테이징 영역(인덱스)에 추가합니다. 이후 git commit으로 커밋합니다."
    },
    {
        category: "git",
        difficulty: "easy",
        question: "Git에서 원격 저장소의 변경사항을 로컬로 가져오는 명령어는?",
        options: ["git push", "git pull", "git fetch", "git clone"],
        answer: 1,
        explanation: "git pull은 원격 저장소의 변경사항을 가져와(fetch) 현재 브랜치에 병합(merge)합니다. git fetch는 가져오기만 합니다."
    },
    {
        category: "git",
        difficulty: "normal",
        question: "git rebase와 git merge의 차이점은?",
        options: [
            "rebase는 더 빠름",
            "rebase는 커밋 히스토리를 선형으로 유지",
            "merge는 충돌이 발생하지 않음",
            "둘은 동일한 결과를 만듦"
        ],
        answer: 1,
        explanation: "rebase는 브랜치의 베이스를 이동시켜 선형적인 히스토리를 만듭니다. merge는 병합 커밋을 생성하여 히스토리가 분기됩니다."
    },
    {
        category: "git",
        difficulty: "normal",
        question: "git stash의 용도는?",
        options: [
            "커밋 삭제",
            "변경사항 임시 저장",
            "브랜치 생성",
            "원격 저장소 연결"
        ],
        answer: 1,
        explanation: "git stash는 작업 중인 변경사항을 임시로 저장하고 워킹 디렉토리를 깨끗한 상태로 되돌립니다. 나중에 git stash pop으로 복원할 수 있습니다."
    },
    {
        category: "git",
        difficulty: "hard",
        question: "git cherry-pick의 기능은?",
        options: [
            "특정 커밋만 다른 브랜치에 적용",
            "브랜치 삭제",
            "충돌 해결",
            "태그 생성"
        ],
        answer: 0,
        explanation: "git cherry-pick은 특정 커밋의 변경사항만 현재 브랜치에 적용합니다. 다른 브랜치의 특정 수정사항만 가져올 때 유용합니다."
    },

    // DevOps 카테고리
    {
        category: "devops",
        difficulty: "easy",
        question: "Docker에서 이미지와 컨테이너의 관계는?",
        options: [
            "동일한 개념",
            "이미지는 컨테이너의 실행 인스턴스",
            "컨테이너는 이미지의 실행 인스턴스",
            "서로 관련 없음"
        ],
        answer: 2,
        explanation: "이미지는 애플리케이션의 템플릿(설계도)이고, 컨테이너는 그 이미지를 기반으로 실행되는 인스턴스입니다. 하나의 이미지로 여러 컨테이너를 실행할 수 있습니다."
    },
    {
        category: "devops",
        difficulty: "easy",
        question: "CI/CD에서 CI의 의미는?",
        options: [
            "Container Integration",
            "Continuous Integration",
            "Cloud Infrastructure",
            "Code Inspection"
        ],
        answer: 1,
        explanation: "CI는 Continuous Integration(지속적 통합)으로, 개발자들이 코드 변경사항을 자주 메인 브랜치에 통합하고 자동으로 빌드/테스트하는 것을 의미합니다."
    },
    {
        category: "devops",
        difficulty: "normal",
        question: "Kubernetes에서 Pod의 역할은?",
        options: [
            "네트워크 관리",
            "하나 이상의 컨테이너를 포함하는 최소 배포 단위",
            "스토리지 관리",
            "로그 수집"
        ],
        answer: 1,
        explanation: "Pod는 Kubernetes에서 하나 이상의 컨테이너를 포함하는 가장 작은 배포 가능한 단위입니다. Pod 내의 컨테이너들은 네트워크와 스토리지를 공유합니다."
    },
    {
        category: "devops",
        difficulty: "normal",
        question: "마이크로서비스 아키텍처의 장점이 아닌 것은?",
        options: [
            "독립적 배포 가능",
            "기술 스택 다양화",
            "초기 개발 복잡도 감소",
            "확장성 향상"
        ],
        answer: 2,
        explanation: "마이크로서비스는 초기 개발 복잡도가 높습니다. 서비스 간 통신, 데이터 일관성 관리 등 추가적인 복잡성이 발생합니다."
    },
    {
        category: "devops",
        difficulty: "hard",
        question: "Infrastructure as Code(IaC)의 장점이 아닌 것은?",
        options: [
            "버전 관리 가능",
            "재현 가능한 인프라",
            "수동 작업 증가",
            "자동화된 배포"
        ],
        answer: 2,
        explanation: "IaC의 핵심은 수동 작업을 줄이고 자동화하는 것입니다. 코드로 인프라를 정의하여 버전 관리, 재현성, 자동화된 배포가 가능해집니다."
    },
    {
        category: "devops",
        difficulty: "hard",
        question: "Blue-Green 배포 전략의 특징은?",
        options: [
            "점진적으로 트래픽 전환",
            "두 개의 동일한 환경을 유지하며 즉시 전환",
            "특정 사용자에게만 새 버전 배포",
            "오류 발생 시 자동 롤백 불가"
        ],
        answer: 1,
        explanation: "Blue-Green 배포는 두 개의 동일한 프로덕션 환경(Blue, Green)을 유지하고, 새 버전을 Green에 배포한 후 트래픽을 즉시 전환합니다. 문제 시 빠르게 롤백이 가능합니다."
    }
];
