export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      console.warn("🔑 No refresh token found.");
      return null;
    }

    const res = await fetch("https://web-production-3f682.up.railway.app/auth/jwt/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    // If failed, exit early
    if (!res.ok) {
      const errorText = await res.text(); // for logging clarity
      console.error("🔐 Refresh token failed:", errorText);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    }

    // Save new access token
    const data = await res.json();
    if (data.access) {
      localStorage.setItem("accessToken", data.access);
      console.log("✅ Access token refreshed.");
      return data.access;
    } else {
      console.warn("⚠️ No access token returned in response.");
      return null;
    }
  } catch (err) {
    console.error("🧨 Exception during token refresh:", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
}
