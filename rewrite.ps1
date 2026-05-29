$base = "c:\Users\Sivanesh\OneDrive - ELCOT\folder\Gift_Shop\gifthaven"
$pPath = "$base\src\data\products.js"

$imagesDir = "$base\public\images"
$prodDir = "$imagesDir\products"
$catDir = "$imagesDir\categories"

if (!(Test-Path $imagesDir)) { New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null }
if (!(Test-Path $prodDir)) { New-Item -ItemType Directory -Force -Path $prodDir | Out-Null }
if (!(Test-Path $catDir)) { New-Item -ItemType Directory -Force -Path $catDir | Out-Null }

function Get-SVG ($text, $id) {
    if ($id % 2 -eq 0) { $c1 = '#FF9A9E'; $c2 = '#FECFEF' } else { $c1 = '#a18cd1'; $c2 = '#fbc2eb' }
    $text = [System.Security.SecurityElement]::Escape($text)
    return "<svg width=`"400`" height=`"400`" xmlns=`"http://www.w3.org/2000/svg`"><defs><linearGradient id=`"g$id`" x1=`"0%`" y1=`"0%`" x2=`"100%`" y2=`"100%`"><stop offset=`"0%`" stop-color=`"$c1`" /><stop offset=`"100%`" stop-color=`"$c2`" /></linearGradient></defs><rect width=`"100%`" height=`"100%`" fill=`"url(#g$id)`" /><text x=`"50%`" y=`"50%`" dominant-baseline=`"middle`" text-anchor=`"middle`" font-family=`"sans-serif`" font-weight=`"bold`" font-size=`"24px`" fill=`"#1C1C1C`">$text</text></svg>"
}

$fallback = Get-SVG "Image Not Found" 0
Set-Content -Path "$imagesDir\fallback.svg" -Value $fallback

$lines = Get-Content $pPath
$currentId = 1
$currentName = "Package"
$currentSlug = "package"

for ($i=0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'id:\s*(\d+)') { $currentId = $matches[1] }
    if ($lines[$i] -match 'slug:\s*[''"]([^''"]+)[''"]') { $currentSlug = $matches[1] }
    if ($lines[$i] -match 'name:\s*[''"]([^''"]+)[''"]') { $currentName = $matches[1] }
    
    if ($lines[$i] -match 'image:\s*') {
        $svg = Get-SVG $currentName $currentId
        Set-Content -Path "$prodDir\$currentSlug.svg" -Value $svg
        $lines[$i] = $lines[$i] -replace "image:\s*['`"].*?['`"]", "image: '/images/products/$currentSlug.svg'"
    }
    if ($lines[$i] -match 'images:\s*\[\s*[''"]') {
        $lines[$i] = $lines[$i] -replace "images:\s*\[[\s\S]*?\]", "images: ['/images/products/$currentSlug.svg']"
    } else {
        if ($lines[$i] -match "'https://source.unsplash.com") {
             $lines[$i] = $lines[$i] -replace "['`"]https://source\.unsplash\.com.*?['`"]", "'/images/products/$currentSlug.svg'"
        }
    }
}
$lines -join "`n" | Set-Content $pPath

$cPath = "$base\src\data\categories.js"
$clines = Get-Content $cPath
$currentId = 1
$currentName = "Category"
$currentSlug = "cat"
for ($i=0; $i -lt $clines.Length; $i++) {
    if ($clines[$i] -match 'id:\s*(\d+)') { $currentId = $matches[1] }
    if ($clines[$i] -match 'slug:\s*[''"]([^''"]+)[''"]') { $currentSlug = $matches[1] }
    if ($clines[$i] -match 'name:\s*[''"]([^''"]+)[''"]') { $currentName = $matches[1] }
    if ($clines[$i] -match 'image:\s*') {
        $svg = Get-SVG $currentName ($currentId * 3)
        Set-Content -Path "$catDir\$currentSlug.svg" -Value $svg
        $clines[$i] = $clines[$i] -replace "image:\s*['`"].*?['`"]", "image: '/images/categories/$currentSlug.svg'"
    }
}
$clines -join "`n" | Set-Content $cPath

$targets = @(
  'src/pages/Wishlist.jsx', 'src/pages/ProductDetail.jsx', 'src/pages/OrderConfirmation.jsx',
  'src/pages/Home.jsx', 'src/pages/Checkout.jsx', 'src/pages/Cart.jsx',
  'src/components/GiftWrapModal.jsx', 'src/components/ProductCard.jsx',
  'src/components/QuickViewModal.jsx', 'src/components/CartDrawer.jsx',
  'src/admin/pages/Products.jsx', 'src/admin/pages/Dashboard.jsx'
)

foreach ($t in $targets) {
    $p = "$base\$t"
    if (Test-Path $p) {
        $c = Get-Content $p -Raw
        $c = $c -replace '<img([^>]+)>', '<img loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/images/fallback.svg"; }}$1>'
        # clean up duplicates if run multiple times
        $c = $c -replace 'loading="lazy" loading="lazy"', 'loading="lazy"'
        Set-Content $p -Value $c
    }
}

$hPath = "$base\src\pages\Home.jsx"
$hData = Get-Content $hPath -Raw
$heroSVG = Get-SVG "Gifts Wrapped Collection" 7
Set-Content -Path "$imagesDir\home-hero.svg" -Value $heroSVG
$avatarSVG = Get-SVG "SJ" 10
Set-Content -Path "$imagesDir\avatar.svg" -Value $avatarSVG

$hData = $hData -replace "['`"]https://source\.unsplash\.com/[^'`"]*['`"]", "'/images/home-hero.svg'"
$hData = $hData -replace "['`"]https://randomuser\.me[^'`"]*['`"]", "'/images/avatar.svg'"
Set-Content $hPath -Value $hData

Write-Host "Done"
