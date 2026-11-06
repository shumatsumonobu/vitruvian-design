# あさのび デザイン作業の記録

design-discipline の作業記録。決めごと（declaration）の置き場、保存の合意、参考にしたサービスの記録。

## 決めごとの置き場と保存の合意

- 決めごと: `.design/declaration.md`
- 保存の合意: 説明（README.md）の「デザインの値は init が出したものでよく、置き場は `.design/` でよい」
- 変更範囲: 説明の「今ある画面は全部変えてよい」→ everything may change

## 参考の記録

2026-10-26 の `init` で実施。このパソコンに入っている Chrome で各サービスを開き、画面を見た。

| 参考 | 持って行った問い | 画面の見方 | 決まったこと | 私あての文 |
|---|---|---|---|---|
| [HabitBox Stretching Timer](https://habitbox.app/tools/stretching-timer) | 1 ポーズずつの案内で、何を同時に見せ、進み具合をどう見せるか | 動かして見た | 残り時間をいちばん大きな文字に、進み具合は単色の輪 | なし |
| [FlexTimer Stretch Timer](https://www.flextimer.app/stretch-timer) | 案内中の画面を全画面にするとき、操作をどこに置くか | 動かして見た | 主操作は塗り、他は控えめな枠 | なし |
| [Calm Breathe](https://www.calm.com/breathe) | 案内の言葉を 1 つだけ出すとき、何を中心に置くか | 開いて画面を見た | 中心に置くのは 1 つだけ | なし |
| [ストレッチタイマー](https://stretch-timer.yugattyo.chatgpt.site) | 残り秒数と単位をどう組むか | 動かして見た | 大きな数字の横に小さく単位を添える | なし |
| [StretchClock](https://www.stretchclock.com/) | 在宅、デスクワーク向けの体操で、何に絵を使い、何を文字だけにするか | 動かして見た | 表紙は文字だけで足りる | なし |

- 実際に動かした参考: HabitBox、FlexTimer、ストレッチタイマー、StretchClock。Calm は開いて画面を見た
- 文字だけで読んで画面を見なかった参考: なし

### 揃っていたこと（慣習）

- 残り時間を画面でいちばん大きな文字にし、数字の幅をそろえる（HabitBox、FlexTimer、ストレッチタイマー、StretchClock）
- 主操作は塗り、他は控えめな枠か文字だけ（HabitBox、FlexTimer、ストレッチタイマー）
- 進み具合は単色の輪か棒（HabitBox、FlexTimer、Calm、ストレッチタイマー）

### 分かれていたこと（選ぶべき所）

- 案内をページの中で動かすか（HabitBox）、全画面にするか（FlexTimer の Zen、Calm）
- 案内中の地を明るくするか（HabitBox、ストレッチタイマー）、暗くするか（Calm）、選ばせるか（FlexTimer）
