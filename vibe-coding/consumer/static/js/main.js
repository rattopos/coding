const analyzeBtn = document.getElementById('analyzeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const statistics = document.getElementById('statistics');
const statsGrid = document.getElementById('statsGrid');
const pressRelease = document.getElementById('pressRelease');
const pressReleaseContent = document.getElementById('pressReleaseContent');

let currentStats = null;

analyzeBtn.addEventListener('click', async () => {
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    statistics.classList.add('hidden');
    analyzeBtn.disabled = true;
    
    try {
        const response = await fetch('/api/statistics');
        const data = await response.json();
        
        if (data.success) {
            currentStats = data.statistics;
            displayStatistics(data.statistics);
            downloadBtn.disabled = false;
        } else {
            showError(data.error || '통계 분석 중 오류가 발생했습니다.');
        }
    } catch (err) {
        showError('서버 연결 오류: ' + err.message);
    } finally {
        loading.classList.add('hidden');
        analyzeBtn.disabled = false;
    }
});

downloadBtn.addEventListener('click', async () => {
    downloadBtn.disabled = true;
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    
    try {
        const response = await fetch('/api/press-release');
        const data = await response.json();
        
        if (data.success) {
            pressReleaseContent.innerHTML = data.html;
            pressRelease.classList.remove('hidden');
            // 보도자료 섹션으로 스크롤
            pressRelease.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            showError(data.error || '보도자료 생성 중 오류가 발생했습니다.');
        }
    } catch (err) {
        showError('보도자료 로드 오류: ' + err.message);
    } finally {
        loading.classList.add('hidden');
        downloadBtn.disabled = false;
    }
});

function displayStatistics(stats) {
    statsGrid.innerHTML = '';
    
    const statOrder = [
        '최근_3개월_평균_증가율', '최고_상승률_달', '최저_상승률_달', '물가_상승_추세',
        '변동성_지수', '최고_변동성_지출목적', '최저_변동성_지출목적', '물가_안정성_점수',
        '최근_6개월_변화', '계절성_패턴'
    ];
    
    statOrder.forEach(key => {
        if (stats[key]) {
            const stat = stats[key];
            const card = createStatCard(stat, key);
            statsGrid.appendChild(card);
        }
    });
    
    statistics.classList.remove('hidden');
}

function createStatCard(stat, key) {
    const card = document.createElement('div');
    card.className = 'stat-card';
    
    const title = document.createElement('h3');
    title.textContent = stat.description;
    card.appendChild(title);
    
    if (stat.value !== undefined) {
        const value = document.createElement('div');
        value.className = 'stat-value';
        value.innerHTML = `${stat.value}<span class="stat-unit">${stat.unit || ''}</span>`;
        card.appendChild(value);
    }
    
    if (stat.date) {
        const detail = document.createElement('div');
        detail.className = 'stat-detail';
        detail.textContent = `시점: ${stat.date}`;
        card.appendChild(detail);
    }
    
    if (stat.category) {
        const detail = document.createElement('div');
        detail.className = 'stat-detail';
        detail.textContent = `지출목적: ${stat.category}`;
        card.appendChild(detail);
    }
    
    if (stat.categories) {
        stat.categories.forEach(cat => {
            const detail = document.createElement('div');
            detail.className = 'stat-detail';
            detail.textContent = `• ${cat.name}: ${cat.value}`;
            card.appendChild(detail);
        });
    }
    
    if (stat.trend) {
        const detail = document.createElement('div');
        detail.className = 'stat-detail';
        detail.textContent = `추세: ${stat.trend}`;
        card.appendChild(detail);
    }
    
    // 계절성 패턴 특수 처리
    if (stat.highest_month) {
        const detail = document.createElement('div');
        detail.className = 'stat-detail';
        detail.textContent = `최고: ${stat.highest_month} (${stat.highest_value}), 최저: ${stat.lowest_month} (${stat.lowest_value})`;
        card.appendChild(detail);
    }
    
    return card;
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

