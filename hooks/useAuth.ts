// "use client";

// import { useEffect } from "react";

// export default function useAuth() {
//   useEffect(() => {
//     const refreshAccessToken = async () => {
//       const refresh = localStorage.getItem("refreshToken");

//       if (!refresh) return;

//       try {
//         const res = await fetch("http://127.0.0.1:8000/auth/jwt/refresh/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ refresh }),
//         });

//         if (res.ok) {
//           const data = await res.json();
//           localStorage.setItem("accessToken", data.access);
//         } else {
//           console.error("Refresh failed:", await res.text());
//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken");
//         }
//       } catch (err) {
//         console.error("Refresh error:", err);
//       }
//     };

//     // Run on page load
//     refreshAccessToken();
//   }, []);
// }


import { useEffect } from "react";

export default function useAuth() {
  useEffect(() => {
    const refreshAccessToken = async () => {
      const refresh = localStorage.getItem("refreshToken");

      if (!refresh) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/auth/jwt/refresh/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("accessToken", data.access);
        } else {
          console.error("Refresh failed:", await res.text());
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } catch (err) {
        console.error("Refresh error:", err);
      }
    };

    refreshAccessToken();
  }, []);
}
