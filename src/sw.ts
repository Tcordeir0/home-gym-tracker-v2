/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

// precache do app shell (injetado pelo vite-plugin-pwa no build)
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', () => {
  void self.skipWaiting()
})
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim())
})

type PushPayload = { title?: string; body?: string; tag?: string; url?: string }
function parsePayload(event: PushEvent): PushPayload {
  try {
    return (event.data?.json() ?? {}) as PushPayload
  } catch {
    return { title: 'Home Gym', body: event.data?.text() }
  }
}

// Web Push — recebe a notificação mesmo com o app fechado
self.addEventListener('push', (event) => {
  const payload = parsePayload(event)
  event.waitUntil(
    self.registration.showNotification(payload.title ?? 'Home Gym', {
      body: payload.body ?? '',
      tag: payload.tag ?? 'hg',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      data: { url: payload.url ?? './' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data as { url?: string } | undefined)?.url ?? './'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) return c.focus()
      return self.clients.openWindow(url)
    }),
  )
})
