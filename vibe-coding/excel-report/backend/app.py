from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from io import BytesIO
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

def analyze_excel_data(df):
    """엑셀 데이터를 분석하여 중요한 인사이트 5가지를 추출합니다."""
    insights = []
    
    # 빈 데이터프레임 체크
    if df.empty or len(df) == 0:
        insights.append({
            'title': '데이터 없음',
            'description': '업로드된 파일에 데이터가 없습니다.',
            'type': 'summary',
            'data': {'rows': 0, 'columns': 0, 'column_names': []}
        })
        return insights
    
    # 1. 데이터 기본 정보
    insights.append({
        'title': '데이터셋 개요',
        'description': f'총 {len(df)} 행, {len(df.columns)} 열의 데이터가 포함되어 있습니다.',
        'type': 'summary',
        'data': {
            'rows': int(len(df)),
            'columns': int(len(df.columns)),
            'column_names': df.columns.tolist()
        }
    })
    
    # 숫자형 컬럼만 선택
    numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if numeric_columns:
        # 2. 최대값을 가진 항목
        try:
            max_col = numeric_columns[0]
            # NaN이 아닌 값만 사용
            valid_data = df[max_col].dropna()
            
            if len(valid_data) > 0:
                max_value = valid_data.max()
                max_idx = valid_data.idxmax()
                
                # chart_data에서도 NaN 제거
                chart_data = df[[max_col]].head(20).fillna(0).to_dict('records')
                
                insights.append({
                    'title': f'최고 수치 기록',
                    'description': f'{max_col} 컬럼에서 최고값 {max_value:.2f}을(를) 기록했습니다.',
                    'type': 'max_value',
                    'data': {
                        'column': max_col,
                        'value': float(max_value),
                        'index': int(max_idx),
                        'chart_data': chart_data
                    }
                })
        except Exception as e:
            print(f"최대값 분석 오류: {e}")
        
        # 3. 평균 및 통계
        try:
            if len(numeric_columns) > 0:
                means = {}
                stds = {}
                
                for col in numeric_columns[:5]:
                    mean_val = df[col].mean()
                    std_val = df[col].std()
                    
                    # NaN이 아닌 경우만 추가
                    if not pd.isna(mean_val):
                        means[col] = float(mean_val)
                    if not pd.isna(std_val):
                        stds[col] = float(std_val)
                
                if means:  # 유효한 데이터가 있을 때만 추가
                    insights.append({
                        'title': '주요 통계 지표',
                        'description': f'숫자형 데이터의 평균값과 표준편차를 분석했습니다.',
                        'type': 'statistics',
                        'data': {
                            'means': means,
                            'stds': stds
                        }
                    })
        except Exception as e:
            print(f"통계 분석 오류: {e}")
        
        # 4. 추세 분석 (첫 번째 숫자형 컬럼)
        try:
            if len(df) > 1:
                col = numeric_columns[0]
                valid_data = df[col].dropna()
                
                if len(valid_data) > 1:
                    first_val = valid_data.iloc[0]
                    last_val = valid_data.iloc[-1]
                    
                    trend = '증가' if last_val > first_val else '감소'
                    change = float(last_val - first_val)
                    
                    # NaN 제거하고 리스트로 변환
                    chart_data = df[col].fillna(0).head(30).tolist()
                    
                    insights.append({
                        'title': '데이터 추세',
                        'description': f'{col} 항목이 {trend} 추세를 보이며, 변화량은 {change:.2f}입니다.',
                        'type': 'trend',
                        'data': {
                            'column': col,
                            'trend': trend,
                            'change': change,
                            'chart_data': chart_data
                        }
                    })
        except Exception as e:
            print(f"추세 분석 오류: {e}")
    
    # 5. 데이터 분포 (카테고리형 데이터가 있는 경우)
    categorical_columns = df.select_dtypes(include=['object', 'string']).columns.tolist()
    
    try:
        if categorical_columns:
            col = categorical_columns[0]
            # NaN 제외하고 카운트
            value_counts = df[col].dropna().value_counts().head(10)
            
            if len(value_counts) > 0:
                insights.append({
                    'title': '카테고리 분포',
                    'description': f'{col} 항목의 분포를 분석했습니다. 가장 많이 나타난 항목은 "{value_counts.index[0]}"입니다.',
                    'type': 'distribution',
                    'data': {
                        'column': col,
                        'distribution': {str(k): int(v) for k, v in value_counts.items()}
                    }
                })
        elif numeric_columns and len(insights) < 5:
            # 숫자형 데이터의 분포
            col = numeric_columns[0]
            values = df[col].dropna().head(50).tolist()
            
            if values:
                insights.append({
                    'title': '데이터 분포 분석',
                    'description': f'{col} 데이터의 분포를 히스토그램으로 나타냈습니다.',
                    'type': 'histogram',
                    'data': {
                        'column': col,
                        'values': values
                    }
                })
    except Exception as e:
        print(f"분포 분석 오류: {e}")
    
    return insights[:5]  # 최대 5개의 인사이트 반환


def generate_press_release(insights, df):
    """인사이트를 기반으로 보도자료를 생성합니다."""
    
    today = datetime.now().strftime('%Y년 %m월 %d일')
    
    press_release = f"""
[보도자료]

제목: 데이터 분석 결과 발표 - 주요 인사이트 5가지

발표일: {today}

===================================================================

1. 데이터 개요
"""
    
    for i, insight in enumerate(insights, 1):
        press_release += f"\n\n{i}. {insight['title']}\n"
        press_release += f"   {insight['description']}\n"
        
        if insight['type'] == 'summary':
            press_release += f"   분석 대상 데이터는 {insight['data']['rows']}건의 레코드로 구성되어 있으며, "
            press_release += f"{insight['data']['columns']}개의 주요 지표를 포함하고 있습니다.\n"
            
        elif insight['type'] == 'max_value':
            press_release += f"   {insight['data']['column']} 항목에서 {insight['data']['value']:.2f}의 최고치를 기록하였으며, "
            press_release += f"이는 전체 데이터 중 가장 두드러진 성과로 평가됩니다.\n"
            
        elif insight['type'] == 'statistics':
            press_release += f"   주요 지표들의 평균값을 분석한 결과, 데이터의 안정성과 변동성을 확인할 수 있었습니다.\n"
            
        elif insight['type'] == 'trend':
            press_release += f"   데이터 추세 분석 결과, {insight['data']['trend']} 패턴이 관찰되었으며, "
            press_release += f"변화량은 {abs(insight['data']['change']):.2f}로 나타났습니다. "
            press_release += f"이는 향후 예측 및 전략 수립에 중요한 참고자료가 될 것입니다.\n"
            
        elif insight['type'] in ['distribution', 'histogram']:
            press_release += f"   데이터 분포 분석을 통해 주요 항목들의 비중과 패턴을 파악할 수 있었습니다.\n"
    
    press_release += f"""

===================================================================

본 분석 결과는 업로드된 엑셀 데이터를 기반으로 자동 생성되었습니다.
데이터 기반 의사결정에 활용하시기 바랍니다.

분석 완료 시각: {datetime.now().strftime('%Y년 %m월 %d일 %H시 %M분')}

[끝]
"""
    
    return press_release


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """엑셀 파일을 업로드하고 분석합니다."""
    
    if 'file' not in request.files:
        return jsonify({'error': '파일이 없습니다.'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': '파일이 선택되지 않았습니다.'}), 400
    
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        return jsonify({'error': '엑셀 파일(.xlsx, .xls) 또는 CSV 파일만 업로드 가능합니다.'}), 400
    
    try:
        # 파일 읽기
        file_content = file.read()
        
        if file.filename.endswith('.csv'):
            # CSV 인코딩 자동 감지
            try:
                df = pd.read_csv(BytesIO(file_content), encoding='utf-8')
            except UnicodeDecodeError:
                try:
                    df = pd.read_csv(BytesIO(file_content), encoding='euc-kr')
                except:
                    df = pd.read_csv(BytesIO(file_content), encoding='cp949')
        else:
            # Excel 파일 읽기 (openpyxl 엔진 명시)
            try:
                df = pd.read_excel(BytesIO(file_content), engine='openpyxl')
            except Exception as e:
                # xlrd 엔진으로 재시도 (구버전 .xls 파일)
                df = pd.read_excel(BytesIO(file_content), engine='xlrd')
        
        # 빈 데이터프레임 체크
        if df.empty:
            return jsonify({'error': '파일에 데이터가 없습니다.'}), 400
        
        # 데이터 분석
        insights = analyze_excel_data(df)
        
        # 보도자료 생성
        press_release = generate_press_release(insights, df)
        
        # data_preview에서도 NaN 처리
        preview_data = df.head(10).fillna('').to_dict('records')
        
        # 결과 반환
        return jsonify({
            'success': True,
            'insights': insights,
            'press_release': press_release,
            'data_preview': preview_data
        })
        
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        print(f"오류 상세: {error_detail}")
        return jsonify({'error': f'파일 처리 중 오류가 발생했습니다: {str(e)}'}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """서버 상태 확인"""
    return jsonify({'status': 'healthy'})


if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')

