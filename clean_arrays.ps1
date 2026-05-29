$base = "c:\Users\Sivanesh\OneDrive - ELCOT\folder\Gift_Shop\gifthaven"
$pPath = "$base\src\data\products.js"

$content = Get-Content $pPath -Raw -Encoding UTF8

# First, fix multi-line images: [...] arrays that now look like:
#   images: ['https://picsum...'],
#     "old-url1",
#     "old-url2"
#   ],
# We want to remove the extra trailing lines up to the closing ]

# Step 1: After the script replaced images: [...] lines, old entries still trail.
# Strategy: use regex to find the now-broken arrays and clean them.
# A broken array starts with images: ['picsum...'], (already closed with comma)
# followed by lines of string URLs and then a stale `],`

$content = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    "(images:\s*\['https://picsum\.photos/seed/[^']+/400/400'\],\n)((?:\s+""[^""]*"",\n)*\s+""[^""]*""\n\s*\],\n)",
    '$1'
)
# Also handle trailing ], that now has no opening [
$content = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    "(images:\s*\['https://picsum\.photos/seed/[^']+/400/400'\],\n)((?:\s+""[^""]*""\n)*\s*\],\n)",
    '$1'
)

Set-Content $pPath $content -Encoding UTF8
Write-Host "Cleaned multi-line arrays"

# Verify a sample
$sample = (Get-Content $pPath)[10..20] -join "`n"
Write-Host $sample
