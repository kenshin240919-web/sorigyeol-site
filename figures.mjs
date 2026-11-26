// 글에 들어가는 그림. 모두 공식(수식)이나 글에 적힌 기준값으로 직접 그린 SVG입니다.
// 형식: figures[slug] = [{file, after(몇 번째 소제목 뒤, 0부터), alt, caption, svg}]
const C = {ink: '#242c40', navy: '#1f2a44', amber: '#d9962b', teal: '#2f7d8c', grid: '#e4e7ee', muted: '#6b7182', bg: '#fbfaf7'};
const F = 'font-family="Malgun Gothic,Apple SD Gothic Neo,sans-serif"';
const n = v => +v.toFixed(1);

// 선 그래프. x가 로그 축이면 xLog:true
function chart({w = 720, h = 400, title, x, y, xLog = false, yLog = false, xTicks, yTicks, xLabel, yLabel, series, notes = []}) {
  const L = 64, R = 24, T = 78, B = 58, pw = w - L - R, ph = h - T - B;
  const tx = xLog ? v => L + (Math.log10(v) - Math.log10(x[0])) / (Math.log10(x[1]) - Math.log10(x[0])) * pw : v => L + (v - x[0]) / (x[1] - x[0]) * pw;
  const ty = yLog ? v => T + (1 - (Math.log10(v) - Math.log10(y[0])) / (Math.log10(y[1]) - Math.log10(y[0]))) * ph : v => T + (1 - (v - y[0]) / (y[1] - y[0])) * ph;
  yTicks = yTicks.map(t => Array.isArray(t) ? t : [t, t]);
  const grid = yTicks.map(([v, t]) => `<line x1="${L}" x2="${L + pw}" y1="${n(ty(v))}" y2="${n(ty(v))}" stroke="${C.grid}"/><text x="${L - 8}" y="${n(ty(v)) + 4}" text-anchor="end" font-size="12" fill="${C.muted}">${t}</text>`).join('')
    + xTicks.map(([v, t = v]) => `<line x1="${n(tx(v))}" x2="${n(tx(v))}" y1="${T}" y2="${T + ph}" stroke="${C.grid}"/><text x="${n(tx(v))}" y="${T + ph + 18}" text-anchor="middle" font-size="12" fill="${C.muted}">${t}</text>`).join('');
  const lines = series.map(s => `<polyline fill="none" stroke="${s.color}" stroke-width="3" stroke-linejoin="round" ${s.dash ? 'stroke-dasharray="7 6"' : ''} points="${s.pts.map(([a, b]) => `${n(tx(a))},${n(ty(b))}`).join(' ')}"/>`).join('');
  const legend = series.map((s, i) => `<g transform="translate(${L + 8 + i * 230},${T - 26})"><line x2="22" stroke="${s.color}" stroke-width="3" ${s.dash ? 'stroke-dasharray="7 6"' : ''}/><text x="30" y="4" font-size="13" fill="${C.ink}">${s.label}</text></g>`).join('');
  const marks = notes.map(([a, b, t, anchor = 'start']) => `<circle cx="${n(tx(a))}" cy="${n(ty(b))}" r="4.5" fill="${C.ink}"/><text x="${n(tx(a)) + (anchor === 'end' ? -9 : 9)}" y="${n(ty(b)) - 8}" text-anchor="${anchor}" font-size="12.5" fill="${C.ink}">${t}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ${F}><rect width="${w}" height="${h}" fill="${C.bg}"/><text x="${L}" y="24" font-size="16" font-weight="700" fill="${C.ink}">${title}</text>${grid}<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="none" stroke="#c9ced8"/>${lines}${legend}${marks}<text x="${L + pw / 2}" y="${h - 12}" text-anchor="middle" font-size="13" fill="${C.ink}">${xLabel}</text><text transform="translate(16,${T + ph / 2}) rotate(-90)" text-anchor="middle" font-size="13" fill="${C.ink}">${yLabel}</text></svg>`;
}
const range = (a, b, step) => { const r = []; for (let v = a; v <= b + 1e-9; v += step) r.push(+v.toFixed(4)); return r; };
const logRange = (a, b, k = 120) => range(0, k, 1).map(i => a * (b / a) ** (i / k));

// 묶음 막대 그래프
function bars({w = 720, h = 380, title, groups, labels, max}) {
  const L = 60, T = 60, B = 60, ph = h - T - B, gw = (w - L - 30) / groups.length, bw = 64, cols = [C.navy, C.amber];
  const ty = v => T + ph - v / max * ph;
  const grid = range(0, max, 10).map(v => `<line x1="${L}" x2="${w - 30}" y1="${ty(v)}" y2="${ty(v)}" stroke="${C.grid}"/><text x="${L - 8}" y="${ty(v) + 4}" text-anchor="end" font-size="12" fill="${C.muted}">${v}</text>`).join('');
  const body = groups.map(([name, ...vals], g) => vals.map((v, i) => { const x = L + g * gw + gw / 2 - bw + i * bw + 4; return `<rect x="${x}" y="${ty(v)}" width="${bw - 8}" height="${ty(0) - ty(v)}" rx="4" fill="${cols[i]}"/><text x="${x + (bw - 8) / 2}" y="${ty(v) - 7}" text-anchor="middle" font-size="15" font-weight="700" fill="${C.ink}">${v}</text>`; }).join('') + `<text x="${L + g * gw + gw / 2}" y="${h - 30}" text-anchor="middle" font-size="13" fill="${C.ink}">${name}</text>`).join('');
  const legend = labels.map((l, i) => `<rect x="${w - 190 + i * 80}" y="16" width="14" height="14" rx="3" fill="${cols[i]}"/><text x="${w - 170 + i * 80}" y="28" font-size="13" fill="${C.ink}">${l}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ${F}><rect width="${w}" height="${h}" fill="${C.bg}"/><text x="${L}" y="28" font-size="16" font-weight="700" fill="${C.ink}">${title}</text>${legend}${grid}${body}</svg>`;
}

// IEC 61672-1 A·C 가중 곡선 식
const ra = f => (12194 ** 2 * f ** 4) / ((f * f + 20.6 ** 2) * Math.sqrt((f * f + 107.7 ** 2) * (f * f + 737.9 ** 2)) * (f * f + 12194 ** 2));
const rc = f => (12194 ** 2 * f * f) / ((f * f + 20.6 ** 2) * (f * f + 12194 ** 2));
const A = f => 20 * Math.log10(ra(f)) + 2.0, Cw = f => 20 * Math.log10(rc(f)) + 0.06;
const fTicks = [[20], [50], [100], [200], [500], [1000, '1k'], [2000, '2k'], [5000, '5k'], [10000, '10k'], [20000, '20k']];

// 오디오그램 틀에 난청 정도 구간을 칠한 그림 (세로축 위가 작은 소리)
function audioBands({w = 720, h = 460, title, bands, box}) {
  const L = 64, R = 150, T = 50, B = 50, pw = w - L - R, ph = h - T - B, f0 = 125, f1 = 8000, d0 = -10, d1 = 120;
  const tx = f => L + Math.log2(f / f0) / Math.log2(f1 / f0) * pw, ty = d => T + (d - d0) / (d1 - d0) * ph;
  const cols = ['#e3f1ee', '#f3f0e2', '#f6e8d2', '#f3dcc0', '#efcfb0', '#e9c0a3', '#e2b096'];
  const fills = bands.map(([a, b, t], i) => `<rect x="${L}" y="${n(ty(a))}" width="${pw}" height="${n(ty(b) - ty(a))}" fill="${cols[i]}"/><text x="${L + pw + 8}" y="${n((ty(a) + ty(b)) / 2) + 4}" font-size="12.5" fill="${C.ink}">${t}</text>`).join('');
  const fx = [125, 250, 500, 1000, 2000, 4000, 8000].map(f => `<line x1="${n(tx(f))}" x2="${n(tx(f))}" y1="${T}" y2="${T + ph}" stroke="#c9ced8"/><text x="${n(tx(f))}" y="${T - 8}" text-anchor="middle" font-size="12" fill="${C.muted}">${f >= 1000 ? f / 1000 + 'k' : f}</text>`).join('');
  const dy = range(-10, 120, 10).map(d => `<line x1="${L}" x2="${L + pw}" y1="${n(ty(d))}" y2="${n(ty(d))}" stroke="#d6dae2" stroke-width="0.7"/><text x="${L - 8}" y="${n(ty(d)) + 4}" text-anchor="end" font-size="12" fill="${C.muted}">${d}</text>`).join('');
  const bx = box ? `<rect x="${n(tx(box[0]))}" y="${n(ty(box[2]))}" width="${n(tx(box[1]) - tx(box[0]))}" height="${n(ty(box[3]) - ty(box[2]))}" fill="none" stroke="${C.navy}" stroke-width="2" stroke-dasharray="7 6"/><text x="${n(tx(box[0])) + 6}" y="${n(ty(box[3])) - 6}" font-size="12.5" fill="${C.navy}">${box[4]}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ${F}><rect width="${w}" height="${h}" fill="${C.bg}"/><text x="${L}" y="24" font-size="16" font-weight="700" fill="${C.ink}">${title}</text>${fills}${dy}${fx}<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="none" stroke="#9aa1b0"/>${bx}<text x="${L + pw / 2}" y="${h - 14}" text-anchor="middle" font-size="13" fill="${C.ink}">주파수 (Hz) · 왼쪽 낮은 음, 오른쪽 높은 음</text><text transform="translate(16,${T + ph / 2}) rotate(-90)" text-anchor="middle" font-size="13" fill="${C.ink}">청력 레벨 (dB HL) · 아래로 갈수록 큰 소리</text></svg>`;
}

export const figures = {
  'helmholtz-resonance-bottle': [{
    file: 'helmholtz-bottle-volume.svg', after: 4,
    alt: '병 안 공기 부피와 공명 주파수. 공기가 646cm³일 때 약 174~178Hz이고, 공기가 줄수록 주파수가 가파르게 올라 96cm³에서 계산 약 451Hz, 측정 496Hz',
    caption: 'HyperPhysics 헬름홀츠 식 f = v ÷ (2π) × √(A ÷ (V × L))에 계산기 기본값(입구 3.63cm², 목 5.6cm, 소리 속도 345m/s)을 넣어 그린 계산선과, 같은 자료에 실린 20온스 플라스틱 콜라병 측정값(물을 부어 공기 부피를 줄이며 잰 값)을 함께 그렸어요. 공기가 적을 때 측정값이 계산보다 높게 나와요.',
    svg: chart({title: '병 속 공기 부피가 줄면 음이 올라가요', x: [80, 660], y: [100, 520], xTicks: [100, 200, 300, 400, 500, 600].map(v => [v]), yTicks: [100, 200, 300, 400, 500], xLabel: '병 안 공기 부피 (cm³)', yLabel: '공명 주파수 (Hz)',
      series: [{label: '계산 (HyperPhysics 식)', color: C.navy, pts: range(90, 660, 5).map(v => [v, 345 / (2 * Math.PI) * Math.sqrt(3.63e-4 / (v * 1e-6 * 0.055956))])}, {label: '측정 (콜라병 실험)', color: C.amber, dash: true, pts: [[646, 178], [596, 184], [546, 192], [496, 202], [446, 214], [396, 229], [346, 244], [296, 268], [246, 294], [196, 340], [171, 364], [146, 406], [121, 445], [96, 496]]}],
      notes: [[646, 178, '빈 병: 178Hz', 'end'], [171, 364, '171cm³: 364Hz'], [96, 496, '96cm³: 496Hz']]})
  }],
  'sudden-hearing-loss': [{
    file: 'sudden-hearing-loss-criterion.svg', after: 1,
    alt: '250Hz부터 8000Hz까지 청력 레벨을 그린 설명용 예시. 평소 청력선은 10dB HL로 평평하고, 갑자기 떨어진 뒤 선은 2000·4000·8000Hz에서 45dB HL로 내려가 세 주파수 모두 30dB 넘게 나빠졌다',
    caption: '진단 기준(72시간 안, 연속된 세 주파수에서 30dB 이상)을 보여 주려고 그린 설명용 예시예요. 실제 사람의 검사 결과가 아니에요. 세로축 아래로 갈수록 큰 소리를 들려줘야 들린다는 뜻이고, 2000·4000·8000Hz 세 곳이 평소보다 35dB씩 나빠져 기준에 해당하는 모양이에요.',
    svg: chart({title: '돌발성 난청 기준을 오디오그램에 그려 보면 (설명용 예시)', x: [250, 8000], xLog: true, y: [-80, 0], xTicks: [[250], [500], [1000, '1k'], [2000, '2k'], [4000, '4k'], [8000, '8k']], yTicks: [0, -10, -20, -30, -40, -50, -60, -70, -80].map(v => [v, -v]), xLabel: '주파수 (Hz)', yLabel: '청력 레벨 (dB HL, 아래로 갈수록 나쁨)',
      series: [{label: '평소 청력(예시)', color: C.teal, pts: [[250, -10], [500, -10], [1000, -10], [2000, -10], [4000, -10], [8000, -10]]}, {label: '갑자기 떨어진 뒤(예시)', color: C.amber, dash: true, pts: [[250, -10], [500, -10], [1000, -15], [2000, -45], [4000, -45], [8000, -45]]}],
      notes: [[2000, -45, '2k·4k·8k: 35dB씩 떨어짐', 'end']]})
  }],
  'sound-masking-speech-privacy': [{
    file: 'sound-masking-levels.svg', after: 3,
    alt: '사무실 배경 소리 기준값 막대그래프. 35dBA 미만은 대부분 알아채지 못함, 약 45dBA까지 대체로 받아들임, GSA 개방형 사무실 마스킹 권장 상한 48dBA, 50dBA를 넘으면 대체로 받아들이기 어려움',
    caption: 'NRC Canadian Building Digest 139의 배경 소리 기준(35·45·50dBA)과 GSA ‘Sound Matters’의 개방형 사무실 마스킹 권장값(45~48dBA 중 상한 48)을 그대로 막대로 옮겼어요. 사람마다 받아들이는 정도는 달라요.',
    svg: bars({title: '사무실 배경 소리 기준값 (dBA)', groups: [['거의 못 느낌(미만)', 35], ['대체로 받아들임', 45], ['GSA 마스킹 상한', 48], ['대체로 불만(초과)', 50]], labels: ['기준값'], max: 60})
  }],
  'phon-sone-loudness': [{
    file: 'phon-sone-curve.svg', after: 2,
    alt: '크기 레벨(폰)에 따른 크기(손) 그래프. 40폰 1손, 50폰 2손, 60폰 4손, 80폰 16손, 100폰 64손으로 10폰마다 두 배씩 가파르게 올라감',
    caption: 'HyperPhysics가 소개한 경험칙(40폰 = 1손, 10폰 오를 때마다 크기 두 배)을 손 = 2^((폰 − 40) ÷ 10) 식으로 직접 계산해 그렸어요. 같은 소리를 키울 때의 대략적인 값이고, 사람과 소리에 따라 실제 지각은 달라요.',
    svg: chart({title: '폰이 10 오를 때마다 손은 두 배', x: [40, 100], y: [0, 70], xTicks: range(40, 100, 10).map(v => [v]), yTicks: [0, 16, 32, 48, 64], xLabel: '크기 레벨 (폰)', yLabel: '크기 (손)',
      series: [{label: '손 = 2^((폰 − 40) ÷ 10)', color: C.navy, pts: range(40, 100, 1).map(p => [p, 2 ** ((p - 40) / 10)])}],
      notes: [[40, 1, '40폰: 1손'], [60, 4, '60폰: 4손'], [80, 16, '80폰: 16손', 'end'], [100, 64, '100폰: 64손', 'end']]})
  }],
  'earplug-nrr-rating': [{
    file: 'earplug-nrr-derating.svg', after: 3,
    alt: 'NRR 20, 25, 29, 33인 청력 보호구를 dBA 소음에서 쓸 때 OSHA 식으로 계산한 차음량. 7dB를 뺀 값은 13, 18, 22, 26dB이고 50% 보정하면 6.5, 9, 11, 13dB',
    caption: 'OSHA 기술 매뉴얼 부록 F의 식으로 직접 계산한 값이에요. 남색은 NRR − 7, 주황색은 (NRR − 7) × 50%예요. 주변 소음을 dBA로 쟀을 때 귀 안의 소리가 몇 dB 줄어드는지 추정한 계산 예시이고, 착용 상태에 따라 실제 값은 달라요.',
    svg: bars({title: 'NRR별 추정 차음량 (dBA 소음 기준, dB)', groups: [['NRR 20', 13, 6.5], ['NRR 25', 18, 9], ['NRR 29', 22, 11], ['NRR 33', 26, 13]], labels: ['7dB 뺀 값', '50% 보정'], max: 30})
  }],
  'highway-noise-barrier': [{
    file: 'noise-barrier-energy.svg', after: 2,
    alt: '방음벽 삽입손실별로 줄어드는 소리 에너지 비율 막대그래프. 5dB 68%, 10dB 90%, 15dB 97%, 20dB 99%',
    caption: 'FHWA 방음벽 설계 지침 3장 표의 에너지 감소율을 막대로 옮겼어요. 1 − 10^(−삽입손실 ÷ 10) 식으로 직접 계산해도 같은 값(68.4%, 90%, 96.8%, 99%)이 나와요. 귀에 들리는 크기는 10dB에서 절반, 20dB에서 4분의 1이에요.',
    svg: bars({title: '방음벽 삽입손실별 줄어드는 소리 에너지 (%)', groups: [['5dB', 68], ['10dB', 90], ['15dB', 97], ['20dB', 99]], labels: ['에너지 감소율'], max: 100})
  }],
  'sound-interference-noise-cancelling': [{
    file: 'interference-phase.svg', after: 1,
    alt: '크기와 주파수가 같은 두 소리를 위상차 0도부터 180도까지 어긋나게 더했을 때 하나일 때보다 몇 dB 커지거나 작아지는지 보여 주는 그래프. 0도 +6dB, 90도 +3dB, 120도 0dB, 150도 −5.7dB, 170도 −15.2dB로 180도에 가까울수록 급격히 작아져요',
    caption: 'Russell 교수 해설의 식(합친 진폭 = 2 × cos(위상차 ÷ 2))을 20 × log₁₀로 바꿔 직접 계산해 그렸어요. 크기와 주파수가 같은 두 순음을 가정했고, 세로축 0dB는 소리 하나일 때예요. 180°에서는 이론상 완전히 사라지지만 그래프는 −30dB에서 잘랐어요.',
    svg: chart({title: '같은 소리 두 개를 어긋나게 겹치면', x: [0, 180], y: [-30, 10], xTicks: range(0, 180, 30).map(v => [v, v + '°']), yTicks: [-30, -20, -10, 0, 6, 10], xLabel: '두 소리의 위상차', yLabel: '소리 하나일 때와 비교 (dB)',
      series: [{label: '합친 소리', color: C.navy, pts: range(0, 179.4, 0.6).map(p => [p, Math.max(-30, 20 * Math.log10(2 * Math.cos(p * Math.PI / 360)))])}, {label: '소리 하나 (0dB)', color: C.muted, dash: true, pts: [[0, 0], [180, 0]]}],
      notes: [[0, 6.02, '0°: +6dB'], [90, 3.01, '90°: +3dB'], [120, 0, '120°: 0dB', 'end'], [150, -5.72, '150°: −5.7dB', 'end'], [170, -15.2, '170°: −15.2dB', 'end']]})
  }],
  'room-modes-standing-waves': [{
    file: 'room-mode-pressure.svg', after: 3,
    alt: '길이 5m 방에서 34.3Hz, 68.6Hz, 102.9Hz 공명의 음압 크기 그래프. 세 곡선 모두 양쪽 벽에서 최대이고 34.3Hz는 2.5m, 68.6Hz는 1.25m와 3.75m, 102.9Hz는 약 0.83m·2.5m·4.17m에서 0이 됨',
    caption: '양 끝이 단단한 벽인 길이 5m 공간의 공명 주파수(n × 343 ÷ 10)에서, 음압 크기를 |cos(n × π × 위치 ÷ 5)|로 직접 계산해 그렸어요. 벽에서의 값을 1로 둔 상대값이고, 벽의 흡음과 다른 방향의 공명은 넣지 않은 계산 예시예요.',
    svg: chart({title: '길이 5m 방의 위치별 음압 크기 (계산 예시)', x: [0, 5], y: [0, 1.1], xTicks: range(0, 5, 1).map(v => [v]), yTicks: [0, 0.5, 1], xLabel: '한쪽 벽에서 잰 거리 (m)', yLabel: '음압 크기 (벽 = 1)',
      series: [1, 2, 3].map((k, i) => ({label: ['34.3Hz (n=1)', '68.6Hz (n=2)', '102.9Hz (n=3)'][i], color: [C.navy, C.amber, C.teal][i], pts: range(0, 5, 0.02).map(v => [v, Math.abs(Math.cos(k * Math.PI * v / 5))])})),
      notes: [[2.5, 0, '한가운데: 34.3·102.9Hz 마디']]})
  }],
  'sound-meter-app-accuracy': [{
    file: 'sound-app-device-diff.svg', after: 2,
    alt: '같은 소음 측정 앱 10개를 iOS 기기 4종에서 돌렸을 때 기준 마이크와의 평균 차이. 아이폰 3GS 0.4·0.7, 아이폰 4S 0.8·2.6, 아이폰 5 3.6·4.8, 아이패드 4세대 2.7·5.4 데시벨',
    caption: 'NIOSH 2014년 논문(Kardous·Shaw) 표 3의 기기별 평균 차이를 부호를 떼고 크기만 소수 첫째 자리로 옮겼어요. 잔향실에서 65~95dB 핑크 노이즈로, 교정하지 않은 앱 10개를 기기마다 돌린 평균이에요.',
    svg: bars({title: '기기별 기준 마이크와의 평균 차이 (dB)', groups: [['아이폰 3GS', 0.4, 0.7], ['아이폰 4S', 0.8, 2.6], ['아이폰 5', 3.6, 4.8], ['아이패드 4세대', 2.7, 5.4]], labels: ['보정 없음', 'A특성'], max: 10})
  }],
  'who-environmental-noise-guidelines': [{
    file: 'who-noise-guideline-levels.svg', after: 2,
    alt: 'WHO 환경소음 가이드라인 권고값. 도로 Lden 53·Lnight 45, 철도 54·44, 항공기 45·40, 풍력발전기 Lden 45 데시벨이고 풍력의 밤 권고값은 없음',
    caption: 'WHO 유럽지역사무소 환경소음 가이드라인(2018)의 소음원별 권고값을 그대로 막대로 옮겼어요. 풍력발전기는 밤 근거가 부족해 Lnight 권고값이 없어요. 여가 소음(1년 평균 LAeq,24h 70dB)은 지표가 달라 넣지 않았어요.',
    svg: bars({title: 'WHO 소음원별 권고값 (dB)', groups: [['도로', 53, 45], ['철도', 54, 44], ['항공기', 45, 40], ['풍력발전기', 45]], labels: ['Lden', 'Lnight'], max: 60})
  }],
  'doppler-effect': [{
    file: 'doppler-shift.svg', after: 2,
    alt: '440Hz 음을 내는 물체의 속도가 초속 0에서 100m로 빨라질 때 다가오면 들리는 주파수는 620Hz까지 오르고, 멀어지면 341Hz까지 내려가는 그래프',
    caption: 'HyperPhysics 식(440 × 343.7 ÷ (343.7 ∓ 움직이는 속도))으로 직접 계산해 그렸어요. 기온 20℃, 듣는 사람은 서 있고 소리를 내는 물체가 곧장 다가오거나 멀어지는 경우예요. 다가올 때 올라가는 폭이 멀어질 때 내려가는 폭보다 커요.',
    svg: chart({title: '움직이는 속도에 따라 들리는 440Hz 음', x: [0, 100], y: [300, 650], xTicks: range(0, 100, 20).map(v => [v]), yTicks: [300, 350, 400, 450, 500, 550, 600, 650], xLabel: '소리를 내는 물체의 속도 (m/s)', yLabel: '들리는 주파수 (Hz)',
      series: [{label: '다가올 때', color: C.navy, pts: range(0, 100, 1).map(v => [v, 440 * 343.7 / (343.7 - v)])}, {label: '멀어질 때', color: C.amber, pts: range(0, 100, 1).map(v => [v, 440 * 343.7 / (343.7 + v)])}, {label: '원래 음 440Hz', color: C.muted, dash: true, pts: [[0, 440], [100, 440]]}],
      notes: [[25, 474.5, '25m/s: 약 474Hz'], [25, 410.2, '25m/s: 약 410Hz'], [100, 620.5, '100m/s: 약 620Hz', 'end']]})
  }],
  'environmental-noise-standard': [{
    file: 'environmental-noise-standard.svg', h: 274, after: 2,
    alt: '소음 환경기준 낮과 밤 값. 일반 가지역 50·40, 나지역 55·45, 다지역 65·55, 라지역 70·65, 도로변 가·나지역 65·55, 다지역 70·60, 라지역 75·70 데시벨',
    caption: '환경정책기본법 시행령 소음 환경기준(국가소음정보시스템 게재 표)의 Leq dB(A) 값을 그대로 막대로 옮겼어요. 왼쪽 네 묶음은 일반 지역, 오른쪽 세 묶음은 차선 2개 이상 도로 옆의 도로변 지역이에요.',
    svg: bars({w: 1000, title: '소음 환경기준 (단위 Leq dB(A))', groups: [['가', 50, 40], ['나', 55, 45], ['다', 65, 55], ['라', 70, 65], ['도로변 가·나', 65, 55], ['도로변 다', 70, 60], ['도로변 라', 75, 70]], labels: ['낮', '밤'], max: 80})
  }],
  'speed-of-sound-temperature': [{
    file: 'sound-speed-temp.svg', after: 1,
    alt: '영하 20도부터 40도까지 공기 중 소리 속도. 기온이 오를수록 거의 직선으로 빨라져 0도 약 331m/s, 20도 약 343m/s, 35도 약 352m/s',
    caption: 'HyperPhysics 정밀식(20.05 × √(기온 + 273.15))과 어림식(331.4 + 0.6 × 기온)으로 직접 계산해 그렸어요. 마른 공기 기준이고, 사람이 지내는 기온 범위에서는 두 선이 거의 겹쳐요.',
    svg: chart({title: '기온에 따른 공기 중 소리 속도', x: [-20, 40], y: [315, 360], xTicks: range(-20, 40, 10).map(v => [v, v + '℃']), yTicks: [320, 330, 340, 350, 360], xLabel: '기온 (℃)', yLabel: '소리 속도 (m/s)',
      series: [{label: '정밀식 (HyperPhysics)', color: C.navy, pts: range(-20, 40, 1).map(t => [t, 20.0514 * Math.sqrt(t + 273.15)])}, {label: '어림식 331.4 + 0.6T', color: C.amber, dash: true, pts: range(-20, 40, 1).map(t => [t, 331.4 + 0.6 * t])}],
      notes: [[0, 331.4, '0℃: 약 331m/s'], [20, 343.2, '20℃: 약 343m/s'], [35, 352.0, '35℃: 약 352m/s', 'end']]})
  }],
  'audiogram-reading': [{
    file: 'audiogram-degrees.svg', after: 3,
    alt: '125Hz부터 8000Hz까지의 오디오그램 틀에 ASHA 난청 정도 구간을 위에서 아래로 칠한 그림. 위쪽 −10~15dB가 정상, 아래로 갈수록 경미·경도·중등도·중등고도·고도·심도',
    caption: 'ASHA 일반인 안내의 난청 정도 표(dB HL)를 오디오그램 틀에 그대로 옮겨 그렸어요. 세로축은 위가 작은 소리라서 점이 아래 구간에 찍힐수록 난청 정도가 커요. 점선 상자는 ASHA가 설명한 영어 말소리 범위(250~4000Hz, 20~60dB)를 사각형으로 단순하게 표시한 것이고, 실제 말소리 바나나는 곡선 모양이에요.',
    svg: audioBands({title: '오디오그램에서 난청 정도 구간 (ASHA 기준)', bands: [[-10, 15, '정상 −10~15'], [15, 25, '경미 16~25'], [25, 40, '경도 26~40'], [40, 55, '중등도 41~55'], [55, 70, '중등고도 56~70'], [70, 90, '고도 71~90'], [90, 120, '심도 91 이상']], box: [250, 4000, 20, 60, '말소리 범위(대략)']})
  }],
  'decibel-basics': [{src: '/images/calc-sum-60-60.png', file: 'calc-sum-60-60.png', h: 846, after: 2, alt: '근처소리 데시벨 계산기에 60dB와 60dB를 넣자 합친 크기 63dB가 나온 화면', caption: '근처소리 데시벨 계산기에 60dB 두 개를 넣고 직접 캡처한 화면이에요. 합친 크기는 120dB가 아니라 63dB로 나와요.'}, {
    file: 'db-sum.svg', after: 3,
    alt: '두 소리의 데시벨 차이가 0일 때 3dB, 10dB일 때 약 0.4dB만 더해진다는 것을 보여 주는 그래프',
    caption: '큰 소리에 작은 소리를 더하면 몇 dB가 늘어날까요. 10·log10(10^(L1/10)+10^(L2/10)) 식으로 직접 계산해 그렸어요. 두 소리가 같으면 3dB, 10dB 넘게 차이 나면 0.4dB 아래로 거의 늘지 않아요.',
    svg: chart({title: '두 소리를 더할 때 늘어나는 양', x: [0, 20], y: [0, 3.5], xTicks: range(0, 20, 2).map(v => [v]), yTicks: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], xLabel: '두 소리의 차이 (dB)', yLabel: '큰 소리보다 늘어나는 양 (dB)',
      series: [{label: '합친 소리 − 큰 소리', color: C.navy, pts: range(0, 20, 0.25).map(d => [d, 10 * Math.log10(1 + 10 ** (-d / 10))])}],
      notes: [[0, 3.01, '같은 크기: +3.0dB'], [6, 0.97, '6dB 차이: +1.0dB'], [10, 0.41, '10dB 차이: +0.4dB']]})
  }],
  'a-weighting-dba': [{
    file: 'a-c-weighting.svg', after: 2,
    alt: '20Hz부터 20kHz까지 A가중과 C가중 곡선. A가중은 저음에서 크게 깎이고 C가중은 거의 평평하다',
    caption: 'IEC 61672-1에 나온 A·C 가중 식으로 직접 계산해 그린 곡선이에요. 1kHz에서 둘 다 0dB이고, 100Hz에서 A가중은 약 −19dB, C가중은 약 −0.3dB예요. 저음이 많은 소리는 dB(A)로 재면 작게 나오는 이유예요.',
    svg: chart({title: '주파수별 가중치: A가중과 C가중', x: [20, 20000], xLog: true, y: [-60, 10], xTicks: fTicks, yTicks: [-60, -50, -40, -30, -20, -10, 0, 10], xLabel: '주파수 (Hz)', yLabel: '가중치 (dB)',
      series: [{label: 'A가중 dB(A)', color: C.navy, pts: logRange(20, 20000).map(f => [f, A(f)])}, {label: 'C가중 dB(C)', color: C.amber, dash: true, pts: logRange(20, 20000).map(f => [f, Cw(f)])}],
      notes: [[100, A(100), `100Hz: A ${A(100).toFixed(1)}dB`], [1000, 0, '1kHz: 0dB']]})
  }],
  'frequency-hearing-range': [{
    file: 'octave-waves.svg', after: 3,
    alt: '220Hz와 한 옥타브 위인 440Hz 사인파를 10밀리초 동안 겹쳐 그린 그림. 440Hz는 같은 시간에 두 배 많이 진동한다',
    caption: '220Hz와 440Hz 사인파를 같은 10ms 구간에 그렸어요. 주파수가 두 배(한 옥타브)가 되면 같은 시간에 두 배 더 많이 떨려요. 소리 속도를 20℃ 기준 초속 344m로 잡으면 파장은 220Hz가 약 1.56m, 440Hz가 약 0.78m예요(계산 예시).',
    svg: chart({title: '한 옥타브 차이: 220Hz와 440Hz', x: [0, 10], y: [-1.3, 1.3], xTicks: range(0, 10, 1).map(v => [v]), yTicks: [-1, 0, 1], xLabel: '시간 (ms)', yLabel: '공기 압력 변화 (상대값)',
      series: [{label: '220Hz', color: C.navy, pts: range(0, 10, 0.02).map(t => [t, Math.sin(2 * Math.PI * 220 * t / 1000)])}, {label: '440Hz (한 옥타브 위)', color: C.amber, pts: range(0, 10, 0.02).map(t => [t, 0.75 * Math.sin(2 * Math.PI * 440 * t / 1000)])}]})
  }],
  'sound-distance': [{src: '/images/calc-dist-80-1-8.png', file: 'calc-dist-80-1-8.png', h: 1106, after: 1, alt: '근처소리 데시벨 계산기에 1m에서 80dB, 새 거리 8m를 넣자 약 61.9dB가 나온 화면', caption: '1m에서 80dB인 소리를 8m에서 들으면 어떨까요. 근처소리 계산기에 넣고 직접 캡처한 화면이에요. 거리가 두 배씩 세 번 늘어 약 18dB 줄어든 61.9dB로 나와요(점음원, 반사 없는 바깥 기준).'}, {
    file: 'distance-decay.svg', after: 2,
    alt: '1m에서 80dB인 점음원과 선음원이 거리에 따라 줄어드는 그래프. 점음원은 거리 두 배마다 6dB, 선음원은 3dB 줄어든다',
    caption: '1m에서 80dB라고 가정하고 계산한 예시예요. 점음원은 20·log10(거리비), 선음원은 10·log10(거리비)만큼 줄여 그렸어요. 반사가 없는 이상적인 바깥 공간 기준이라 실제 측정값과는 다를 수 있어요.',
    svg: chart({title: '거리에 따른 소리 크기 (계산 예시)', x: [1, 64], xLog: true, y: [40, 85], xTicks: [[1], [2], [4], [8], [16], [32], [64]], yTicks: [40, 50, 60, 70, 80], xLabel: '음원과의 거리 (m)', yLabel: '소리 크기 (dB)',
      series: [{label: '점음원 (−6dB/두 배)', color: C.navy, pts: logRange(1, 64).map(r => [r, 80 - 20 * Math.log10(r)])}, {label: '선음원 (−3dB/두 배)', color: C.amber, dash: true, pts: logRange(1, 64).map(r => [r, 80 - 10 * Math.log10(r)])}],
      notes: [[2, 74, '2m: 74dB'], [8, 62, '8m: 62dB'], [8, 71, '8m: 71dB', 'end']]})
  }],
  'reverberation-time': [{
    file: 'rt60-decay.svg', after: 2,
    alt: '50세제곱미터 방의 계산 예시. 빈 방은 2.1초, 카펫을 깔면 0.72초, 커튼까지 달면 0.54초 만에 소리가 60dB 줄어든다',
    caption: '위 계산 예시의 세 경우를 그래프로 옮겼어요. 소리를 멈춘 뒤 60dB 줄어들 때까지 걸리는 시간이 잔향시간이에요. 세이빈 공식은 소리가 일정하게 줄어든다고 보기 때문에 직선으로 그렸고, 실제 방에서 재면 선이 울퉁불퉁하게 나와요.',
    svg: chart({title: '같은 방, 흡음량에 따라 달라지는 잔향시간 (계산 예시)', x: [0, 2.4], y: [-70, 0], xTicks: range(0, 2.4, 0.4).map(v => [v, v.toFixed(1)]), yTicks: [-70, -60, -50, -40, -30, -20, -10, 0], xLabel: '소리가 멈춘 뒤 지난 시간 (초)', yLabel: '처음보다 줄어든 양 (dB)',
      series: [{label: '빈 방 2.1초', color: C.navy, pts: [[0, 0], [2.4, -60 * 2.4 / 2.1]]}, {label: '카펫 0.72초', color: C.amber, dash: true, pts: [[0, 0], [0.84, -70]]}, {label: '+커튼 0.54초', color: C.teal, pts: [[0, 0], [0.63, -70]]}],
      notes: [[2.1, -60, '2.1초', 'end'], [0.72, -60, '0.72초'], [0.54, -60, '0.54초', 'end']]})
  }],
  'floor-noise-standard': [{
    file: 'floor-noise-limits.svg', after: 1,
    alt: '층간소음 기준값 막대그래프. 직접충격 1분 등가 주간 39 야간 34, 최고 주간 57 야간 52, 공기전달 5분 등가 주간 45 야간 40 dB(A)',
    caption: '「공동주택 층간소음의 범위와 기준에 관한 규칙」 별표(2023. 1. 2. 시행)에 나온 기준값을 막대로 옮겼어요. 주간은 06:00~22:00, 야간은 22:00~06:00이에요. 오래된 공동주택 보정값은 반영하지 않았어요.',
    svg: bars({title: '층간소음 기준 (단위 dB(A))', groups: [['직접충격 1분 등가', 39, 34], ['직접충격 최고', 57, 52], ['공기전달 5분 등가', 45, 40]], labels: ['주간', '야간'], max: 60})
  }],
  'soundproofing-vs-absorption': [{
    file: 'absorb-vs-block.svg', after: 2,
    alt: '벽에 닿은 소리가 반사, 흡수, 투과로 나뉘는 모습을 그린 도식. 흡음은 반사를 줄이고 차음은 투과를 줄인다',
    caption: '벽에 닿은 소리는 일부는 되돌아오고(반사), 일부는 벽 속에서 열로 바뀌고(흡수), 일부는 벽을 지나 옆방으로 가요(투과). 흡음은 방 안으로 되돌아오는 소리를, 차음은 옆방으로 넘어가는 소리를 줄이는 일이에요. 이해를 돕기 위해 직접 그린 도식이에요.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" ${F}><defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" fill="context-stroke"/></marker></defs><rect width="720" height="360" fill="${C.bg}"/><text x="40" y="34" font-size="16" font-weight="700" fill="${C.ink}">벽에 닿은 소리는 세 갈래로 나뉘어요</text><text x="150" y="70" text-anchor="middle" font-size="14" fill="${C.muted}">내 방</text><text x="590" y="70" text-anchor="middle" font-size="14" fill="${C.muted}">옆방</text><rect x="330" y="80" width="70" height="250" fill="#d9dde6"/><rect x="330" y="80" width="18" height="250" fill="#f0d8ac"/><text x="365" y="350" text-anchor="middle" font-size="12" fill="${C.muted}">벽 (왼쪽 노란 면 = 흡음재)</text><path d="M60 130 C160 150 250 175 326 200" stroke="${C.navy}" stroke-width="5" fill="none" marker-end="url(#a)"/><text x="60" y="118" font-size="14" fill="${C.ink}">들어오는 소리</text><path d="M326 215 C250 245 170 270 80 290" stroke="${C.amber}" stroke-width="4" fill="none" marker-end="url(#a)"/><text x="70" y="314" font-size="14" fill="${C.ink}">반사 → 흡음으로 줄여요</text><path d="M342 205 q8 -18 16 0 t16 0" stroke="${C.teal}" stroke-width="3" fill="none"/><text x="365" y="180" text-anchor="middle" font-size="13" fill="${C.ink}">흡수(열)</text><path d="M404 205 C470 205 530 205 640 205" stroke="${C.navy}" stroke-width="2.5" stroke-dasharray="6 5" fill="none" marker-end="url(#a)"/><text x="420" y="240" font-size="14" fill="${C.ink}">투과 → 차음으로 줄여요</text><text x="420" y="262" font-size="12" fill="${C.muted}">무겁고 틈 없는 벽일수록 적게 넘어가요</text></svg>`
  }],
  'safe-listening-earphones': [{
    file: 'who-weekly-allowance.svg', after: 1,
    alt: 'WHO 기준 소리 크기별 일주일 허용 시간 그래프. 성인은 80dB에서 40시간, 3dB 오를 때마다 절반으로 줄고 어린이 기준은 75dB에서 40시간이다',
    caption: 'WHO 안전한 듣기 기준(성인 80dB로 주 40시간, 어린이·민감한 사람 75dB로 주 40시간)에서 3dB 오를 때마다 시간이 절반이 되도록 계산해 그렸어요. 점은 WHO 안내에 실린 값이에요. 세로축은 눈금 하나마다 4배씩 커지는 로그 눈금이에요.',
    svg: chart({title: '소리 크기별 일주일 허용 시간 (WHO 기준)', x: [75, 120], y: [1 / 360, 64], yLog: true, xTicks: range(75, 120, 5).map(v => [v]), yTicks: [[0.002777777777777778,"10초"],[0.016666666666666666,"1분"],[0.25,"15분"],[1,"1시간"],[4,"4시간"],[16,"16시간"],[64,"64시간"]], xLabel: '소리 크기 (dB)', yLabel: '일주일 허용 시간',
      series: [{label: '성인 (80dB · 주 40시간)', color: C.navy, pts: range(75, 120, 0.5).map(L => [L, 40 / 2 ** ((L - 80) / 3)]).filter(p => p[1] <= 64)}, {label: '어린이·민감한 사람 (75dB)', color: C.amber, dash: true, pts: range(75, 120, 0.5).map(L => [L, 40 / 2 ** ((L - 75) / 3)]).filter(p => p[1] >= 1 / 360)}],
      notes: [[80, 40, '80dB: 40시간'], [90, 4, '90dB: 4시간'], [100, 1 / 3, '100dB: 20분'], [110, 1 / 24, '110dB: 2분 30초']]})
  }],
  'noise-exposure-time': [{src: '/images/calc-time-94.png', file: 'calc-time-94.png', h: 750, after: 2, alt: '근처소리 데시벨 계산기에 94dBA를 넣자 하루 권고 노출 시간 약 1시간이 나온 화면', caption: '근처소리 계산기에 94dBA를 넣고 직접 캡처한 화면이에요. NIOSH 권고(85dBA 8시간, 3dB 교환율)로 계산하면 85dBA보다 9dB 높으니 8시간을 세 번 절반으로 나눈 1시간이 나와요.'}, {
    file: 'niosh-osha-time.svg', after: 3,
    alt: '소음 크기별 하루 허용 시간을 NIOSH 권고와 OSHA 기준으로 비교한 그래프. 100dBA에서 NIOSH는 15분, OSHA는 2시간이다',
    caption: 'NIOSH 권고(85dBA 8시간, 3dB마다 절반)와 OSHA 기준(90dBA 8시간, 5dB마다 절반)을 각 기준식으로 계산해 그렸어요. 같은 100dBA라도 NIOSH는 15분, OSHA는 2시간이라 8배 차이가 나요. 세로축은 로그 눈금이에요.',
    svg: chart({title: '하루 허용 노출 시간: NIOSH 권고와 OSHA 기준', x: [85, 115], y: [1 / 360, 16], yLog: true, xTicks: range(85, 115, 5).map(v => [v]), yTicks: [[0.002777777777777778,"10초"],[0.016666666666666666,"1분"],[0.25,"15분"],[1,"1시간"],[4,"4시간"],[16,"16시간"]], xLabel: '소음 크기 (dBA)', yLabel: '하루 허용 시간',
      series: [{label: 'NIOSH 권고 (3dB 교환율)', color: C.navy, pts: range(85, 115, 0.5).map(L => [L, 8 / 2 ** ((L - 85) / 3)])}, {label: 'OSHA 기준 (5dB 교환율)', color: C.amber, dash: true, pts: range(85, 115, 0.5).map(L => [L, 8 / 2 ** ((L - 90) / 5)])}],
      notes: [[85, 8, '85dBA: 8시간'], [100, 0.25, 'NIOSH 100dBA: 15분', 'end'], [100, 2, 'OSHA 100dBA: 2시간']]})
  }]
};
