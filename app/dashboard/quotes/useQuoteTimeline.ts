// "use client";
// import { useEffect, useState } from "react";

// export default function useQuoteTimeline(quoteId: string) {
//   const [timeline, setTimeline] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!quoteId) return;

//     const fetchTimeline = async () => {
//       const token = localStorage.getItem("accessToken");
//       try {
//         const res = await fetch(
//           `https://1wsbackend-production.up.railway.app/quotes/${quoteId}/timeline/`,
//           {
//             headers: { Authorization: `JWT ${token}` },
//           }
//         );

//         if (res.ok) {
//           const data = await res.json();
//           setTimeline(Array.isArray(data) ? data : []);
//         } else {
//           setTimeline([]);
//         }
//       } catch (err) {
//         console.error("Failed to load timeline", err);
//         setTimeline([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTimeline();
//   }, [quoteId]);

//   return { timeline, loading };
// }

"use client";
import { useEffect, useState } from "react";

export default function useQuoteTimeline(quoteId: string | null) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quoteId) return;

    const fetchTimeline = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await fetch(
          `https://1wsbackend-production.up.railway.app/quotes/${quoteId}/timeline/`,
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setTimeline(Array.isArray(data) ? data : []);
        } else {
          setTimeline([]);
        }
      } catch (err) {
        console.error("Failed to load timeline", err);
        setTimeline([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [quoteId]);

  return { timeline, loading };
}
