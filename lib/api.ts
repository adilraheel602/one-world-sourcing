export async function fetchNotifications(token: string) {
  const res = await fetch("http://localhost:8000/notifications/my/", {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return await res.json();
}

export async function markNotificationsRead(token: string) {
  const res = await fetch("http://localhost:8000/notifications/mark-all-read/", {
    method: "POST",
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return await res.json();
}
