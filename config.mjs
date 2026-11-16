// 사이트 공통 값. 도메인이 바뀌면 ORIGIN만 바꾸고 빌드하세요.
// GitHub 주소처럼 하위 경로가 있으면 optimize.mjs가 링크 앞에 BASE를 붙이고, 도메인이면 BASE가 비어 CNAME이 생깁니다.
export const ORIGIN = 'https://koreanearby.com';
export const BASE = new URL(ORIGIN).pathname.replace(/\/$/, '');
export const SITE = '소리결';
export const TAGLINE = '소리의 과학과 생활';
export const AUTHOR = '소리지기'; // 운영자 필명
export const EMAIL = 'ruri240919@gmail.com';
export const START = '2026-11-16'; // 사이트 공개일
// 소개 페이지의 '운영자 이야기'. 실제 운영자 이야기로만 채우세요(문단은 빈 줄로 구분). 비어 있으면 그 부분을 숨깁니다.
export const OPERATOR_STORY = '';
