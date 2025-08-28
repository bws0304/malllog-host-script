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

        // 실제 GPT API로 대본 생성
        try {
            await this.createMockScript(scriptType, tone, target, duration, hostNames);
        } catch (error) {
            console.error('Script generation error:', error);
            alert('대본 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
            
            // Reset generate button
            document.getElementById('generate-script-btn').disabled = false;
            document.getElementById('generate-script-btn').innerHTML = '<i class="fas fa-magic mr-2"></i>대본 생성하기';
        }
    }

    async createMockScript(scriptType, tone, target, duration, hostNames) {
        try {
            // 로딩 상태 표시
            document.getElementById('generate-script-btn').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>AI 대본 생성 중...';
            
            // 1인 진행 대본 (GPT API 호출)
            const oneHostScript = await this.generateOneHostScript();
            
            // 2인 진행 대본 (GPT API 호출)
            const twoHostScript = await this.generateTwoHostScript(hostNames);
            
            // Create folder and save script
            await this.createFolderAndSaveScript(scriptType, { oneHostScript, twoHostScript }, duration);
        
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
        } catch (error) {
            console.error('Script generation error:', error);
            
            // Reset generate button
            document.getElementById('generate-script-btn').disabled = false;
            document.getElementById('generate-script-btn').innerHTML = '<i class="fas fa-magic mr-2"></i>대본 생성하기';
            
            alert('대본 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }

    async generateOneHostScript() {
        const data = this.currentParsedData;
        const tone = document.getElementById('tone-select').value;
        const target = document.getElementById('target-select').value;
        const hostStyle = document.getElementById('host-style-select').value;
        const structureType = document.getElementById('structure-type-select').value;
        const duration = parseInt(document.getElementById('duration-select').value);
        
        return await this.callGPTAPI({
            data,
            style: 'one_host',
            tone,
            target, 
            hostStyle,
            structureType,
            duration
        });
    }

    async generateTwoHostScript(hostNames) {
        const data = this.currentParsedData;
        const tone = document.getElementById('tone-select').value;
        const target = document.getElementById('target-select').value;
        const hostStyle = document.getElementById('host-style-select').value;
        const structureType = document.getElementById('structure-type-select').value;
        const duration = parseInt(document.getElementById('duration-select').value);
        
        return await this.callGPTAPI({
            data,
            style: 'two_hosts',
            tone,
            target,
            hostStyle,
            structureType,
            duration,
            hostNames
        });
    }

    async callGPTAPI(params) {
        try {
            // 로딩 상태 표시
            console.log('Calling GPT API with params:', params);
            
            const response = await fetch('/api/generate-script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                console.log('GPT API Success:', result);
                return result.script;
            } else {
                throw new Error(result.error || 'Unknown API error');
            }
        } catch (error) {
            console.error('GPT API Error:', error);
            
            // 실패시 기존 템플릿으로 폴백
            console.log('Falling back to template system');
            return this.getShoppingHostTemplate(
                params.data, 
                params.tone, 
                params.target, 
                params.hostStyle, 
                params.style, 
                params.hostNames
            );
        }
    }

    getShoppingHostTemplate(data, tone, target, hostStyle, scriptType, hostNames = null) {
        const structureType = document.getElementById('structure-type-select').value;
        const templates = {
            passionate: { // 🔥 열정적 홈쇼핑 스타일
                one_host: {
                    intro: "여러분 안녕하세요! 와, 오늘 정말 놀라운 여행 상품 하나 가져왔어요!",
                    intro_90: "여러분 안녕하세요! 와, 오늘 정말 놀라운 여행 상품 하나 가져왔어요! 진짜 이건 놓치면 안 되는 기회라고 말씀드리고 싶어요!",
                    core: "지금 보고 계신 게 바로 {destination} {duration}! 어머 이건 진짜 대박이에요! {golf_course}에서 {rounds}를 치실 수 있다고요? 이 가격에?",
                    core_90: "지금 보고 계신 게 바로 {destination} {duration}! 어머 이건 진짜 대박이에요! {golf_course}에서 {rounds}를 치실 수 있다고요? 이 가격에? 여러분, 이런 곳에서 골프 치는 게 얼마나 특별한 경험인지 아세요? 정말 한 번 가보시면 평생 잊지 못할 추억이 될 거예요!",
                    hotel: "그런데 여러분, 여기서 끝이 아니에요! 숙박은 어디냐구요? {hotel}이에요! 어머 이 호텔 얼마나 좋은지 아세요? {meals}까지 다 포함이라고요!",
                    hotel_90: "그런데 여러분, 여기서 끝이 아니에요! 숙박은 어디냐구요? {hotel}이에요! 어머 이 호텔 얼마나 좋은지 아세요? 5성급 럭셔리 호텔이거든요! {meals}까지 다 포함이라고요! 특히 조식 뷔페는 정말 환상적이에요. 현지 음식부터 인터내셔널 메뉴까지 다양하게 준비되어 있어요!",
                    flight: "항공편도 완전 럭셔리해요! {airline}으로 편안~하게 가시고요, {departure_dates} 중에 언제든지 출발하실 수 있어요! 이건 진짜 기회예요!",
                    flight_90: "항공편도 완전 럭셔리해요! {airline}으로 편안~하게 가시고요, {departure_dates} 중에 언제든지 출발하실 수 있어요! 직항편이니까 피로감도 적고요, 기내식도 맛있다고 소문났어요! 좌석도 넓어서 정말 편안하게 가실 수 있어요!",
                    price: "그런데 가격이 얼마일 것 같으세요? {includes} 이 모든 게 다 포함되어서... 어머 깜짝 놀라지 마세요... 단돈 {price}! 말도 안 되는 가격이죠?",
                    price_90: "그런데 가격이 얼마일 것 같으세요? {includes} 이 모든 게 다 포함되어서... 어머 깜짝 놀라지 마세요... 단돈 {price}! 말도 안 되는 가격이죠? 다른 업체들 비교해보세요! 이런 조건으로 이 가격 절대 찾을 수 없어요! 정말 파격적인 혜택이라고 자신 있게 말씀드릴 수 있어요!",
                    perks: "아직도 더 있어요! 특별 혜택으로 {perks} 이런 것도 다 드린다고요! 하지만 {cautions} 이건 꼭 미리 준비해주세요!",
                    perks_90: "아직도 더 있어요! 특별 혜택으로 {perks} 이런 것도 다 드린다고요! 그리고 공항 픽업 서비스, 현지 가이드 동행, 여행자 보험까지! 정말 하나부터 열까지 다 신경써드려요! 하지만 {cautions} 이건 꼭 미리 준비해주세요!",
                    ending: "여러분, 이런 기회는 정말 흔하지 않아요! 지금 바로 아래 링크 클릭하세요!",
                    ending_90: "여러분, 이런 기회는 정말 흔하지 않아요! 매일 문의 전화가 쇄도하고 있어요! 선착순 마감이니까 망설이지 마시고 지금 바로 아래 링크 클릭하세요! 후회하지 않으실 거예요!",
                    
                    // 스토리텔링형 템플릿
                    hook: "여러분, 혹시 이런 경험 있으세요? 일상에 지쳐서 정말 멀리 떠나고 싶을 때...",
                    story: "바로 저도 그랬어요! 그런데 {destination}에서 {duration} 보내고 완전히 달라졌거든요!",
                    experience: "{golf_course}에서 {rounds} 치면서 느꼈던 그 자유로움, {hotel}에서의 여유로운 아침...",
                    benefits: "그런데 이 모든 걸 {price}에 경험할 수 있다면? {includes} 모든 게 포함되어서!",
                    emotion: "정말 인생이 바뀌는 경험이에요. {perks} 이런 특별한 혜택까지!",
                    cta: "지금 이 순간을 놓치지 마세요. 아래 링크로 새로운 인생을 시작하세요!",
                    
                    // 숏폼 최적화형 템플릿  
                    impact: "잠깐! {price}에 {destination} {duration}? 이거 실화냐고요?",
                    key_points: "{golf_course} {rounds}, {hotel} 숙박, {airline} 직항까지!",
                    hidden_benefits: "그런데 여기서 끝이 아니에요! {perks} 이것도 다 무료!",
                    shocking_price: "{includes} 전부 포함해서 단돈 {price}! 다른 곳과 비교해보세요!",
                    special_terms: "{departure_dates} 한정! {cautions} 준비만 하면 끝!",
                    viral_element: "친구들한테 자랑할 준비 되셨나요? 이런 혜택 어디서도 못 봤을걸요!",
                    urgent_cta: "지금 안 누르면 후회해요! 바로 아래 링크 클릭!"
                },
                two_hosts: {
                    intro: "{host1}: 여러분 안녕하세요! {host1}입니다!\n{host2}: {host2}예요! 오늘 진짜 대박 상품 가져왔어요!",
                    intro_90: "{host1}: 여러분 안녕하세요! {host1}입니다!\n{host2}: {host2}예요! 오늘 진짜 대박 상품 가져왔어요!\n{host1}: 정말 놓치면 후회할 상품이에요!\n{host2}: 맞아요! 지금까지 이런 조건은 본 적이 없어요!",
                    core: "{host1}: 와 {host2}씨, 이거 진짜 대단한데요?\n{host2}: 맞아요! {destination} {duration}인데, {golf_course}에서 {rounds}를 친다고요!",
                    core_90: "{host1}: 와 {host2}씨, 이거 진짜 대단한데요?\n{host2}: 맞아요! {destination} {duration}인데, {golf_course}에서 {rounds}를 친다고요!\n{host1}: 이 골프장이 얼마나 유명한지 아세요?\n{host2}: 프로 선수들도 경기하는 곳이에요! 코스 컨디션도 최고래요!",
                    hotel: "{host1}: 숙박은 어디서 하는 거예요?\n{host2}: 어머, {hotel}이에요! 이 호텔이 얼마나 좋은지! {meals}까지 다 포함이래요!",
                    hotel_90: "{host1}: 숙박은 어디서 하는 거예요?\n{host2}: 어머, {hotel}이에요! 이 호텔이 얼마나 좋은지!\n{host1}: 5성급 리조트죠?\n{host2}: 맞아요! {meals}까지 다 포함이고, 수영장, 스파, 피트니스센터까지!",
                    flight: "{host1}: 항공편은 어떻게 되나요?\n{host2}: {airline}으로 완전 편안하게! {departure_dates} 중에 언제든 출발 가능해요!",
                    flight_90: "{host1}: 항공편은 어떻게 되나요?\n{host2}: {airline}으로 완전 편안하게! {departure_dates} 중에 언제든 출발 가능해요!\n{host1}: 직항편이니까 편리하겠네요!\n{host2}: 맞아요! 기내식도 맛있고, 좌석도 넓어서 피로감이 적어요!",
                    price: "{host1}: 가격이 궁금한데요?\n{host2}: 깜짝 놀라지 마세요! {includes} 다 포함해서 {price}! 말도 안 되죠?",
                    price_90: "{host1}: 가격이 궁금한데요?\n{host2}: 깜짝 놀라지 마세요! {includes} 다 포함해서 {price}! 말도 안 되죠?\n{host1}: 다른 업체 견적 받아봤는데 이 가격이 말이 돼요?\n{host2}: 저희가 특가로 준비한 거라 정말 파격적이에요!",
                    perks: "{host1}: 혜택도 더 있나요?\n{host2}: 당연하죠! {perks} 이런 것도 다 드려요! 단, {cautions} 이건 꼭 확인하세요!",
                    perks_90: "{host1}: 혜택도 더 있나요?\n{host2}: 당연하죠! {perks} 이런 것도 다 드려요!\n{host1}: 와, 이것까지 다 포함이에요?\n{host2}: 네! 그리고 {cautions} 이건 꼭 미리 준비해주세요!",
                    ending: "{host1}: 이런 기회는 정말 흔하지 않아요!\n{host2}: 지금 바로 아래 링크 클릭하세요!",
                    ending_90: "{host1}: 이런 기회는 정말 흔하지 않아요!\n{host2}: 매일 문의가 쇄도하고 있어서 조기 마감될 수 있어요!\n{host1}: 망설이지 마시고요!\n{host2}: 지금 바로 아래 링크 클릭하세요!",
                    
                    // 스토리텔링형 2인 진행
                    hook: "{host1}: {host2}씨, 요즘 일상이 너무 지루하지 않나요?\n{host2}: 맞아요! 그래서 제가 다녀온 {destination} 이야기를 해드리려고요!",
                    story: "{host1}: 정말요? 어떠셨어요?\n{host2}: {duration} 동안 정말 인생이 바뀌는 경험이었어요!",
                    experience: "{host1}: 구체적으로 어떤 점이요?\n{host2}: {golf_course}에서 {rounds} 치면서, {hotel}에서 여유롭게 쉬면서...",
                    benefits: "{host1}: 비용이 많이 들었을 것 같은데요?\n{host2}: 그게 아니에요! {price}에 {includes} 모든 게 포함이었어요!",
                    emotion: "{host1}: 정말 특별한 경험이었겠네요!\n{host2}: 네! {perks} 이런 혜택까지 있어서 더 좋았어요!",
                    cta: "{host1}: 듣기만 해도 가고 싶어져요!\n{host2}: 아래 링크로 여러분도 경험해보세요!",
                    
                    // 숏폼 최적화형 2인 진행
                    impact: "{host1}: 잠깐! 이거 실화예요?\n{host2}: {price}에 {destination} {duration}! 진짜예요!",
                    key_points: "{host1}: 뭐가 포함된 거예요?\n{host2}: {golf_course} {rounds}, {hotel} 숙박, {airline} 직항까지!",
                    hidden_benefits: "{host1}: 설마 이게 다는 아니겠죠?\n{host2}: 당연히 더 있죠! {perks} 이것도 다 무료!",
                    shocking_price: "{host1}: 다른 곳과 비교해봤어요?\n{host2}: {includes} 전부 포함 {price}! 어디서도 이 가격 없어요!",
                    special_terms: "{host1}: 언제까지 가능한 거예요?\n{host2}: {departure_dates} 한정! {cautions} 준비만 하면 끝!",
                    viral_element: "{host1}: 친구들이 부러워하겠어요!\n{host2}: 당연하죠! 이런 혜택 어디서 봤겠어요!",
                    urgent_cta: "{host1}: 지금 안 누르면 후회할 것 같아요!\n{host2}: 맞아요! 바로 아래 링크 클릭!"
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
        
        // 대본 길이에 따른 시간 구간 설정
        const duration = parseInt(document.getElementById('duration-select').value) || 60;
        let sections = [];

        // 구성 타입별 섹션 구조
        if (structureType === 'storytelling') {
            // 스토리텔링형 구조
            if (duration === 90) {
                sections = [
                    { time: "00:00-00:10", title: "감성 훅", content: styleTemplate.hook },
                    { time: "00:10-00:25", title: "스토리 전개", content: styleTemplate.story },
                    { time: "00:25-00:40", title: "여행 경험", content: styleTemplate.experience },
                    { time: "00:40-00:55", title: "핵심 혜택", content: styleTemplate.benefits },
                    { time: "00:55-01:10", title: "감정 몰입", content: styleTemplate.emotion },
                    { time: "01:10-01:30", title: "행동 유도", content: styleTemplate.cta }
                ];
            } else {
                sections = [
                    { time: "00:00-00:08", title: "감성 훅", content: styleTemplate.hook },
                    { time: "00:08-00:18", title: "스토리 전개", content: styleTemplate.story },
                    { time: "00:18-00:30", title: "여행 경험", content: styleTemplate.experience },
                    { time: "00:30-00:42", title: "핵심 혜택", content: styleTemplate.benefits },
                    { time: "00:42-00:52", title: "감정 몰입", content: styleTemplate.emotion },
                    { time: "00:52-01:00", title: "행동 유도", content: styleTemplate.cta }
                ];
            }
        } else if (structureType === 'viral') {
            // 숏폼 최적화형 구조
            if (duration === 90) {
                sections = [
                    { time: "00:00-00:05", title: "임팩트 훅", content: styleTemplate.impact },
                    { time: "00:05-00:20", title: "핵심 포인트", content: styleTemplate.key_points },
                    { time: "00:20-00:35", title: "숨은 혜택", content: styleTemplate.hidden_benefits },
                    { time: "00:35-00:50", title: "충격 가격", content: styleTemplate.shocking_price },
                    { time: "00:50-01:05", title: "특별 조건", content: styleTemplate.special_terms },
                    { time: "01:05-01:20", title: "바이럴 요소", content: styleTemplate.viral_element },
                    { time: "01:20-01:30", title: "긴급 CTA", content: styleTemplate.urgent_cta }
                ];
            } else {
                sections = [
                    { time: "00:00-00:03", title: "임팩트 훅", content: styleTemplate.impact },
                    { time: "00:03-00:15", title: "핵심 포인트", content: styleTemplate.key_points },
                    { time: "00:15-00:25", title: "숨은 혜택", content: styleTemplate.hidden_benefits },
                    { time: "00:25-00:35", title: "충격 가격", content: styleTemplate.shocking_price },
                    { time: "00:35-00:45", title: "특별 조건", content: styleTemplate.special_terms },
                    { time: "00:45-00:55", title: "바이럴 요소", content: styleTemplate.viral_element },
                    { time: "00:55-01:00", title: "긴급 CTA", content: styleTemplate.urgent_cta }
                ];
            }
        } else {
            // 기본형 (홈쇼핑 구조) - 기존 구조 유지
            if (duration === 90) {
                sections = [
                    { time: "00:00-00:08", title: "인트로", content: styleTemplate.intro },
                    { time: "00:08-00:22", title: "상품 핵심", content: styleTemplate.core },
                    { time: "00:22-00:36", title: "숙박&편의", content: styleTemplate.hotel },
                    { time: "00:36-00:50", title: "항공&조건", content: styleTemplate.flight },
                    { time: "00:50-01:04", title: "포함&가격", content: styleTemplate.price },
                    { time: "01:04-01:18", title: "특전 및 유의", content: styleTemplate.perks },
                    { time: "01:18-01:30", title: "엔딩", content: styleTemplate.ending }
                ];
            } else if (duration === 55) {
                sections = [
                    { time: "00:00-00:04", title: "인트로", content: styleTemplate.intro },
                    { time: "00:04-00:12", title: "상품 핵심", content: styleTemplate.core },
                    { time: "00:12-00:20", title: "숙박&편의", content: styleTemplate.hotel },
                    { time: "00:20-00:28", title: "항공&조건", content: styleTemplate.flight },
                    { time: "00:28-00:36", title: "포함&가격", content: styleTemplate.price },
                    { time: "00:36-00:44", title: "특전 및 유의", content: styleTemplate.perks },
                    { time: "00:44-00:55", title: "엔딩", content: styleTemplate.ending }
                ];
            } else if (duration === 65) {
                sections = [
                    { time: "00:00-00:06", title: "인트로", content: styleTemplate.intro },
                    { time: "00:06-00:16", title: "상품 핵심", content: styleTemplate.core },
                    { time: "00:16-00:26", title: "숙박&편의", content: styleTemplate.hotel },
                    { time: "00:26-00:36", title: "항공&조건", content: styleTemplate.flight },
                    { time: "00:36-00:46", title: "포함&가격", content: styleTemplate.price },
                    { time: "00:46-00:56", title: "특전 및 유의", content: styleTemplate.perks },
                    { time: "00:56-01:05", title: "엔딩", content: styleTemplate.ending }
                ];
            } else {
                sections = [
                    { time: "00:00-00:05", title: "인트로", content: styleTemplate.intro },
                    { time: "00:05-00:15", title: "상품 핵심", content: styleTemplate.core },
                    { time: "00:15-00:25", title: "숙박&편의", content: styleTemplate.hotel },
                    { time: "00:25-00:35", title: "항공&조건", content: styleTemplate.flight },
                    { time: "00:35-00:45", title: "포함&가격", content: styleTemplate.price },
                    { time: "00:45-00:55", title: "특전 및 유의", content: styleTemplate.perks },
                    { time: "00:55-01:00", title: "엔딩", content: styleTemplate.ending }
                ];
            }
        }

        return sections.map(section => {
            let content = section.content;
            
            // 90초 대본일 경우 확장 템플릿 사용
            if (duration === 90) {
                const sectionKey = section.title.toLowerCase().replace(/[&\s]/g, '_');
                const extendedKey = sectionKey + '_90';
                if (styleTemplate[extendedKey]) {
                    content = styleTemplate[extendedKey];
                }
            }
            
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
            this.stop();
        });
        
        document.getElementById('close-voice-control')?.addEventListener('click', () => {
            this.hideVoiceControl();
            this.stop();
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
        if (window.ttsManager) {
            window.ttsManager.stop();
        }
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
    
            this.startProgressTracking();
        };
        
        this.tts.utterance.onend = () => {
            this.tts.isPlaying = false;
            this.tts.isPaused = false;
    
            this.resetProgress();
        };
        
        this.tts.utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.tts.isPlaying = false;
            this.tts.isPaused = false;
    
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
    
        } else if (this.tts.isPaused) {
            // Resume
            this.tts.synth.resume();
            this.tts.isPaused = false;
            this.tts.isPlaying = true;
    
        }
    }

    stop() {
        this.tts.synth.cancel();
        this.tts.isPlaying = false;
        this.tts.isPaused = false;
        this.resetProgress();
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
                // Process line to extract only dialogue content
                let processedLine = this.extractDialogueOnly(line);
                if (processedLine) {
                    currentSection.content += (currentSection.content ? ' ' : '') + processedLine;
                }
            }
        });
        
        // Add last section
        if (currentSection) {
            this.sections.push(currentSection);
        }
    }

    extractDialogueOnly(line) {
        // Remove host names (e.g., "진행자1:", "김여행:", etc.)
        let cleanLine = line.replace(/^[^:]+:\s*/, '');
        
        // Skip if line is empty after removing host name
        if (!cleanLine.trim()) {
            return '';
        }
        
        // Skip if line contains only category markers or time codes
        if (cleanLine.match(/^\[.*\]/) || cleanLine.match(/^(인트로|상품|핵심|숙박|편의|항공|조건|포함|가격|특전|유의|엔딩)$/)) {
            return '';
        }
        
        return cleanLine;
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
