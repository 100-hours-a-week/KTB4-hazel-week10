# 테스트 작성 규칙

이 문서는 [Vitest](https://vitest.dev/)와 [Testing Library](https://testing-library.com/)의 공식 가이드를 이 저장소의 테스트 작성 기준으로 구체화한다.

## 1. F.I.R.S.T.와 TDD

- **Fast**: 빠르게 실행한다. 느린 네트워크·파일 시스템·시간 대기는 경계에서 대체한다.
- **Independent**: 다른 테스트나 외부 시스템의 상태에 의존하지 않는다. 테스트마다 필요한 초기 상태를 직접 준비한다.
- **Repeatable**: 여러 번 실행해도 같은 결과가 나온다. 시간, 난수, UUID, 전역 상태를 통제한다.
- **Self-validating**: 로그를 사람이 해석하지 않아도 `expect`가 성공과 실패를 판단한다.
- **Timely**: 프로덕션 코드보다 테스트를 먼저 작성하고 **Red → Green → Refactor**를 반복한다. 버그 수정도 실패하는 재현 테스트부터 시작한다.

성공 흐름뿐 아니라 현실적으로 발생할 수 있는 경계값, 잘못된 입력, 예외·실패 흐름도 다룬다. 모든 입력을 나열하기보다 실제 호출자가 만들 수 있는 경계와 오류를 우선한다.

## 2. 직관성을 우선한다

테스트 코드는 중복 제거보다 시나리오를 읽는 속도가 중요하다. 한 번만 쓰는 설정을 변수나 범용 헬퍼로 숨기지 않는다. 중복이 있더라도 Given, When, Then과 기대 결과가 테스트 본문에 보이면 허용한다.

## 3. Given-When-Then 구조

각 테스트를 다음 순서로 작성한다. 주석은 선택 사항이지만 순서는 유지한다.

- **Given**: 초기 데이터와 테스트 환경을 준비한다.
- **When**: 함수 호출, 사용자 상호작용, 또는 오류 조건을 발생시킨다.
- **Then**: 외부에 드러난 결과·부수효과·오류를 검증한다.

## 4. 외부 인터페이스와 계약을 테스트한다

테스트 대상의 계약인 입력, 반환값, 부수효과, 오류를 검증한다. 내부 상태, 내부 메서드 호출 순서, 라이프사이클, 자식 컴포넌트를 계약처럼 고정하지 않는다. 예를 들어 Zustand가 갱신됐는지가 아니라 갱신 후 사용자에게 보이는 화면이나 공개 함수의 결과를 확인한다.

React UI는 `screen.getByRole`과 `getByLabelText` 같은 사용자·접근성 중심 쿼리와 `user-event`를 우선한다. 클래스·ID 선택자는 피하고, 다른 방법이 없을 때만 `data-testid`를 사용한다. 모킹은 테스트 대상이 아니라 느리거나 불안정하거나 부수효과가 있는 의존성에만 적용한다.

## 5. 한 테스트에 한 행동, 설명적인 이름

`describe`는 관련 테스트를 얕게 묶고, `it`은 한 가지 행동을 설명한다. 이름에 `and`가 여러 번 들어가면 테스트를 나눈다. `작동한다` 대신 조건과 결과를 명시한다.

```js
it("잘못된 이메일을 입력하면 이메일 형식 오류를 표시한다", () => {});
```

## 참고 문서

- [Vitest: Writing Tests](https://vitest.dev/guide/learn/writing-tests)
- [Vitest: Testing in Practice](https://vitest.dev/guide/learn/testing-in-practice)
- [Testing Library: Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Testing Library: About Queries](https://testing-library.com/docs/queries/about/)
- [Martin Fowler: Test Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Martin Fowler: Given When Then](https://martinfowler.com/bliki/GivenWhenThen.html)
