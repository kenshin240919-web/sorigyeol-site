const $ = id => document.getElementById(id);
const num = id => parseFloat($(id).value);
const f1 = v => (Math.round(v * 10) / 10).toLocaleString('ko-KR');
function sum() {
  const a = num('sum-a'), b = num('sum-b');
  if (!isFinite(a) || !isFinite(b)) return $('sum-out').textContent = '두 값을 숫자로 넣어 주세요.';
  const t = 10 * Math.log10(10 ** (a / 10) + 10 ** (b / 10));
  $('sum-out').innerHTML = `합친 크기 <b>${f1(t)} dB</b> <small>(큰 소리보다 +${f1(t - Math.max(a, b))} dB)</small>`;
}
function dist() {
  const l = num('dist-l'), r1 = num('dist-r1'), r2 = num('dist-r2');
  if (!isFinite(l) || !(r1 > 0) || !(r2 > 0)) return $('dist-out').textContent = '거리는 0보다 큰 숫자로 넣어 주세요.';
  const d = 20 * Math.log10(r2 / r1);
  $('dist-out').innerHTML = `${f1(r2)}m에서 약 <b>${f1(l - d)} dB</b> <small>(${d >= 0 ? '−' : '+'}${f1(Math.abs(d))} dB)</small>`;
}
function time() {
  const l = num('time-l');
  if (!isFinite(l)) return $('time-out').textContent = '소음 크기를 숫자로 넣어 주세요.';
  const m = 480 / 2 ** ((l - 85) / 3);
  const txt = m >= 60 ? `${f1(m / 60)}시간` : m >= 1 ? `${f1(m)}분` : `${f1(m * 60)}초`;
  $('time-out').innerHTML = l < 85 ? `85dBA 아래예요. 권고 기준으로는 <b>8시간 넘게</b> 노출돼도 된다는 계산이 나와요 (${txt}).` : `하루 권고 노출 시간 약 <b>${txt}</b>`;
}
for (const [ids, fn] of [[['sum-a', 'sum-b'], sum], [['dist-l', 'dist-r1', 'dist-r2'], dist], [['time-l'], time]]) { ids.forEach(id => $(id).addEventListener('input', fn)); fn(); }
