const analyzeBtn = document.getElementById('analyzeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const statistics = document.getElementById('statistics');
const statsGrid = document.getElementById('statsGrid');

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
    try {
        const response = await fetch('/api/press-release');
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `소비자물가지수_보도자료_${new Date().toISOString().split('T')[0]}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            showError('보도자료 다운로드 중 오류가 발생했습니다.');
        }
    } catch (err) {
        showError('다운로드 오류: ' + err.message);
    }
});

function displayStatistics(stats) {
    statsGrid.innerHTML = '';
    
    const statOrder = [
        '전체_평균', '최고_물가지수', '최저_물가지수', '최근_1년_평균', 
        '최근_3년_평균', '연평균_증가율', '변동성', '최고_상승률_지출목적',
        '최저_상승률_지출목적', '상위_지출목적_평균', '최근_추세'
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
    
    return card;
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

// PDF to DOCX 변환 기능
const pdfFileInput = document.getElementById('pdfFileInput');
const convertBtn = document.getElementById('convertBtn');
const fileName = document.getElementById('fileName');
const convertLoading = document.getElementById('convertLoading');
const convertError = document.getElementById('convertError');

pdfFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileName.textContent = file.name;
        convertBtn.disabled = false;
        convertError.classList.add('hidden');
    } else {
        fileName.textContent = '';
        convertBtn.disabled = true;
    }
});

convertBtn.addEventListener('click', async () => {
    const file = pdfFileInput.files[0];
    if (!file) {
        showConvertError('파일을 선택해주세요.');
        return;
    }
    
    convertLoading.classList.remove('hidden');
    convertError.classList.add('hidden');
    convertBtn.disabled = true;
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/pdf-to-docx', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // 원본 파일명에서 확장자 변경
            const originalName = file.name.replace(/\.pdf$/i, '');
            a.download = `${originalName}.docx`;
            
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // 성공 메시지
            showConvertSuccess('변환이 완료되었습니다!');
        } else {
            const data = await response.json();
            showConvertError(data.error || '변환 중 오류가 발생했습니다.');
        }
    } catch (err) {
        showConvertError('서버 연결 오류: ' + err.message);
    } finally {
        convertLoading.classList.add('hidden');
        convertBtn.disabled = false;
    }
});

function showConvertError(message) {
    convertError.textContent = message;
    convertError.classList.remove('hidden');
}

function showConvertSuccess(message) {
    convertError.textContent = message;
    convertError.classList.remove('hidden');
    convertError.style.color = '#28a745';
    setTimeout(() => {
        convertError.classList.add('hidden');
        convertError.style.color = '';
    }, 3000);
}

