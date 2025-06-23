// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

// interface Supplier {
//   id: string
//   name: string
//   location: string
//   category: string
//   rating: number
//   verified: boolean
// }

// const suppliers: Supplier[] = [
//   {
//     id: "SUP-001",
//     name: "TextilePro Manufacturing",
//     location: "Shanghai, China",
//     category: "Textiles & Apparel",
//     rating: 4.8,
//     verified: true,
//   },
//   {
//     id: "SUP-002",
//     name: "ElectroTech Industries",
//     location: "Shenzhen, China",
//     category: "Electronics",
//     rating: 4.6,
//     verified: true,
//   },
//   {
//     id: "SUP-003",
//     name: "FurniCraft Co.",
//     location: "Ho Chi Minh City, Vietnam",
//     category: "Furniture",
//     rating: 4.5,
//     verified: true,
//   },
//   {
//     id: "SUP-004",
//     name: "AutoParts Global",
//     location: "Busan, South Korea",
//     category: "Automotive",
//     rating: 4.7,
//     verified: true,
//   },
//   {
//     id: "SUP-005",
//     name: "HomeGoods Manufacturers",
//     location: "Jakarta, Indonesia",
//     category: "Home Goods",
//     rating: 4.4,
//     verified: false,
//   },
// ]

// export function SupplierList() {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold">Verified Suppliers</h2>
//           <Link href="/dashboard/suppliers">
//             <Button variant="outline" size="sm" className="rounded-full">
//               View All
//             </Button>
//           </Link>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Supplier
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Location
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Category
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {suppliers.map((supplier) => (
//               <tr key={supplier.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
//                       {supplier.name.charAt(0)}
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium">{supplier.name}</div>
//                       <div className="text-sm text-gray-500">{supplier.id}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">{supplier.location}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">{supplier.category}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <div className="flex items-center">
//                     <span className="font-medium">{supplier.rating}</span>
//                     <div className="ml-1 flex">
//                       {[...Array(5)].map((_, i) => (
//                         <svg
//                           key={i}
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="12"
//                           height="12"
//                           viewBox="0 0 24 24"
//                           fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"}
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           className="text-yellow-500"
//                         >
//                           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//                         </svg>
//                       ))}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {supplier.verified ? (
//                     <Badge className="bg-green-100 text-green-800 border-0">Verified</Badge>
//                   ) : (
//                     <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
//                   <Link href={`/dashboard/suppliers/${supplier.id}`} className="text-black hover:underline">
//                     View Profile
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// UPDATED SupplierList.tsx
"use client";

import Link from "next/link";
import { useSuppliers } from "@/app/dashboard/suppliers/suppliers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function SupplierList() {
  // Define the Supplier type
  type Supplier = {
    id: string | number;
    name: string;
    location: string;
    category?: string;
    rating?: number;
    verified: boolean;
  };

  const { suppliers, loading } = useSuppliers() as unknown as { suppliers: Supplier[]; loading: boolean };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Verified Suppliers</h2>
          <Link href="/dashboard/suppliers">
            <Button variant="outline" size="sm" className="rounded-full">
              View All
            </Button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Loading suppliers...
                </td>
              </tr>
            ) : (
              suppliers
                .filter((s) => s.verified)
                .slice(0, 4)
                .map((supplier: any) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {supplier.name?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">
                            {supplier.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            SUP-{String(supplier.id).padStart(3, "0")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {supplier.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {supplier.category || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className="font-medium">
                          {supplier.rating?.toFixed(1) || "—"}

                          {/* {supplier.average_rating?.toFixed(1) || "—"} */}
                        </span>
                        <Star className="h-4 w-4 text-yellow-500 ml-1" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-green-100 text-green-800 border-0">
                        Verified
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/dashboard/suppliers/${supplier.id}`}
                        className="text-black hover:underline"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
