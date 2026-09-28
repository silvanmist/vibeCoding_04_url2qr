# [개발 완료 보고서] 04 - QR코드 생성 및 다운로드 웹 서비스

## 1. 개요
* **프로젝트명**: QR Code Studio (실시간 QR코드 생성 & 고해상도 JPG 다운로드 웹 애플리케이션)
* **작업 경로**: `04/`
* **개발 스택**: 
  - **Structure**: Semantic HTML5
  - **Styling**: Vanilla CSS3 (Warm Light Theme, Interactive Radial & Linear Gradient, Glassmorphism, Micro-animations)
  - **Scripting**: Vanilla JavaScript (ES6+, 60fps RequestAnimationFrame Mouse Tracking)
  - **Library**: `qrcode.min.js` (오프라인 환경 완전 지원)

---

## 2. 요구사항 반영 및 주요 구현 기능

### 1) 로고 색상 분석 및 밝은 톤 테마(Warm Light Theme) 리뉴얼
* `img/logo.png`의 시그니처 컬러(골든 옐로우 `#FFC000`, 웜 앰버 `#F59E0B`)를 정밀 추출하여, 이와 조화롭게 어우러지는 화사하고 우아한 **소프트 크림 & 선샤인 골드 라이트 테마**를 완성했습니다.
* 칙칙함 없는 순백색 베이스 글래스모피즘(`rgba(255, 255, 255, 0.85)`), 림 라이트 보더, 부드러운 섀도우를 적용하여 고급스럽고 산뜻한 시각 경험을 제공합니다.

### 2) 마우스 커서 위치에 따른 동적 인터랙티브 그라데이션
* 마우스 포인터의 실시간 좌표(X, Y)를 감지하여 부드러운 60fps 보간(Lerp) 알고리즘으로 배경을 연출합니다:
  - **색조(Hue) 실시간 변화**: 마우스 위치에 따라 따뜻한 앰버 골드(36°)에서 화사한 레몬 옐로우(52°)로 은은하고 자연스럽게 변화합니다.
  - **각도(Angle) 동적 틸트**: 커서 방향에 따라 그라데이션 빛줄기의 각도(110° ~ 160°)가 유기적으로 회전합니다.
  - **커서 스팟라이트 글로우**: 마우스 커서를 은은하게 따라다니는 감각적인 블러 오라(`cursorGlow`)를 통해 살아 숨쉬는 인터랙션을 구현했습니다.

### 3) 상단 좌측 로고 & 중앙 심플 입력 인터페이스
* 상단 좌측에 `img/logo.png` 로고가 자연스럽게 조화되도록 헤더에 화이트 글래스 블러와 골든 액센트를 부여했습니다.
* 화면 중앙에는 집중도 높은 심플한 입력창이 위치하며, `Enter` 키 입력 및 실시간 내용 지우기(`✕`)를 지원합니다.

### 4) 입력창 하단 이동 & 정중앙 QR코드 생성 애니메이션
* URL을 입력하고 **[확인]**을 누르면:
  - 입력창이 화면 하단으로 부드러운 `cubic-bezier` 곡선을 그리며 컨트롤 바로 슬라이드 다운됩니다.
  - 동시에 화면 정중앙에 고해상도 QR코드 카드가 스케일 업(`scale-in`)되며 화사하게 등장합니다.

### 5) QR코드 클릭 시 고품질 JPG 파일 다운로드
* 중앙 QR코드 영역에 마우스를 올리면 **"클릭하여 JPG 다운로드 📥"** 툴팁 오버레이가 나타납니다.
* QR코드를 클릭하면 순백색 패딩 배경을 포함한 고화질 캔버스를 통해 **`.jpg` 파일로 즉시 다운로드**됩니다.
* 다운로드 완료 시 경쾌한 햅틱 바운스 애니메이션과 함께 화면 우측 상단에 완료 토스트 알림이 표시됩니다.

---

## 3. 파일 구성

| 파일명 | 역할 및 설명 |
| :--- | :--- |
| [`04/index.html`](file:///c:/Users/ADMIN/Desktop/바이브코딩/04/index.html) | 인터랙티브 배경 레이어 및 시맨틱 구조 마크업 |
| [`04/style.css`](file:///c:/Users/ADMIN/Desktop/바이브코딩/04/style.css) | 로고 맞춤 웜 라이트 테마, 동적 그라데이션 및 글래스모피즘 스타일 |
| [`04/app.js`](file:///c:/Users/ADMIN/Desktop/바이브코딩/04/app.js) | 마우스 추적 그라데이션 실시간 연산, QR 생성, JPG 다운로드 로직 |
| [`04/img/logo.png`](file:///c:/Users/ADMIN/Desktop/바이브코딩/04/img/logo.png) | 상단 좌측 로고 이미지 원본 파일 |
| [`04/qrcode.min.js`](file:///c:/Users/ADMIN/Desktop/바이브코딩/04/qrcode.min.js) | 완전 오프라인 지원 QR 생성 엔진 라이브러리 |
| [`04/server.ps1`](file:///c:/Users/ADMIN/Desktop/바이브코딩/04/server.ps1) | 로컬 테스트용 경량 파워쉘 HTTP 웹 서버 (포트 8084) |
| [`04/IMPLEMENTATION_PLAN.md`](file:///c:/Users/ADMIN/Desktop/바이브코딩/04/IMPLEMENTATION_PLAN.md) | 상세 기획 및 태스크 체크리스트 문서 |
| [`04/REPORT.md`](file:///c:/Users/ADMIN/Desktop/바이브코딩/04/REPORT.md) | 본 프로젝트 개발 완료 보고서 |

---

## 4. 확인 방법
* 실행 중인 Chrome 브라우저에서 `F5` 또는 새로고침을 누르시면 마우스 커서에 반응하는 밝은 톤의 사이트를 바로 확인하실 수 있습니다.
* 새로운 탭이나 창으로 열고 싶으실 경우 `Start-Process "chrome.exe" "c:\Users\ADMIN\Desktop\바이브코딩\04\index.html"`을 통해 확인 가능합니다.
