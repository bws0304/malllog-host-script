// AIeoding - 1분 쇼호스트 대본 생성기
// Main Application JavaScript

class AIeodingApp {
    constructor() {
        this.currentUser = null;
        this.currentProduct = null;
        this.currentParsedData = null;
        this.currentView = 'generator';
        
        // TTS properties
        this.tts = {
            synth: window.speechSynthesis,
            utterance: null,
            isPlaying: false,
            isPaused: false,
            voices: [],
            currentScript: '',
            currentScriptType: 'one-host'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initTTS();
        this.loadMockUser(); // 임시로 목업 사용자 로드
        this.loadMockLibraryData();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('nav-generator').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('generator');
        });
        
        document.getElementById('nav-library').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('library');
        });

        // URL Parsing
        document.getElementById('parse-btn').addEventListener('click', () => {
            this.parseURL();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.showResetModal();
        });

        // Script Type Change
        document.querySelectorAll('input[name="script-type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleScriptTypeChange(e.target.value);
            });
        });

        // Generate Script
        document.getElementById('generate-script-btn').addEventListener('click', () => {
            this.generateScript();
        });

        // Tab Switching
        document.getElementById('tab-one-host').addEventListener('click', () => {
            this.switchScriptTab('one-host');
        });
        
        document.getElementById('tab-two-host').addEventListener('click', () => {
            this.switchScriptTab('two-host');
        });

        // Modal Handlers
        document.getElementById('edit-fields-btn').addEventListener('click', () => {
            this.showEditFieldsModal();
        });

        document.getElementById('close-edit-modal').addEventListener('click', () => {
            this.hideEditFieldsModal();
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.hideEditFieldsModal();
        });

        document.getElementById('save-edit').addEventListener('click', () => {
            this.saveEditedFields();
        });

        // Reset Modal
        document.getElementById('cancel-reset').addEventListener('click', () => {
            this.hideResetModal();
        });

        document.getElementById('confirm-reset').addEventListener('click', () => {
            this.confirmReset();
        });

        // Library Search & Filter
        document.getElementById('library-search').addEventListener('input', (e) => {
            this.filterLibraryData(e.target.value);
        });

        document.getElementById('library-filter').addEventListener('change', (e) => {
            this.filterLibraryData();
        });

        // Copy & Download buttons
        this.setupCopyAndDownloadButtons();
        
        // TTS Controls
        this.setupTTSEventListeners();
    }

    // 임시 목업 사용자 로드
    loadMockUser() {
        this.currentUser = {
            id: 'user-001',
            email: 'user@example.com',
            display_name: '김여행',
            photo_url: 'https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=김',
            provider: 'google',
            role: 'owner',
            created_at: new Date().toISOString()
        };
        
        this.updateUserUI();
    }

    updateUserUI() {
        if (this.currentUser) {
            document.getElementById('google-login-btn').classList.add('hidden');
            document.getElementById('user-profile').classList.remove('hidden');
            document.getElementById('user-name').textContent = this.currentUser.display_name;
            document.getElementById('user-avatar').src = this.currentUser.photo_url;
        }
    }

    switchView(viewName) {
        this.currentView = viewName;
        
        // Update navigation
        document.getElementById('nav-generator').classList.remove('text-blue-600', 'font-medium', 'border-b-2', 'border-blue-600');
        document.getElementById('nav-generator').classList.add('text-gray-500', 'hover:text-gray-700');
        
        document.getElementById('nav-library').classList.remove('text-blue-600', 'font-medium', 'border-b-2', 'border-blue-600');
        document.getElementById('nav-library').classList.add('text-gray-500', 'hover:text-gray-700');
        
        // Show/hide views
        document.getElementById('generator-view').classList.add('hidden');
        document.getElementById('library-view').classList.add('hidden');
        
        if (viewName === 'generator') {
            document.getElementById('generator-view').classList.remove('hidden');
            document.getElementById('nav-generator').classList.remove('text-gray-500', 'hover:text-gray-700');
            document.getElementById('nav-generator').classList.add('text-blue-600', 'font-medium', 'border-b-2', 'border-blue-600');
        } else if (viewName === 'library') {
            document.getElementById('library-view').classList.remove('hidden');
            document.getElementById('nav-library').classList.remove('text-gray-500', 'hover:text-gray-700');
            document.getElementById('nav-library').classList.add('text-blue-600', 'font-medium', 'border-b-2', 'border-blue-600');
            this.loadLibraryData();
        }
    }

    async parseURL() {
        const urlInput = document.getElementById('url-input');
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('URL을 입력해주세요.');
            return;
        }

        // Show loading state
        document.getElementById('parsing-empty').classList.add('hidden');
        document.getElementById('parsing-results').classList.add('hidden');
        document.getElementById('parsing-loading').classList.remove('hidden');

        // 실제 환경에서는 여기서 API 호출
        // 목업 데이터로 시뮬레이션
        setTimeout(() => {
            this.simulateParsing(url);
        }, 2000);
    }

    simulateParsing(url) {
        // 목업 파싱 결과 생성
        this.currentParsedData = {
            product_name: "베트남 다낭 4박5일 골프 패키지",
            destination: "베트남 다낭",
            duration: "4박 5일",
            airline: "베트남항공",
            hotel: "풀먼 다낭 비치 리조트",
            golf_course: "다낭 골프클럽",
            rounds: "2라운드",
            meals: "조식 4회, 석식 2회",
            price: "1,890,000원",
            departure_dates: "2024년 3월 15일 ~ 4월 30일",
            includes: ["왕복항공료", "숙박비", "골프피", "조식", "공항세"],
            excludes: ["개인경비", "여행자보험", "선택관광"],
            perks: ["골프용품 렌탈 할인", "스파 20% 할인"],
            cautions: ["여권 유효기간 6개월 이상", "골프 핸디캡 증명서 필요"]
        };

        const confidence = 0.85;
        
        // Hide loading, show results
        document.getElementById('parsing-loading').classList.add('hidden');
        document.getElementById('parsing-results').classList.remove('hidden');
        
        // Update confidence score
        document.getElementById('confidence-score').textContent = Math.round(confidence * 100) + '%';
        document.getElementById('confidence-bar').style.width = Math.round(confidence * 100) + '%';
        
        // Populate parsed fields
        this.displayParsedFields();
        
        // Enable generate button
        document.getElementById('generate-script-btn').disabled = false;
        
        // Create mock product entry
        this.currentProduct = {
            id: 'product-' + Date.now(),
            source_url: url,
            parsed_fields: JSON.stringify(this.currentParsedData),
            parse_confidence: confidence,
            status: 'parsed',
            folder_id: null, // Will be created on script generation
            created_by: this.currentUser.id,
            created_at: new Date().toISOString()
        };
    }

    displayParsedFields() {
        const container = document.getElementById('parsed-fields');
        container.innerHTML = '';
        
        const fieldMappings = [
            { key: 'product_name', label: '상품명', icon: 'fas fa-tag' },
            { key: 'destination', label: '목적지', icon: 'fas fa-map-marker-alt' },
            { key: 'duration', label: '기간', icon: 'fas fa-calendar' },
            { key: 'airline', label: '항공사', icon: 'fas fa-plane' },
            { key: 'hotel', label: '숙박', icon: 'fas fa-hotel' },
            { key: 'golf_course', label: '골프장', icon: 'fas fa-golf-ball' },
            { key: 'rounds', label: '라운드', icon: 'fas fa-golf-ball' },
            { key: 'price', label: '가격', icon: 'fas fa-won-sign' }
        ];

        fieldMappings.forEach(field => {
            const value = this.currentParsedData[field.key];
            if (value) {
                const fieldElement = this.createParsedFieldElement(field.label, value, field.icon);
                container.appendChild(fieldElement);
            }
        });
    }

    createParsedFieldElement(label, value, icon) {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        
        div.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="${icon} text-blue-600"></i>
                <div>
                    <div class="text-sm font-medium text-gray-900">${label}</div>
                    <div class="text-sm text-gray-600">${value}</div>
                </div>
            </div>
            <div class="flex items-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i class="fas fa-check mr-1"></i>확인됨
                </span>
            </div>
        `;
        
        return div;
    }

    handleScriptTypeChange(type) {
        const hostNamesSection = document.getElementById('host-names-section');
        
        if (type === 'two_hosts') {
            hostNamesSection.classList.remove('hidden');
        } else {
            hostNamesSection.classList.add('hidden');
        }

        // Update tab visibility
        const twoHostTab = document.getElementById('tab-two-host');
        if (type === 'two_hosts') {
            twoHostTab.style.display = 'block';
        } else {
            twoHostTab.style.display = 'none';
            // Switch to one host tab if currently on two host
            if (document.getElementById('two-host-content').classList.contains('block')) {
                this.switchScriptTab('one-host');
            }
        }
    }

    async generateScript() {
        if (!this.currentParsedData) {
            alert('먼저 URL을 파싱해주세요.');
            return;
        }

        // Get options
        const scriptType = document.querySelector('input[name="script-type"]:checked').value;
        const tone = document.getElementById('tone-select').value;
        const target = document.getElementById('target-select').value;
        const duration = parseInt(document.getElementById('duration-select').value);
        
        const hostNames = {
            host1: document.getElementById('host1-name').value || '진행자1',
            host2: document.getElementById('host2-name').value || '진행자2'
        };

        // Show loading (실제로는 로딩 UI 추가)
        document.getElementById('generate-script-btn').disabled = true;
        document.getElementById('generate-script-btn').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>생성 중...';

        // 목업 대본 생성 (실제로는 AI API 호출)
        setTimeout(() => {
            this.createMockScript(scriptType, tone, target, duration, hostNames);
        }, 3000);
    }

    createMockScript(scriptType, tone, target, duration, hostNames) {
        // 1인 진행 대본
        const oneHostScript = this.generateOneHostScript();
        
        // 2인 진행 대본
        const twoHostScript = this.generateTwoHostScript(hostNames);
        
        // Create folder and save script
        this.createFolderAndSaveScript(scriptType, { oneHostScript, twoHostScript }, duration);
        
        // Show results
        document.getElementById('script-results-section').classList.remove('hidden');
        document.getElementById('one-host-script').textContent = oneHostScript;
        document.getElementById('two-host-script').textContent = twoHostScript;
        
        // Reset generate button
        document.getElementById('generate-script-btn').disabled = false;
        document.getElementById('generate-script-btn').innerHTML = '<i class="fas fa-magic mr-2"></i>대본 생성하기';
        
        // Auto-switch to appropriate tab
        if (scriptType === 'two_hosts') {
            this.switchScriptTab('two-host');
        } else {
            this.switchScriptTab('one-host');
        }

        // Scroll to results
        document.getElementById('script-results-section').scrollIntoView({ behavior: 'smooth' });
    }

    generateOneHostScript() {
        const data = this.currentParsedData;
        const tone = document.getElementById('tone-select').value;
        const target = document.getElementById('target-select').value;
        const hostStyle = document.getElementById('host-style-select').value;
        
        // Get shopping host style template
        return this.getShoppingHostTemplate(data, tone, target, hostStyle, 'one_host');
    }

    generateTwoHostScript(hostNames) {
        const data = this.currentParsedData;
        const tone = document.getElementById('tone-select').value;
        const target = document.getElementById('target-select').value;
        const hostStyle = document.getElementById('host-style-select').value;
        
        // Get shopping host style template
        return this.getShoppingHostTemplate(data, tone, target, hostStyle, 'two_hosts', hostNames);
    }

    getScriptTemplate(target, tone, style) {
        const templates = {
            golf: {
                friendly: {
                    one_host: {
                        intro: "안녕하세요! 오늘은 특별한 골프 여행을 소개해드릴게요.",
                        core: "{destination} {duration} 골프 패키지예요! {golf_course}에서 {rounds} 라운드를 마음껏 즐기실 수 있답니다.",
                        hotel: "숙박은 {hotel}에서 하시게 되고요, {meals} 포함되어서 정말 편리해요!",
                        flight: "{airline}으로 편안하게 이동하시고, {departure_dates} 중에서 원하시는 날짜로 출발하실 수 있어요.",
                        price: "이 모든 것이 {includes}까지 포함해서 단 {price}이에요!",
                        perks: "특별히 {perks} 혜택도 드리고 있어요. 다만 {cautions} 미리 확인해주세요!",
                        ending: "더 자세한 내용은 아래 링크에서 확인하실 수 있어요!"
                    },
                    two_hosts: {
                        intro: "{host1}: 안녕하세요! {host1}입니다.\n{host2}: {host2}예요! 오늘은 골프 여행 얘기해볼까요?",
                        core: "{host1}: {destination} 골프 여행이네요!\n{host2}: 네! {golf_course}에서 {rounds} 칠 수 있어요.",
                        hotel: "{host1}: 어디서 숙박하나요?\n{host2}: {hotel}이에요! {meals}도 포함되어 있어서 좋아요.",
                        flight: "{host1}: 항공편은 어떻게 되나요?\n{host2}: {airline}이고요, {departure_dates} 출발 가능해요!",
                        price: "{host1}: 가격이 궁금해요!\n{host2}: {includes} 다 포함해서 {price}예요!",
                        perks: "{host1}: 혜택도 있나요?\n{host2}: 당연히요! {perks} 드려요. 단, {cautions} 꼭 확인하세요!",
                        ending: "{host1}: 더 자세한 정보는\n{host2}: 아래 링크에서 확인하세요!"
                    }
                },
                trust: {
                    one_host: {
                        intro: "안녕하십니까. 오늘은 검증된 골프 여행 상품을 안내해드리겠습니다.",
                        core: "{destination} {duration} 골프 패키지입니다. {golf_course}에서 총 {rounds}를 플레이하실 수 있습니다.",
                        hotel: "숙박 시설은 {hotel}로 준비되어 있으며, {meals}이 제공됩니다.",
                        flight: "{airline}을 이용하시게 되며, {departure_dates} 기간 중 출발 가능합니다.",
                        price: "{includes} 모두 포함된 가격이 {price}입니다.",
                        perks: "{perks} 등의 부가 혜택이 제공되며, {cautions} 사전 준비가 필요합니다.",
                        ending: "상세한 내용은 하단의 링크를 통해 확인하시기 바랍니다."
                    },
                    two_hosts: {
                        intro: "{host1}: 안녕하십니까, {host1}입니다.\n{host2}: {host2}입니다. 검증된 골프 여행을 소개해드리겠습니다.",
                        core: "{host1}: {destination} 골프 패키지군요.\n{host2}: 맞습니다. {golf_course}에서 {rounds} 플레이 가능합니다.",
                        hotel: "{host1}: 숙박은 어떻게 되나요?\n{host2}: {hotel}이며 {meals} 제공됩니다.",
                        flight: "{host1}: 항공편 정보를 알려주세요.\n{host2}: {airline} 이용, {departure_dates} 출발 가능합니다.",
                        price: "{host1}: 패키지 가격은 얼마입니까?\n{host2}: {includes} 포함하여 {price}입니다.",
                        perks: "{host1}: 추가 혜택이 있나요?\n{host2}: {perks} 제공되며, {cautions} 필요합니다.",
                        ending: "{host1}: 자세한 정보는\n{host2}: 하단 링크에서 확인 가능합니다."
                    }
                },
                premium: {
                    one_host: {
                        intro: "프리미엄 골프 여행의 새로운 기준을 제시합니다.",
                        core: "{destination}의 럭셔리 {duration} 골프 익스피리언스. 명문 {golf_course}에서의 {rounds} 라운드가 기다립니다.",
                        hotel: "최고급 {hotel}에서의 특별한 휴식과 {meals}의 품격있는 다이닝을 경험하세요.",
                        flight: "프리미엄 {airline} 서비스로 편안한 여정을, {departure_dates} 중 귀하만의 일정으로.",
                        price: "{includes} 모든 것이 완벽하게 준비된 {price}의 프리미엄 패키지입니다.",
                        perks: "VIP만을 위한 {perks} 특전과 함께, {cautions} 사전 준비로 완벽한 여행을.",
                        ending: "럭셔리 골프 여행의 모든 것, 지금 확인하세요."
                    },
                    two_hosts: {
                        intro: "{host1}: 프리미엄 골프 여행, {host1}입니다.\n{host2}: {host2}와 함께 럭셔리 익스피리언스를 소개합니다.",
                        core: "{host1}: {destination} 프리미엄 골프군요.\n{host2}: 명문 {golf_course}에서의 {rounds}, 특별합니다.",
                        hotel: "{host1}: 숙박 시설은?\n{host2}: 최고급 {hotel}, {meals}까지 완벽합니다.",
                        flight: "{host1}: 항공 서비스는?\n{host2}: 프리미엄 {airline}, {departure_dates} 맞춤 출발.",
                        price: "{host1}: 투자 가치는?\n{host2}: {includes} 포함 {price}, 프리미엄의 가치입니다.",
                        perks: "{host1}: VIP 혜택은?\n{host2}: {perks} 특전, {cautions} 준비로 완벽하게.",
                        ending: "{host1}: 럭셔리 골프의 모든 것\n{host2}: 지금 바로 확인하세요."
                    }
                }
            },
            leisure: {
                // 휴양 여행 템플릿들...
                friendly: {
                    one_host: {
                        intro: "안녕하세요! 힐링이 필요한 분들을 위한 특별한 여행을 준비했어요.",
                        core: "{destination} {duration} 휴양 여행! {hotel}에서 완전한 힐링을 경험하세요.",
                        hotel: "숙박은 {hotel}에서 하시고, {meals}로 맛있는 식사까지!",
                        flight: "{airline}으로 편리하게! {departure_dates} 중에 출발하세요.",
                        price: "{includes} 모두 포함해서 {price}에 제공해드려요!",
                        perks: "특별히 {perks} 혜택도! {cautions} 확인해주세요.",
                        ending: "완벽한 힐링 여행, 지금 바로 확인하세요!"
                    },
                    two_hosts: {
                        intro: "{host1}: 안녕하세요! {host1}입니다.\n{host2}: {host2}예요! 힐링 여행 얘기해볼게요!",
                        core: "{host1}: {destination} 휴양이네요!\n{host2}: 네! {hotel}에서 완전 힐링해요!",
                        hotel: "{host1}: 어디서 쉬나요?\n{host2}: {hotel}이에요! {meals}도 맛있어요!",
                        flight: "{host1}: 어떻게 가나요?\n{host2}: {airline}으로 편하게! {departure_dates} 출발해요!",
                        price: "{host1}: 얼마예요?\n{host2}: {includes} 다 포함 {price}!",
                        perks: "{host1}: 혜택 있어요?\n{host2}: 당연히! {perks} 드려요! {cautions} 확인하세요!",
                        ending: "{host1}: 힐링 여행은\n{host2}: 지금 바로 확인하세요!"
                    }
                }
            },
            package: {
                // 패키지 여행 템플릿들...
                friendly: {
                    one_host: {
                        intro: "안녕하세요! 알찬 패키지 여행을 소개해드릴게요!",
                        core: "{destination} {duration} 패키지 투어! 모든 일정이 완벽하게 준비되어 있어요.",
                        hotel: "{hotel}에서 편안하게 쉬시고, {meals}까지 준비돼 있어서 걱정 없어요!",
                        flight: "{airline}으로 안전하고 편리하게! {departure_dates} 중 선택하세요.",
                        price: "{includes} 모든 것 포함해서 {price}! 정말 합리적이에요!",
                        perks: "특별 혜택 {perks}도 드리고, {cautions} 꼭 확인해주세요!",
                        ending: "완벽한 패키지 여행! 지금 바로 신청하세요!"
                    },
                    two_hosts: {
                        intro: "{host1}: 안녕하세요! {host1}입니다!\n{host2}: {host2}예요! 패키지 여행 소개해드릴게요!",
                        core: "{host1}: {destination} 패키지네요!\n{host2}: 맞아요! {duration} 동안 모든 게 준비되어 있어요!",
                        hotel: "{host1}: 숙박은 어떻게 되나요?\n{host2}: {hotel}에서 {meals}까지! 완벽해요!",
                        flight: "{host1}: 항공편은요?\n{host2}: {airline}으로 안전하게! {departure_dates} 출발이에요!",
                        price: "{host1}: 가격이 궁금해요!\n{host2}: {includes} 다 포함 {price}! 합리적이에요!",
                        perks: "{host1}: 혜택도 있나요?\n{host2}: 네! {perks} 드려요! {cautions} 체크하세요!",
                        ending: "{host1}: 완벽한 패키지는\n{host2}: 지금 바로 신청하세요!"
                    }
                }
            }
        };

        // 기본값 설정
        const selectedTemplate = templates[target] || templates.golf;
        const toneTemplate = selectedTemplate[tone] || selectedTemplate.friendly;
        return toneTemplate[style] || toneTemplate.one_host;
    }

    populateTemplate(template, data, hostNames = null) {
        const sections = [
            { time: "00:00-00:05", title: "인트로", content: template.intro },
            { time: "00:05-00:15", title: "상품 핵심", content: template.core },
            { time: "00:15-00:25", title: "숙박&편의", content: template.hotel },
            { time: "00:25-00:35", title: "항공&조건", content: template.flight },
            { time: "00:35-00:45", title: "포함&가격", content: template.price },
            { time: "00:45-00:55", title: "특전 및 유의", content: template.perks },
            { time: "00:55-01:00", title: "엔딩", content: template.ending }
        ];

        return sections.map(section => {
            let content = section.content;
            
            // 데이터 치환
            Object.entries(data).forEach(([key, value]) => {
                const placeholder = `{${key}}`;
                if (Array.isArray(value)) {
                    content = content.replace(placeholder, value.slice(0, 3).join(', '));
                } else {
                    content = content.replace(placeholder, value || '');
                }
            });

            // 호스트 이름 치환 (2인 진행용)
            if (hostNames) {
                content = content.replace(/{host1}/g, hostNames.host1 || '진행자1');
                content = content.replace(/{host2}/g, hostNames.host2 || '진행자2');
            }

            return `[${section.time}] ${section.title}\n${content}`;
        }).join('\n\n');
    }

    getShoppingHostTemplate(data, tone, target, hostStyle, scriptType, hostNames = null) {
        const templates = {
            passionate: { // 🔥 열정적 홈쇼핑 스타일
                one_host: {
                    intro: "여러분 안녕하세요! 와, 오늘 정말 놀라운 여행 상품 하나 가져왔어요!",
                    core: "지금 보고 계신 게 바로 {destination} {duration}! 어머 이건 진짜 대박이에요! {golf_course}에서 {rounds}를 치실 수 있다고요? 이 가격에?",
                    hotel: "그런데 여러분, 여기서 끝이 아니에요! 숙박은 어디냐구요? {hotel}이에요! 어머 이 호텔 얼마나 좋은지 아세요? {meals}까지 다 포함이라고요!",
                    flight: "항공편도 완전 럭셔리해요! {airline}으로 편안~하게 가시고요, {departure_dates} 중에 언제든지 출발하실 수 있어요! 이건 진짜 기회예요!",
                    price: "그런데 가격이 얼마일 것 같으세요? {includes} 이 모든 게 다 포함되어서... 어머 깜짝 놀라지 마세요... 단돈 {price}! 말도 안 되는 가격이죠?",
                    perks: "아직도 더 있어요! 특별 혜택으로 {perks} 이런 것도 다 드린다고요! 하지만 {cautions} 이건 꼭 미리 준비해주세요!",
                    ending: "여러분, 이런 기회는 정말 흔하지 않아요! 지금 바로 아래 링크 클릭하세요!"
                },
                two_hosts: {
                    intro: "{host1}: 여러분 안녕하세요! {host1}입니다!\n{host2}: {host2}예요! 오늘 진짜 대박 상품 가져왔어요!",
                    core: "{host1}: 와 {host2}씨, 이거 진짜 대단한데요?\n{host2}: 맞아요! {destination} {duration}인데, {golf_course}에서 {rounds}를 친다고요!",
                    hotel: "{host1}: 숙박은 어디서 하는 거예요?\n{host2}: 어머, {hotel}이에요! 이 호텔이 얼마나 좋은지! {meals}까지 다 포함이래요!",
                    flight: "{host1}: 항공편은 어떻게 되나요?\n{host2}: {airline}으로 완전 편안하게! {departure_dates} 중에 언제든 출발 가능해요!",
                    price: "{host1}: 가격이 궁금한데요?\n{host2}: 깜짝 놀라지 마세요! {includes} 다 포함해서 {price}! 말도 안 되죠?",
                    perks: "{host1}: 혜택도 더 있나요?\n{host2}: 당연하죠! {perks} 이런 것도 다 드려요! 단, {cautions} 이건 꼭 확인하세요!",
                    ending: "{host1}: 이런 기회는 정말 흔하지 않아요!\n{host2}: 지금 바로 아래 링크 클릭하세요!"
                }
            },
            friendly: { // 😊 친근한 라이브커머스 스타일
                one_host: {
                    intro: "안녕하세요 여러분~ 오늘도 좋은 여행 상품으로 찾아왔어요!",
                    core: "{destination} {duration} 어떠세요? 정말 좋지 않나요? {golf_course}에서 {rounds} 치면서 힐링하는 거예요!",
                    hotel: "숙박은 {hotel}에서 하시고요, {meals}도 맛있게 드실 수 있어요! 진짜 편하게 쉬다 오실 수 있어요~",
                    flight: "{airline}으로 안전하고 편리하게 가시면 되고요, {departure_dates} 중에 원하시는 날짜로 골라서 가세요!",
                    price: "그리고 가격도 정말 합리적이에요! {includes} 이런 것들 다 포함해서 {price}밖에 안 해요! 진짜 괜찮죠?",
                    perks: "특별히 {perks} 이런 혜택들도 드리고 있어요! 아, 그리고 {cautions} 이건 미리 체크해주세요!",
                    ending: "어떠세요? 마음에 드시죠? 그럼 바로 아래 링크에서 확인해보세요!"
                },
                two_hosts: {
                    intro: "{host1}: 안녕하세요~ {host1}이에요!\n{host2}: {host2}입니다! 오늘 정말 좋은 여행 상품 준비했어요!",
                    core: "{host1}: {destination} 여행 어때요?\n{host2}: 좋죠! {golf_course}에서 {rounds} 치면서 힐링하는 거예요!",
                    hotel: "{host1}: 어디서 숙박하나요?\n{host2}: {hotel}에서 하시고, {meals}도 맛있게 드실 수 있어요!",
                    flight: "{host1}: 항공편은 어떻게 되나요?\n{host2}: {airline}으로 편리하게! {departure_dates} 중에 골라서 가세요!",
                    price: "{host1}: 가격은 어떻게 되나요?\n{host2}: {includes} 다 포함해서 {price}! 정말 합리적이죠?",
                    perks: "{host1}: 다른 혜택도 있나요?\n{host2}: 네! {perks} 이런 것들도 드려요! {cautions} 이건 체크해주세요!",
                    ending: "{host1}: 어떠세요? 마음에 드시나요?\n{host2}: 그럼 바로 아래 링크에서 확인해보세요!"
                }
            },
            professional: { // 💼 전문적+재미있는 스타일
                one_host: {
                    intro: "안녕하세요! 여행 전문가가 엄선한 특별한 상품을 소개해드리겠습니다.",
                    core: "{destination} {duration} 프리미엄 패키지입니다. {golf_course}에서의 {rounds}, 이건 정말 특별한 경험이 될 거예요.",
                    hotel: "숙박 시설로는 {hotel}을 선정했습니다. {meals} 서비스와 함께 최상의 컴포트를 제공해드려요.",
                    flight: "항공편은 신뢰할 수 있는 {airline}을 이용하시고, {departure_dates} 기간 중 유연하게 출발 일정을 잡으실 수 있습니다.",
                    price: "이 모든 서비스, {includes}를 포함한 패키지 가격이 {price}입니다. 가성비 측면에서 정말 훌륭한 선택이죠.",
                    perks: "추가로 {perks} 등의 프리미엄 혜택도 준비했습니다. 다만 {cautions} 사전 준비사항은 꼭 확인해주세요.",
                    ending: "전문가가 추천하는 이 특별한 여행, 놓치지 마시고 지금 바로 확인해보세요!"
                },
                two_hosts: {
                    intro: "{host1}: 안녕하세요, 여행 전문가 {host1}입니다.\n{host2}: {host2}입니다. 오늘 정말 특별한 상품을 준비했어요.",
                    core: "{host1}: {destination} 패키지군요?\n{host2}: 네, {golf_course}에서의 {rounds}는 정말 프리미엄 경험이에요.",
                    hotel: "{host1}: 숙박은 어떻게 구성되나요?\n{host2}: {hotel}에서 {meals} 서비스와 함께 최상의 휴식을 제공합니다.",
                    flight: "{host1}: 항공편 정보도 알려주세요.\n{host2}: {airline} 이용으로 {departure_dates} 중 유연한 출발이 가능해요.",
                    price: "{host1}: 투자 가치는 어떻게 보시나요?\n{host2}: {includes} 포함 {price}, 가성비 면에서 정말 탁월합니다.",
                    perks: "{host1}: 추가 혜택도 있나요?\n{host2}: {perks} 등 프리미엄 혜택이 있고, {cautions} 사전 준비는 필수예요.",
                    ending: "{host1}: 전문가 추천 상품이군요.\n{host2}: 네, 지금 바로 확인해보시길 추천드려요!"
                }
            }
        };

        const selectedTemplate = templates[hostStyle] || templates.passionate;
        const styleTemplate = selectedTemplate[scriptType] || selectedTemplate.one_host;
        
        // 템플릿 섹션 구성
        const sections = [
            { time: "00:00-00:05", title: "인트로", content: styleTemplate.intro },
            { time: "00:05-00:15", title: "상품 핵심", content: styleTemplate.core },
            { time: "00:15-00:25", title: "숙박&편의", content: styleTemplate.hotel },
            { time: "00:25-00:35", title: "항공&조건", content: styleTemplate.flight },
            { time: "00:35-00:45", title: "포함&가격", content: styleTemplate.price },
            { time: "00:45-00:55", title: "특전 및 유의", content: styleTemplate.perks },
            { time: "00:55-01:00", title: "엔딩", content: styleTemplate.ending }
        ];

        return sections.map(section => {
            let content = section.content;
            
            // 데이터 치환
            Object.entries(data).forEach(([key, value]) => {
                const placeholder = `{${key}}`;
                if (Array.isArray(value)) {
                    content = content.replace(placeholder, value.slice(0, 3).join(', '));
                } else {
                    content = content.replace(placeholder, value || '');
                }
            });

            // 호스트 이름 치환 (2인 진행용)
            if (hostNames) {
                content = content.replace(/{host1}/g, hostNames.host1 || '진행자1');
                content = content.replace(/{host2}/g, hostNames.host2 || '진행자2');
            }

            return `[${section.time}] ${section.title}\n${content}`;
        }).join('\n\n');
    }

    async createFolderAndSaveScript(scriptType, scripts, duration) {
        // Create folder
        const folderName = this.currentParsedData.product_name;
        const folder = {
            id: 'folder-' + Date.now(),
            name: folderName,
            slug: this.createSlug(folderName),
            owner_user_id: this.currentUser.id,
            status: 'draft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Save folder (mock)
        try {
            await this.mockSaveFolder(folder);
            this.currentProduct.folder_id = folder.id;
            
            // Save product (mock)
            await this.mockSaveProduct(this.currentProduct);
            
            // Save scripts (mock)
            const scriptData = {
                id: 'script-' + Date.now(),
                product_id: this.currentProduct.id,
                style: scriptType,
                options: JSON.stringify({
                    tone: document.getElementById('tone-select').value,
                    target: document.getElementById('target-select').value,
                    duration: duration
                }),
                content: JSON.stringify(scripts),
                est_seconds: duration,
                created_by: this.currentUser.id,
                created_at: new Date().toISOString()
            };
            
            await this.mockSaveScript(scriptData);
            
            console.log('Script saved successfully:', scriptData);
            
        } catch (error) {
            console.error('Error saving script:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    }

    createSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9가-힣\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 64);
    }

    switchScriptTab(tabName) {
        // Update tab buttons
        document.getElementById('tab-one-host').classList.remove('border-blue-600', 'text-blue-600');
        document.getElementById('tab-one-host').classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700');
        
        document.getElementById('tab-two-host').classList.remove('border-blue-600', 'text-blue-600');
        document.getElementById('tab-two-host').classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700');

        // Hide all contents
        document.getElementById('one-host-content').classList.add('hidden');
        document.getElementById('two-host-content').classList.add('hidden');

        // Show selected content
        if (tabName === 'one-host') {
            document.getElementById('tab-one-host').classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700');
            document.getElementById('tab-one-host').classList.add('border-blue-600', 'text-blue-600');
            document.getElementById('one-host-content').classList.remove('hidden');
        } else if (tabName === 'two-host') {
            document.getElementById('tab-two-host').classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700');
            document.getElementById('tab-two-host').classList.add('border-blue-600', 'text-blue-600');
            document.getElementById('two-host-content').classList.remove('hidden');
        }
    }

    showEditFieldsModal() {
        if (!this.currentParsedData) return;
        
        const form = document.getElementById('edit-fields-form');
        form.innerHTML = '';
        
        Object.entries(this.currentParsedData).forEach(([key, value]) => {
            if (typeof value === 'string') {
                const fieldDiv = document.createElement('div');
                fieldDiv.innerHTML = `
                    <label class="block text-sm font-medium text-gray-700 mb-1">${this.getFieldLabel(key)}</label>
                    <input 
                        type="text" 
                        id="edit-${key}" 
                        value="${value}" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                `;
                form.appendChild(fieldDiv);
            }
        });
        
        document.getElementById('edit-fields-modal').classList.remove('hidden');
    }

    getFieldLabel(key) {
        const labels = {
            product_name: '상품명',
            destination: '목적지',
            duration: '기간',
            airline: '항공사',
            hotel: '숙박',
            golf_course: '골프장',
            rounds: '라운드',
            meals: '식사',
            price: '가격',
            departure_dates: '출발일'
        };
        return labels[key] || key;
    }

    hideEditFieldsModal() {
        document.getElementById('edit-fields-modal').classList.add('hidden');
    }

    saveEditedFields() {
        const form = document.getElementById('edit-fields-form');
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach(input => {
            const key = input.id.replace('edit-', '');
            this.currentParsedData[key] = input.value;
        });
        
        this.displayParsedFields();
        this.hideEditFieldsModal();
    }

    showResetModal() {
        document.getElementById('reset-modal').classList.remove('hidden');
    }

    hideResetModal() {
        document.getElementById('reset-modal').classList.add('hidden');
    }

    confirmReset() {
        // Reset all data
        this.currentProduct = null;
        this.currentParsedData = null;
        
        // Reset UI
        document.getElementById('url-input').value = '';
        document.getElementById('parsing-results').classList.add('hidden');
        document.getElementById('parsing-empty').classList.remove('hidden');
        document.getElementById('script-results-section').classList.add('hidden');
        document.getElementById('generate-script-btn').disabled = true;
        
        // Reset form
        document.querySelector('input[name="script-type"][value="one_host"]').checked = true;
        document.getElementById('tone-select').value = 'friendly';
        document.getElementById('target-select').value = 'golf';
        document.getElementById('duration-select').value = '60';
        document.getElementById('host1-name').value = '';
        document.getElementById('host2-name').value = '';
        document.getElementById('host-names-section').classList.add('hidden');
        
        this.hideResetModal();
        
        alert('데이터가 초기화되었습니다.');
    }

    setupCopyAndDownloadButtons() {
        // Copy buttons
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerHTML.includes('복사')) {
                btn.addEventListener('click', (e) => {
                    const content = e.target.closest('.space-y-6').querySelector('div[id$="-script"]').textContent;
                    navigator.clipboard.writeText(content).then(() => {
                        const originalText = e.target.innerHTML;
                        e.target.innerHTML = '<i class="fas fa-check mr-1"></i>복사됨';
                        setTimeout(() => {
                            e.target.innerHTML = originalText;
                        }, 2000);
                    });
                });
            }
            
            if (btn.innerHTML.includes('다운로드')) {
                btn.addEventListener('click', (e) => {
                    const content = e.target.closest('.space-y-6').querySelector('div[id$="-script"]').textContent;
                    const type = e.target.closest('.space-y-6').id.includes('one-host') ? '1인진행' : '2인진행';
                    const fileName = `${this.currentParsedData?.product_name || '대본'}_${type}.txt`;
                    
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    URL.revokeObjectURL(url);
                });
            }
        });
    }

    // Mock API functions
    async mockSaveFolder(folder) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In real app, this would call: POST /api/folders
        console.log('Saving folder:', folder);
        return folder;
    }

    async mockSaveProduct(product) {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('Saving product:', product);
        return product;
    }

    async mockSaveScript(script) {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('Saving script:', script);
        return script;
    }

    // Library functions
    loadMockLibraryData() {
        this.libraryData = [
            {
                id: 'folder-001',
                created_at: '2024-03-20',
                product_name: '태국 푸켓 3박4일 골프 패키지',
                author: '김여행',
                status: 'confirmed'
            },
            {
                id: 'folder-002', 
                created_at: '2024-03-18',
                product_name: '일본 오키나와 4박5일 리조트',
                author: '이여행',
                status: 'draft'
            },
            {
                id: 'folder-003',
                created_at: '2024-03-15',
                product_name: '베트남 다낭 5박6일 골프&휴양',
                author: '김여행',
                status: 'confirmed'
            }
        ];
    }

    loadLibraryData() {
        const tbody = document.getElementById('library-table-body');
        tbody.innerHTML = '';
        
        this.libraryData.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 cursor-pointer';
            
            const statusClass = item.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
            const statusText = item.status === 'confirmed' ? '확정' : '초안';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.created_at}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${item.product_name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.author}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3">보기</button>
                    <button class="text-gray-600 hover:text-gray-900">삭제</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    filterLibraryData(searchTerm = '') {
        const searchValue = searchTerm || document.getElementById('library-search').value.toLowerCase();
        const filterValue = document.getElementById('library-filter').value;
        
        let filteredData = this.libraryData.filter(item => {
            const matchesSearch = searchValue === '' || 
                item.product_name.toLowerCase().includes(searchValue) ||
                item.author.toLowerCase().includes(searchValue);
            
            const matchesFilter = filterValue === '' || item.status === filterValue;
            
            return matchesSearch && matchesFilter;
        });
        
        // Update table with filtered data
        const tbody = document.getElementById('library-table-body');
        tbody.innerHTML = '';
        
        filteredData.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 cursor-pointer';
            
            const statusClass = item.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
            const statusText = item.status === 'confirmed' ? '확정' : '초안';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.created_at}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${item.product_name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.author}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3">보기</button>
                    <button class="text-gray-600 hover:text-gray-900">삭제</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // TTS Methods
    initTTS() {
        // Load available voices
        if (this.tts.synth) {
            this.loadVoices();
            
            // Voice loading can be asynchronous
            if (this.tts.synth.onvoiceschanged !== undefined) {
                this.tts.synth.onvoiceschanged = () => {
                    this.loadVoices();
                };
            }
        }
    }

    loadVoices() {
        this.tts.voices = this.tts.synth.getVoices();
        const voiceSelect = document.getElementById('voice-select');
        
        if (voiceSelect && this.tts.voices.length > 0) {
            voiceSelect.innerHTML = '';
            
            // Filter Korean voices first, then others
            const koreanVoices = this.tts.voices.filter(voice => 
                voice.lang.includes('ko') || voice.name.includes('Korean')
            );
            const otherVoices = this.tts.voices.filter(voice => 
                !voice.lang.includes('ko') && !voice.name.includes('Korean')
            );
            
            // Add Korean voices
            if (koreanVoices.length > 0) {
                const koreanGroup = document.createElement('optgroup');
                koreanGroup.label = '한국어 음성';
                koreanVoices.forEach((voice, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    koreanGroup.appendChild(option);
                });
                voiceSelect.appendChild(koreanGroup);
            }
            
            // Add other voices
            if (otherVoices.length > 0) {
                const otherGroup = document.createElement('optgroup');
                otherGroup.label = '기타 음성';
                otherVoices.forEach((voice, index) => {
                    const option = document.createElement('option');
                    option.value = koreanVoices.length + index;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    otherGroup.appendChild(option);
                });
                voiceSelect.appendChild(otherGroup);
            }
            
            // Set default to first Korean voice or first available
            if (koreanVoices.length > 0) {
                voiceSelect.value = 0;
            } else if (this.tts.voices.length > 0) {
                voiceSelect.value = 0;
            }
        }
    }

    setupTTSEventListeners() {
        // Play buttons
        document.getElementById('play-one-host')?.addEventListener('click', () => {
            this.playScript('one-host');
        });
        
        document.getElementById('play-two-host')?.addEventListener('click', () => {
            this.playScript('two-host');
        });
        
        // Voice control panel
        document.getElementById('voice-play-pause')?.addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        document.getElementById('voice-stop')?.addEventListener('click', () => {
            this.stopSpeech();
        });
        
        document.getElementById('close-voice-control')?.addEventListener('click', () => {
            this.hideVoiceControl();
        });
        
        // Voice settings
        document.getElementById('voice-rate')?.addEventListener('input', (e) => {
            document.getElementById('rate-value').textContent = e.target.value + 'x';
        });
        
        document.getElementById('voice-pitch')?.addEventListener('input', (e) => {
            document.getElementById('pitch-value').textContent = parseFloat(e.target.value).toFixed(1);
        });
    }

    playScript(scriptType) {
        const scriptContent = scriptType === 'one-host' 
            ? document.getElementById('one-host-script').textContent
            : document.getElementById('two-host-script').textContent;
            
        if (!scriptContent.trim()) {
            alert('먼저 대본을 생성해주세요.');
            return;
        }
        
        this.tts.currentScript = this.cleanScriptForTTS(scriptContent);
        this.tts.currentScriptType = scriptType;
        
        this.showVoiceControl();
        this.startSpeech();
    }

    cleanScriptForTTS(script) {
        // Remove time codes and clean up text for better TTS
        return script
            .replace(/\[\d{2}:\d{2}-\d{2}:\d{2}\]\s*/g, '') // Remove time codes
            .replace(/진행자\d+:\s*/g, '') // Remove host labels
            .replace(/\n\n+/g, '\n') // Clean up multiple newlines
            .trim();
    }

    showVoiceControl() {
        document.getElementById('voice-control-panel').classList.remove('hidden');
        this.updateProgressDisplay();
    }

    hideVoiceControl() {
        document.getElementById('voice-control-panel').classList.add('hidden');
        this.stopSpeech();
    }

    startSpeech() {
        if (this.tts.synth.speaking) {
            this.tts.synth.cancel();
        }
        
        this.tts.utterance = new SpeechSynthesisUtterance(this.tts.currentScript);
        
        // Get current settings
        const voiceIndex = parseInt(document.getElementById('voice-select').value) || 0;
        const rate = parseFloat(document.getElementById('voice-rate').value) || 0.9;
        const pitch = parseFloat(document.getElementById('voice-pitch').value) || 1.0;
        
        // Apply settings
        if (this.tts.voices[voiceIndex]) {
            this.tts.utterance.voice = this.tts.voices[voiceIndex];
        }
        this.tts.utterance.rate = rate;
        this.tts.utterance.pitch = pitch;
        this.tts.utterance.volume = 1.0;
        
        // Event listeners
        this.tts.utterance.onstart = () => {
            this.tts.isPlaying = true;
            this.tts.isPaused = false;
            this.updatePlayButton(true);
            this.startProgressTracking();
        };
        
        this.tts.utterance.onend = () => {
            this.tts.isPlaying = false;
            this.tts.isPaused = false;
            this.updatePlayButton(false);
            this.resetProgress();
        };
        
        this.tts.utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.tts.isPlaying = false;
            this.tts.isPaused = false;
            this.updatePlayButton(false);
            alert('음성 재생 중 오류가 발생했습니다.');
        };
        
        // Start speaking
        this.tts.synth.speak(this.tts.utterance);
    }

    togglePlayPause() {
        if (!this.tts.synth.speaking && !this.tts.isPaused) {
            // Start new speech
            this.startSpeech();
        } else if (this.tts.isPlaying && !this.tts.isPaused) {
            // Pause
            this.tts.synth.pause();
            this.tts.isPaused = true;
            this.tts.isPlaying = false;
            this.updatePlayButton(false);
        } else if (this.tts.isPaused) {
            // Resume
            this.tts.synth.resume();
            this.tts.isPaused = false;
            this.tts.isPlaying = true;
            this.updatePlayButton(true);
        }
    }

    stopSpeech() {
        if (this.tts.synth.speaking) {
            this.tts.synth.cancel();
        }
        this.tts.isPlaying = false;
        this.tts.isPaused = false;
        this.updatePlayButton(false);
        this.resetProgress();
    }

    updatePlayButton(isPlaying) {
        const playIcon = document.getElementById('voice-play-icon');
        if (playIcon) {
            playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    startProgressTracking() {
        // Estimate total duration based on text length and speech rate
        const words = this.tts.currentScript.split(' ').length;
        const rate = parseFloat(document.getElementById('voice-rate').value) || 0.9;
        const estimatedDuration = (words / (150 * rate)) * 60; // 150 words per minute baseline
        
        document.getElementById('total-time').textContent = this.formatTime(estimatedDuration);
        
        // Update progress periodically
        this.progressInterval = setInterval(() => {
            if (this.tts.isPlaying && this.tts.synth.speaking) {
                // This is an approximation since Web Speech API doesn't provide precise progress
                const elapsed = (Date.now() - this.speechStartTime) / 1000;
                const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
                
                document.getElementById('progress-bar').style.width = progress + '%';
                document.getElementById('current-time').textContent = this.formatTime(elapsed);
                
                if (progress >= 100) {
                    this.resetProgress();
                }
            }
        }, 100);
        
        this.speechStartTime = Date.now();
    }

    resetProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        document.getElementById('progress-bar').style.width = '0%';
        document.getElementById('current-time').textContent = '00:00';
    }

    updateProgressDisplay() {
        document.getElementById('current-time').textContent = '00:00';
        document.getElementById('total-time').textContent = '00:00';
        document.getElementById('progress-bar').style.width = '0%';
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Text-to-Speech Manager Class
class TTSManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentScript = '';
        this.currentIndex = 0;
        this.sections = [];
        this.voices = [];
        
        this.init();
    }

    init() {
        // Load available voices
        this.loadVoices();
        
        // Voice loading might be async
        this.synth.addEventListener('voiceschanged', () => {
            this.loadVoices();
        });
        
        this.setupEventListeners();
        this.setupVoiceControls();
    }

    loadVoices() {
        this.voices = this.synth.getVoices().filter(voice => 
            voice.lang.startsWith('ko') || voice.lang.startsWith('en')
        );
        
        this.populateVoiceSelect();
    }

    populateVoiceSelect() {
        const voiceSelect = document.getElementById('voice-select');
        if (!voiceSelect) return;
        
        voiceSelect.innerHTML = '<option value="">기본 음성</option>';
        
        // 한국어 음성 분류
        const koreanVoices = this.voices.filter(voice => voice.lang.startsWith('ko'));
        const englishVoices = this.voices.filter(voice => voice.lang.startsWith('en'));
        
        if (koreanVoices.length > 0) {
            const koreanGroup = document.createElement('optgroup');
            koreanGroup.label = '🇰🇷 한국어 음성';
            voiceSelect.appendChild(koreanGroup);
            
            koreanVoices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = this.voices.indexOf(voice);
                
                // 음성 타입 분류
                let voiceType = this.categorizeKoreanVoice(voice.name);
                option.textContent = `${voiceType} - ${voice.name}`;
                koreanGroup.appendChild(option);
            });
        }
        
        if (englishVoices.length > 0) {
            const englishGroup = document.createElement('optgroup');
            englishGroup.label = '🇺🇸 영어 음성';
            voiceSelect.appendChild(englishGroup);
            
            englishVoices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = this.voices.indexOf(voice);
                option.textContent = `${voice.name} (${voice.lang})`;
                englishGroup.appendChild(option);
            });
        }
    }

    categorizeKoreanVoice(voiceName) {
        const name = voiceName.toLowerCase();
        
        // 브라우저별 한국어 음성 분류
        if (name.includes('female') || name.includes('여성') || name.includes('yuna') || name.includes('sora')) {
            if (name.includes('premium') || name.includes('enhanced')) {
                return '👩 여성 (프리미엄)';
            }
            return '👩 여성';
        } else if (name.includes('male') || name.includes('남성') || name.includes('minsu') || name.includes('jinho')) {
            if (name.includes('premium') || name.includes('enhanced')) {
                return '👨 남성 (프리미엄)';
            }
            return '👨 남성';
        }
        
        // 음성 특성별 분류 (이름 패턴 기반)
        if (name.includes('news') || name.includes('아나운서')) {
            return '📺 아나운서';
        } else if (name.includes('friendly') || name.includes('밝은')) {
            return '😊 밝은 목소리';
        } else if (name.includes('professional') || name.includes('신뢰')) {
            return '💼 신뢰감 있는';
        } else if (name.includes('show') || name.includes('host') || name.includes('쇼호스트')) {
            return '🎤 쇼호스트';
        }
        
        // 기본 분류
        return '🎯 표준';
    }

    setupEventListeners() {
        // Voice control buttons
        document.getElementById('voice-play-pause')?.addEventListener('click', () => {
            this.togglePlayPause();
        });

        document.getElementById('voice-stop')?.addEventListener('click', () => {
            this.stop();
        });

        document.getElementById('close-voice-control')?.addEventListener('click', () => {
            this.hideVoiceControl();
            this.stop();
        });

        // Voice buttons for each script type
        document.getElementById('play-one-host')?.addEventListener('click', () => {
            this.playScript('one-host');
        });

        document.getElementById('play-two-host')?.addEventListener('click', () => {
            this.playScript('two-host');
        });
    }

    setupVoiceControls() {
        // Speed control
        const speedSlider = document.getElementById('voice-speed');
        const speedDisplay = document.getElementById('voice-speed-display');
        
        if (speedSlider && speedDisplay) {
            speedSlider.addEventListener('input', (e) => {
                speedDisplay.textContent = `${e.target.value}x`;
            });
        }

        // Pitch control
        const pitchSlider = document.getElementById('voice-pitch');
        const pitchDisplay = document.getElementById('voice-pitch-display');
        
        if (pitchSlider && pitchDisplay) {
            pitchSlider.addEventListener('input', (e) => {
                pitchDisplay.textContent = `${e.target.value}x`;
            });
        }
    }

    playScript(scriptType) {
        const scriptElement = document.getElementById(`${scriptType}-script`);
        if (!scriptElement || !scriptElement.textContent.trim()) {
            alert('재생할 대본이 없습니다. 먼저 대본을 생성해주세요.');
            return;
        }

        this.currentScript = scriptElement.textContent.trim();
        this.parseScriptSections();
        
        if (this.sections.length === 0) {
            alert('대본을 파싱할 수 없습니다.');
            return;
        }

        this.showVoiceControl();
        this.currentIndex = 0;
        this.playCurrentSection();
    }

    parseScriptSections() {
        this.sections = [];
        const lines = this.currentScript.split('\n').filter(line => line.trim());
        
        let currentSection = null;
        
        lines.forEach(line => {
            line = line.trim();
            
            // Check if line contains time marker
            const timeMatch = line.match(/\[(\d{2}:\d{2})-(\d{2}:\d{2})\]/);
            
            if (timeMatch) {
                // Save previous section
                if (currentSection) {
                    this.sections.push(currentSection);
                }
                
                // Start new section
                currentSection = {
                    timeStart: timeMatch[1],
                    timeEnd: timeMatch[2],
                    title: line.replace(timeMatch[0], '').trim(),
                    content: ''
                };
            } else if (currentSection && line) {
                // Add content to current section (only actual dialogue, not the title)
                currentSection.content += (currentSection.content ? ' ' : '') + line;
            }
        });
        
        // Add last section
        if (currentSection) {
            this.sections.push(currentSection);
        }
    }

    playCurrentSection() {
        if (this.currentIndex >= this.sections.length) {
            this.onPlaybackComplete();
            return;
        }

        const section = this.sections[this.currentIndex];
        // Only speak the actual content, not the title/category
        const textToSpeak = section.content;
        
        // Skip empty sections
        if (!textToSpeak || textToSpeak.trim() === '') {
            this.currentIndex++;
            this.playCurrentSection();
            return;
        }
        
        this.currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Apply settings
        const speedSlider = document.getElementById('voice-speed');
        const pitchSlider = document.getElementById('voice-pitch');
        const voiceSelect = document.getElementById('voice-select');
        
        if (speedSlider) {
            this.currentUtterance.rate = parseFloat(speedSlider.value);
        }
        
        if (pitchSlider) {
            this.currentUtterance.pitch = parseFloat(pitchSlider.value);
        }
        
        if (voiceSelect && voiceSelect.value && this.voices[voiceSelect.value]) {
            this.currentUtterance.voice = this.voices[voiceSelect.value];
        }

        // Set language
        this.currentUtterance.lang = 'ko-KR';
        
        // Event handlers
        this.currentUtterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
            this.updatePlayButton();
            this.updateCurrentText(section);
        };

        this.currentUtterance.onend = () => {
            this.currentIndex++;
            setTimeout(() => {
                this.playCurrentSection();
            }, 500); // Small pause between sections
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.currentIndex++;
            this.playCurrentSection();
        };

        // Start speaking
        this.synth.speak(this.currentUtterance);
        this.updateProgress();
    }

    togglePlayPause() {
        if (!this.currentScript) {
            alert('재생할 대본이 없습니다.');
            return;
        }

        if (this.isPlaying) {
            if (this.isPaused) {
                this.resume();
            } else {
                this.pause();
            }
        } else {
            this.currentIndex = 0;
            this.playCurrentSection();
        }
    }

    pause() {
        if (this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
            this.isPaused = true;
            this.updatePlayButton();
        }
    }

    resume() {
        if (this.synth.paused) {
            this.synth.resume();
            this.isPaused = false;
            this.updatePlayButton();
        }
    }

    stop() {
        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.currentIndex = 0;
        this.updatePlayButton();
        this.updateCurrentText(null);
        this.updateProgress(0);
    }

    showVoiceControl() {
        const panel = document.getElementById('voice-control-panel');
        if (panel) {
            panel.classList.remove('hidden');
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    hideVoiceControl() {
        const panel = document.getElementById('voice-control-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    updatePlayButton() {
        const playIcon = document.getElementById('voice-play-icon');
        const playButton = document.getElementById('voice-play-pause');
        
        if (this.isPlaying && !this.isPaused) {
            playIcon.className = 'fas fa-pause';
            playButton.title = '일시정지';
        } else {
            playIcon.className = 'fas fa-play';
            playButton.title = '재생';
        }
    }

    updateCurrentText(section) {
        const currentTextElement = document.getElementById('voice-current-text');
        if (currentTextElement) {
            if (section) {
                currentTextElement.textContent = `${section.timeStart} - ${section.title}`;
            } else {
                currentTextElement.textContent = '음성을 재생하려면 재생 버튼을 클릭하세요';
            }
        }
    }

    updateProgress() {
        if (!this.sections.length) return;
        
        const progressElement = document.getElementById('voice-progress');
        if (progressElement) {
            const progress = ((this.currentIndex + 1) / this.sections.length) * 100;
            progressElement.style.width = `${Math.min(progress, 100)}%`;
        }
    }

    onPlaybackComplete() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentIndex = 0;
        this.updatePlayButton();
        this.updateCurrentText(null);
        this.updateProgress(100);
        
        // Show completion message
        const currentTextElement = document.getElementById('voice-current-text');
        if (currentTextElement) {
            currentTextElement.textContent = '재생 완료! 다시 들으려면 재생 버튼을 클릭하세요.';
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aieodingApp = new AIeodingApp();
    window.ttsManager = new TTSManager();
});