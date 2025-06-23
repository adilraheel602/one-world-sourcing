export const getGoogleAuthURL = (): string => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

  if (!clientId || !redirectUri) {
    console.error("Missing Google OAuth environment variables");
    return "/";
  }

  const options: Record<string, string> = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
