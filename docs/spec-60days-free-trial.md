# 無料トライアル（環境変数一括管理・クレカ不要）& 有料プラン移行 機能仕様書

## 1. 概要・背景と目的

### 1.1 背景
現状の仕様では、新規登録時に Stripe Checkout を介してあらかじめクレジットカードを登録させ、90日間のトライアルを開始する構成になっています。
しかし、登録時にクレジットカードの入力を求めると離脱率が高くなるため、**「登録時はクレジットカード不要で、まず環境変数で設定された無料期間（例: 60日間）フル機能を体験してもらい、期間終了後に継続利用のためのクレジットカード登録（有料課金開始）を求める」** 方式に変更します。

### 1.2 目的
- **新規登録のハードルを極小化**: クレジットカード情報の入力なしに即座に家計簿機能・やりくり管理を開始できるようにする。
- **環境変数によるシンプルな一元管理**:
  - 無料日数（例: 30日、60日、90日など）を環境変数 **`NEXT_PUBLIC_FREE_TRIAL_DAYS` の1本のみ** で一括管理。
  - ユーザーごとの個別設定等は行わず、全ユーザー共通のシンプルな運用とする。
- **体験価値の実感による課金転換率（CVR）向上**: 十分な無料期間を通じてデータが蓄積され、生活習慣の一部となったタイミングで有料プランへ誘導する。
- **安心感とスムーズな課金導線（登録モーダル）**:
  - 無料期間終了後は、画面を別ページへ追い出すのではなく、**ダッシュボード上で前面に「クレジットカード登録モーダル」をオーバーレイ表示して操作をブロック**。
  - 保存された家計簿データの存在を感じさせつつ、スムーズにカード登録（Stripe Checkout）へ誘導する。

---

## 2. 無料期間の設定方式（環境変数）

### 2.1 環境変数の定義
`.env.local` / `.env.production` にて1本のみ定義します。

```bash
# 全ユーザー共通の無料トライアル日数（未設定時は 60 日）
NEXT_PUBLIC_FREE_TRIAL_DAYS=60
```

### 2.2 無料期限の決定と判定ロジック
- **アカウント作成時**:
  - ユーザー作成日時（`created_at`）に `NEXT_PUBLIC_FREE_TRIAL_DAYS` 日を加算した日時を `trial_ends_at` として保存します。
  - `trial_ends_at = created_at + (NEXT_PUBLIC_FREE_TRIAL_DAYS || 60) 日`
- **判定ロジック**:
  - `現在の時刻 <= trial_ends_at`：無料体験中（全機能利用可能）
  - `現在の時刻 > trial_ends_at`：無料期限切れ（**クレジットカード登録モーダルが常時表示され機能ロック**）

---

## 3. ユーザー体験フロー（全体像）

```mermaid
flowchart TD
    A[ユーザーがサインアップ\n(メール/PWのみ・クレカ不要)] --> B[アカウント作成完了\n・無料期間開始\n・trial_ends_at = 登録日 + NEXT_PUBLIC_FREE_TRIAL_DAYS]
    B --> C[初期オンボーディング\n予算設定など]
    C --> D[ダッシュボード利用開始\n(全機能がフル利用可能)]
    
    D --> E{無料期限以内？\n(now <= trial_ends_at)}
    E -- はい (残り1日以上) --> F[通常利用可能\nヘッダーに「無料体験中 (残りX日)」バナー表示\n※いつでも事前クレカ登録可能]
    
    E -- いいえ (期限切れ) --> G[ログイン後 / 画面表示時\n『クレジットカード登録モーダル』が前面表示\n(背景ロック・機能操作不可)]
    
    G --> H[「カードを登録して利用を再開」をクリック\n(Stripe Checkout)]
    H --> I[有料サブスクリプション契約完了\n(subscription_status: 'active')]
    I --> J[モーダル解除・機能ロック全面解除\n保存されていたデータを引き継ぎ継続利用]
    
    G -. ログアウト・退会 .-> K[モーダル内のサブ導線よりログアウト/アカウント削除]
    F -. 途中で自発的に登録 .-> H
```

---

## 4. 無料期間終了後の挙動（クレジットカード登録モーダル仕様）

無料期間終了（`trial_expired`）となったユーザーがログインした際、または期限切れ状態でアプリを開いた際の画面仕様です。

### 4.1 モーダルの表示制御・ロック仕様
- **自動ポップアップ**: 期限切れユーザーがログイン・アクセスすると、画面マウント時に即座にモーダルが前面表示されます。
- **クローズ操作の完全ブロック（非閉鎖モーダル）**:
  - 右上の「✕」閉じるボタンは**非表示**。
  - モーダル外（背景のオーバーレイ）をクリックしても**閉じない**。
  - キーボードの `Esc` キーを押しても**閉じない**。
  - モーダル配下のメインコンテンツ（メニュー、出費追加ボタン、集計グラフ等）は操作不能（`pointer-events: none` またはオーバーレイでガード）。
- **目的**: 無料期間終了後はクレジットカードを登録しない限り一切の機能を使えない状態を担保します。

### 4.2 モーダルのUI構成

```
┌────────────────────────────────────────────────────────┐
│  🔒 無料体験期間が終了しました                         │
│                                                        │
│  60日間の無料体験期間が終了いたしました。              │
│  これまでご登録いただいた予算や出費データ、過去履歴は │
│  すべて安全に保管されています。                        │
│                                                        │
│  引き続きサービスをご利用いただくには、                │
│  クレジットカードのご登録（有料プラン契約）が必要です。 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ プレミアム月額プラン: 150円 / 月 (税込)          │  │
│  │ ・すべての家計簿・予算管理機能を無制限で利用可能 │  │
│  │ ・いつでも設定画面から解約可能                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│   [ 💳 クレジットカードを登録して利用を再開する (Stripeへ) ] │
│                                                        │
│             [ログアウト]   |   [退会・アカウント削除]   │
└────────────────────────────────────────────────────────┘
```

1. **ヘッダー & アイコン**:
   - 鍵アイコン（またはインフォメーションアイコン）＋「無料体験期間が終了しました」
2. **メッセージ本文**:
   - 無料体験が終了した旨の案内。
   - **「これまでに登録されたデータは消えず安全に保管されています」** という安心感を伝えるアナウンス。
3. **プラン内容 & 料金表示**:
   - 月額料金、利用可能な機能の明記。
4. **プライマリアクション（CTAボタン）**:
   - **「クレジットカードを登録して利用を再開する」** ボタン（クリックで Stripe Checkout 決済ページへ遷移）。
5. **サブアクション（離脱・アカウント整理導線）**:
   - 「ログアウト」ボタン
   - 「退会（アカウント削除）」リンク（不要になったユーザーがデータを削除できる退会ダイアログを開く導線）

---

## 5. ユーザー状態（ステータス）定義と権限マトリクス

### 5.1 ユーザーステータス定義
`public.users` テーブルの `subscription_status` および `trial_ends_at`、`is_admin` を組み合わせて判定します。

| 状態名 | 判定条件 | 説明 |
| :--- | :--- | :--- |
| **admin (管理者)** | `is_admin = true` | 期間や決済に関係なく全機能を永久に無制限で利用可能。モーダルは一切出ない。 |
| **trialing (無料体験中)** | `is_admin = false`<br>かつ `trial_ends_at >= 現在時刻`<br>かつ `stripe_subscription_id IS NULL` | クレカ未登録の無料期間中。全機能を通常利用可能。残り日数バナーを表示。 |
| **trial_expired (無料期限切れ)** | `is_admin = false`<br>かつ `trial_ends_at < 現在時刻`<br>かつ `stripe_subscription_id IS NULL` | 無料期間が終了し、クレカ未登録。**クレジットカード登録モーダルが常時表示され機能ロック**。 |
| **active (有料会員)** | `is_admin = false`<br>かつ `subscription_status = 'active'` | クレジットカードを登録し、月額決済が正常に行われている状態。 |
| **past_due / unpaid (支払い滞納)** | `subscription_status = 'past_due' \|\| 'unpaid'` | 更新時の決済失敗。一定の猶予期間後にアクセス制限・警告モーダル。 |
| **canceled (解約済み)** | `subscription_status = 'canceled'` | サブスクリプション解約済み。無料期限も過ぎていれば機能ロック。 |

### 5.2 画面アクセス・機能制御マトリクス

| ページ / 機能 | 未ログイン | 無料体験中 (trialing) | 無料期限切れ (trial_expired) | 有料会員 (active) | 管理者 (admin) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **LP / ログイン / 規約 / お問い合わせ** | ◯ | ◯ | ◯ | ◯ | ◯ |
| **オンボーディング (`/onboarding`)** | × | ◯ (未完了時) | × (機能ロック) | ◯ (未完了時) | ◯ (未完了時) |
| **主要機能 (`/dashboard`, `/budgets`, etc.)** | × | **◯ (フル利用可能)** | **× (登録モーダルで操作不可)** | **◯ (フル利用可能)** | **◯ (フル利用可能)** |
| **出費の追加・編集・削除** | × | **◯ (可能)** | **× (APIもブロック)** | **◯ (可能)** | **◯ (可能)** |
| **クレジットカード登録 (Stripe Checkout)** | × | ◯ (先行登録可) | **◯ (モーダルから登録)** | × (登録済み) | × (不要) |
| **ログアウト / アカウント削除** | × | ◯ | **◯ (モーダルから可能)** | ◯ | ◯ |

---

## 6. システム・データベース設計

### 6.1 データベース（`public.users` テーブル）

```sql
-- public.users テーブルの関連カラム
ALTER TABLE public.users 
  ALTER COLUMN subscription_status SET DEFAULT 'trialing',
  ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT now();
```

| カラム名 | 型 | デフォルト値 | 説明 |
| :--- | :--- | :--- | :--- |
| `subscription_status` | `TEXT` | `'trialing'` | ステータス（`trialing`, `active`, `past_due`, `canceled` 等） |
| `trial_started_at` | `TIMESTAMPTZ` | `now()` | トライアル開始日時（通常はサインアップ日時） |
| `trial_ends_at` | `TIMESTAMPTZ` | `計算値` | 無料体験終了日時（開始日時 + NEXT_PUBLIC_FREE_TRIAL_DAYS 日） |
| `stripe_customer_id` | `TEXT` | `NULL` | Stripe上の顧客ID（カード登録時に発行） |
| `stripe_subscription_id` | `TEXT` | `NULL` | Stripe上のサブスクリプションID |
| `is_admin` | `BOOLEAN` | `false` | 管理者フラグ |

### 6.2 トライアル期間算出ユーティリティ（`src/lib/subscription.ts`）

```typescript
/**
 * 環境変数から無料トライアル日数を取得（デフォルトは 60 日）
 */
export function getFreeTrialDays(): number {
  const envDays = process.env.NEXT_PUBLIC_FREE_TRIAL_DAYS;
  const parsed = envDays ? parseInt(envDays, 10) : 60;
  return Number.isNaN(parsed) || parsed <= 0 ? 60 : parsed;
}

/**
 * トライアル終了日時を算出
 */
export function calculateTrialEndsAt(startDate: Date = new Date()): Date {
  const days = getFreeTrialDays();
  const endsAt = new Date(startDate);
  endsAt.setDate(endsAt.getDate() + days);
  return endsAt;
}

/**
 * ユーザーのサブスクリプション状態・残日数を判定
 */
export function evaluateSubscription(user: {
  is_admin?: boolean;
  subscription_status?: string;
  trial_ends_at?: string | Date | null;
  stripe_subscription_id?: string | null;
}) {
  const isAdmin = !!user.is_admin;
  if (isAdmin) {
    return {
      isAdmin: true,
      status: "admin",
      trialEndsAt: null,
      hasActiveSubscription: true,
      isTrialing: false,
      isTrialExpired: false,
      remainingDays: 9999,
    };
  }

  const now = new Date();
  const trialEndsAt = user.trial_ends_at ? new Date(user.trial_ends_at) : null;
  const isPaidActive = user.subscription_status === "active";
  
  // 無料体験中: 有料契約なし & 終了日時が未来
  const isTrialing = !isPaidActive && !user.stripe_subscription_id && !!trialEndsAt && trialEndsAt > now;
  // 無料体験切れ: 有料契約なし & 終了日時が過去
  const isTrialExpired = !isPaidActive && !user.stripe_subscription_id && (!trialEndsAt || trialEndsAt <= now);
  
  // 有効な利用権限の有無（無料体験中または有料契約中）
  const hasActiveSubscription = isPaidActive || isTrialing;

  const remainingDays = trialEndsAt && isTrialing
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    isAdmin,
    status: isPaidActive ? "active" : isTrialing ? "trialing" : "trial_expired",
    trialEndsAt,
    hasActiveSubscription,
    isTrialing,
    isTrialExpired,
    remainingDays,
  };
}
```

---

## 7. Stripe 連携仕様

### 7.1 Stripe Checkout セッション (`/api/stripe/checkout`)
無料期間終了後にモーダルからクレジットカードを登録するため、**Stripe Checkout 側で二重に無料トライアルを付与せず即時決済** とします。

```typescript
// 残り日数がある段階での事前登録時は、残り日数をStripe側のtrial_period_daysに設定
const remainingTrialDays = calculateRemainingTrialDays(user.trial_ends_at);

const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  customer_email: user.email,
  client_reference_id: user.id,
  line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
  ...(remainingTrialDays > 0 ? {
    subscription_data: {
      trial_period_days: remainingTrialDays,
    }
  } : {}),
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout_success=true`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, // ダッシュボードへ戻し、再表示
});
```

---

## 8. 実装ステップと改修対象ファイル

| ステップ | 対象ファイル | 作業内容 |
| :---: | :--- | :--- |
| **Step 1: 設定 & DB** | `.env.example`<br>`supabase/migrations/xxxx_set_free_trial.sql` | `NEXT_PUBLIC_FREE_TRIAL_DAYS=60` 環境変数の定義、カラム整備 |
| **Step 2: 判定ユーティリティ** | `src/lib/subscription.ts` (新規作成) | 環境変数からの日数取得、`evaluateSubscription` 関数の実装 |
| **Step 3: ユーザー作成/同期** | `src/lib/supabase/dal.ts`<br>`src/lib/supabase/auth.ts` | 新規作成時に `trial_ends_at = calculateTrialEndsAt()` で登録 |
| **Step 4: ルーティング制御** | `src/lib/supabase/middleware.ts` | 未ログインやオンボーディング制御を維持しつつ、期限切れ時はダッシュボード表示（モーダルオーバーレイ）へ遷移 |
| **Step 5: クレカ登録モーダル** | `src/components/subscription/TrialExpiredModal.tsx` (新規作成) | 閉じられないロックモーダル、Stripe Checkout連携、ログアウト/退会導線の実装 |
| **Step 6: モーダルの全体適用** | `src/app/(authenticated)/layout.tsx` | 認証後共通レイアウトに `TrialExpiredModal` を配置し、期限切れ時に画面全体をロック |
| **Step 7: 残日数バナー & UI** | `src/components/dashboard/...`<br>`src/components/settings/BillingSettingsSection.tsx` | 無料体験中の残り日数バナー、設定画面でのプラン状態表示 |
