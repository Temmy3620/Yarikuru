-- 無料トライアルのデフォルト値設定とカラム追加
ALTER TABLE public.users 
  ALTER COLUMN subscription_status SET DEFAULT 'trialing',
  ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 既存の free ユーザーの移行:
-- Stripe未契約かつ trial_ends_at が空のユーザーには、登録日または現在日時から60日間の無料期間を付与
UPDATE public.users
SET 
  subscription_status = 'trialing',
  trial_started_at = COALESCE(trial_started_at, created_at, now()),
  trial_ends_at = COALESCE(trial_ends_at, (COALESCE(created_at, now()) + interval '60 days'))
WHERE 
  stripe_subscription_id IS NULL 
  AND (subscription_status = 'free' OR trial_ends_at IS NULL);
