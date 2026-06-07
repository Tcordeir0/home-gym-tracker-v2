import { supabase } from './supabase'
import { useStore } from '@/store'

const VAPID_PUBLIC =
  'BOY3gFDenhd9SGeYwxT0iAgmh7KFOqJOxqbcPeRoJXg2Aw0Rzeoi9uT-KrcbuZ_dRDgunQkn7f3Bku9aByszo0I'

function urlBase64ToUint8Array(b64: string) {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4)
  const s = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(s)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

export function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export async function getPushSub() {
  if (!pushSupported()) return null
  try {
    const reg = await navigator.serviceWorker.ready
    return await reg.pushManager.getSubscription()
  } catch {
    return null
  }
}

export async function savePushSub(sub: PushSubscription) {
  const j = sub.toJSON()
  const s = useStore.getState()
  const p = s.profiles.find((x) => x.id === s.activeId)
  if (!p || !j.endpoint || !j.keys?.p256dh || !j.keys?.auth) return
  // user_id é preenchido pelo default auth.uid() (RLS); não precisa passar
  await supabase.from('push_subs').upsert(
    {
      profile_id: p.id,
      profile_name: p.name,
      endpoint: j.endpoint,
      p256dh: j.keys.p256dh,
      auth: j.keys.auth,
      days: p.schedule?.days ?? [],
      reminder_time: p.schedule?.time ?? '18:00',
      tz_offset: new Date().getTimezoneOffset(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'endpoint' },
  )
}

export type EnableResult = 'ok' | 'denied' | 'unsupported' | 'noauth'

export async function enablePush(): Promise<EnableResult> {
  if (!pushSupported()) return 'unsupported'
  const { data } = await supabase.auth.getSession()
  if (!data.session) return 'noauth'
  let perm = Notification.permission
  if (perm !== 'granted') perm = await Notification.requestPermission()
  if (perm !== 'granted') return 'denied'
  const reg = await navigator.serviceWorker.ready
  let sub = await reg.pushManager.getSubscription()
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
    })
  }
  await savePushSub(sub)
  return 'ok'
}

export async function disablePush() {
  const sub = await getPushSub()
  if (!sub) return
  try {
    await supabase.from('push_subs').delete().eq('endpoint', sub.endpoint)
  } catch {
    /* ignore */
  }
  await sub.unsubscribe()
}
