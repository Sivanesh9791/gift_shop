$base = "c:\Users\Sivanesh\OneDrive - ELCOT\folder\Gift_Shop\gifthaven"
$pPath = "$base\src\data\products.js"

$content = Get-Content $pPath -Raw -Encoding UTF8

# Pattern: images array already replaced (now single-line), followed by dangling
# string literals (old leftover lines) and a stale ],
# 
# Example of broken state:
#   images: ['https://picsum.photos/.../400/400'],
#     '/images/products/slug.svg'
#   ],
#
# Fix: remove the dangling string line + stale ],

# Remove SVG path danglers after picsum arrays
$content = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    "(images:\s*\['https://picsum\.photos/seed/[^']+'\],\n)(\s*'[^']+\.svg'\n\s*\],\n)",
    '$1'
)

# Remove any other external URL danglers after picsum arrays  
$content = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    "(images:\s*\['https://picsum\.photos/seed/[^']+'\],\n)(\s+""[^""]+""\n\s*\],\n)",
    '$1'
)

# Remove dangling orphan ],  that follows a picsum images line with nothing between
$content = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    "(images:\s*\['https://picsum\.photos/seed/[^']+'\],\n)\s*\],\n",
    '$1'
)

Set-Content $pPath $content -Encoding UTF8
Write-Host "Fixed"

# Verify the problematic area
$lines = Get-Content $pPath
for ($i = 1665; $i -lt 1680; $i++) {
    Write-Host "$($i+1): $($lines[$i])"
}
