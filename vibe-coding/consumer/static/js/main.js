const analyzeBtn = document.getElementById('analyzeBtn');
const dataDownloadBtn = document.getElementById('dataDownloadBtn');
const downloadBtn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const statistics = document.getElementById('statistics');
const statsGrid = document.getElementById('statsGrid');
const pressRelease = document.getElementById('pressRelease');
const pressReleaseContent = document.getElementById('pressReleaseContent');
const periodType = document.getElementById('periodType');
const monthCount = document.getElementById('monthCount');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const monthsInput = document.getElementById('monthsInput');
const dateRangeInput = document.getElementById('dateRangeInput');

let currentStats = null;
let currentPeriodParams = null;

// 기간 선택 방식 변경
periodType.addEventListener('change', () => {
    if (periodType.value === 'months') {
        monthsInput.classList.remove('hidden');
        dateRangeInput.classList.add('hidden');
    } else {
        monthsInput.classList.add('hidden');
        dateRangeInput.classList.remove('hidden');
        // 기본값 설정 (최근 1년)
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        endDate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        startDate.value = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, '0')}`;
    }
});

// 초기값 설정
window.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), 1);
    endDate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    startDate.value = `${threeYearsAgo.getFullYear()}-${String(threeYearsAgo.getMonth() + 1).padStart(2, '0')}`;
});

function getPeriodParams() {
    const params = new URLSearchParams();
    params.append('periodType', periodType.value);
    
    if (periodType.value === 'months') {
        params.append('monthCount', monthCount.value);
    } else {
        params.append('startDate', startDate.value);
        params.append('endDate', endDate.value);
    }
    
    return params;
}

analyzeBtn.addEventListener('click', async () => {
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    statistics.classList.add('hidden');
    analyzeBtn.disabled = true;
    
    try {
        const params = getPeriodParams();
        currentPeriodParams = params;
        
        const response = await fetch(`/api/statistics?${params.toString()}`);
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
        // 기간 파라미터가 없으면 현재 선택된 기간 사용
        const params = currentPeriodParams || getPeriodParams();
        
        const response = await fetch(`/api/press-release?${params.toString()}`);
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

// 자료 다운로드 버튼 이벤트
dataDownloadBtn.addEventListener('click', async () => {
    dataDownloadBtn.disabled = true;
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    
    try {
        const params = getPeriodParams();
        const response = await fetch(`/api/download-data?${params.toString()}`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // 파일명 생성 (기간 정보 포함)
            const now = new Date();
            let filename = `소비자물가지수_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
            
            if (periodType.value === 'months') {
                filename += `_최근${monthCount.value}개월.xlsx`;
            } else {
                filename += `_${startDate.value}_${endDate.value}.xlsx`;
            }
            
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            const data = await response.json();
            showError(data.error || '자료 다운로드 중 오류가 발생했습니다.');
        }
    } catch (err) {
        showError('자료 다운로드 오류: ' + err.message);
    } finally {
        loading.classList.add('hidden');
        dataDownloadBtn.disabled = false;
    }
});

