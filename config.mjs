// 사이트 공통 값. 도메인이 바뀌면 ORIGIN만 바꾸고 빌드하세요.
// GitHub 주소처럼 하위 경로가 있으면 optimize.mjs가 링크 앞에 BASE를 붙이고, 도메인이면 BASE가 비어 CNAME이 생깁니다.
export const ORIGIN = 'https://koreanearby.com';
export const BASE = new URL(ORIGIN).pathname.replace(/\/$/, '');
export const SITE = '근처소리';
export const TAGLINE = '내 근처의 모든 소리';
export const AUTHOR = '소리지기'; // 운영자 필명
export const EMAIL = 'ruri240919@gmail.com';
export const START = '2026-11-16'; // 사이트 공개일
// 소개 페이지의 '운영자 이야기'. 실제 운영자 이야기로만 채우세요(문단은 빈 줄로 구분). 비어 있으면 그 부분을 숨깁니다.
export const OPERATOR_STORY = "안녕하세요, 근처소리를 운영하는 소리지기예요.\n\n어릴 때부터 내 근처에서 나는 소리에 관심이 많았어요. 가만히 앉아 있어도 귀는 쉬지 않아요. 창밖으로 차가 지나가고, 위층에서 발소리가 울리고, 이어폰에서는 음악이 흘러나오죠.\n\n소리에는 소음도 있고 음악도 있어요. 듣기 좋은 소리가 있으면 듣기 싫은 소리도 있고요. 같은 소리인데 누구에게는 편안하고 누구에게는 견디기 힘든 소음이 되기도 해요. 그 차이는 어디서 오는지, 소리는 어떻게 숫자로 재는지 찾아볼수록 궁금한 게 늘었어요. 소리는 그만큼 매력이 많은 분야예요.\n\n근처소리라는 이름에는 ‘내 근처에서 나는 모든 소리’를 다루겠다는 뜻을 담았어요. 비싼 음향 장비 이야기는 거의 하지 않을 거예요. 매일 듣는 소리를 조금 더 정확하게 알게 되는 글을 쓰려고 해요.";
