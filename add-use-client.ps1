# PowerShell script to insert "use client" at the top of specific TSX files

$files = @(
  "components/dashboard/header.tsx",
  "components/dashboard/OrderTimeline.tsx",
  "components/dashboard/recent-orders.tsx",
  "components/dashboard/recent-quotes.tsx",
  "components/dashboard/stats-cards.tsx",
  "components/dashboard/supplier-offer-list.tsx",
  "components/supplier/SupplierHeader.tsx",
  "components/ui/carousel.tsx",
  "components/ui/sidebar.tsx",
  "components/ui/use-mobile.tsx",
  "components/AuthGuard.tsx",
  "components/quote-modal.tsx"
)

foreach ($file in $files) {
  $path = ".\$file"
  if (Test-Path $path) {
    $content = Get-Content $path
    if ($content[0] -notmatch '^["'']use client["''];?$') {
      Write-Host "✅ Adding 'use client' to $file"
      @('"use client";', '') + $content | Set-Content $path -Encoding utf8
    } else {
      Write-Host "✔ Already has 'use client': $file"
    }
  } else {
    Write-Host "❌ File not found: $file"
  }
}
