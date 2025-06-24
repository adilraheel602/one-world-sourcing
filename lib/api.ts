export async function fetchNotifications(token: string) {
  const res = await fetch("https://web-production-3f682.up.railway.app/notifications/my/", {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return await res.json();
}

export async function markNotificationsRead(token: string) {
  const res = await fetch("https://web-production-3f682.up.railway.app/notifications/mark-all-read/", {
    method: "POST",
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return await res.json();
}
