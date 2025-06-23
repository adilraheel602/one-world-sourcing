// lib/fetchWithAuth.ts
export async function fetchWithAuth(url: string, options: any = {}, refreshToken: boolean = true) {
  const accessToken = localStorage.getItem("accessToken");
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!options.headers) options.headers = {};
  options.headers["Authorization"] = `JWT ${accessToken}`;
  options.credentials = "include";

  try {
    const res = await fetch(`${baseURL}${url}`, options);

    if (res.status === 401 && refreshToken) {
      // 🔄 Try refreshing the token
      console.log("Refreshing with token:", localStorage.getItem("refreshToken"));
      const refreshRes = await fetch(`${baseURL}/auth/jwt/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: localStorage.getItem("refreshToken"),
        }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem("accessToken", data.access);

        // 🔁 Retry original request with new token
        return fetchWithAuth(url, options, false);
      } else {
        throw new Error("Refresh failed");
      }
    }

    return res;
  } catch (error) {
    console.error("Fetch with auth failed:", error);
    throw error;
  }
}


export async function sendMessageToConversation(
  conversationId: string,
  content: string
) {
  const res = await fetchWithAuth(`/conversations/send-message/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      content,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to send message.");
  }

  return await res.json();
}
