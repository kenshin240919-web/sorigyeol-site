// 사이트 공통 값. 도메인을 연결하면 ORIGIN을 'https://sorigyeol.com'처럼 바꾸고 빌드하세요.
// 지금은 GitHub 주소(하위 경로 /sorigyeol-site)라서 optimize.mjs가 링크 앞에 BASE를 붙입니다.
export const ORIGIN = 'https://kenshin240919-web.github.io/sorigyeol-site';
export const BASE = new URL(ORIGIN).pathname.replace(/\/$/, '');
export const SITE = '소리결';
export const TAGLINE = '소리의 과학과 생활';
export const AUTHOR = '소리지기'; // 운영자 필명
export const EMAIL = 'ruri240919@gmail.com';
export const START = '2026-11-16'; // 사이트 공개일
// 소개 페이지의 '운영자 이야기'. 실제 운영자 이야기로만 채우세요(문단은 빈 줄로 구분). 비어 있으면 그 부분을 숨깁니다.
export const OPERATOR_STORY = '';
