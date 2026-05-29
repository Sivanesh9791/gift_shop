$base = "c:\Users\Sivanesh\OneDrive - ELCOT\folder\Gift_Shop\gifthaven"
$pPath = "$base\src\data\products.js"

# Category-specific Picsum seeds for realistic product images
# Using /seed/<string>/400/400 ensures each unique slug always returns the same image
$content = Get-Content $pPath -Raw

# Replace image: '/images/products/<slug>.svg' with a stable picsum URL
# Strategy: use product slug as seed so each product gets unique consistent photo
$content = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    "image:\s*'/images/products/([^']+)\.svg'",
    { param($m)
        $slug = $m.Groups[1].Value
        "image: 'https://picsum.photos/seed/$slug/400/400'"
    }
)

# Also fix images: array
$content = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    "images:\s*\['/images/products/([^']+)\.svg'\]",
    { param($m)
        $slug = $m.Groups[1].Value
        "images: ['https://picsum.photos/seed/$slug/400/400']"
    }
)

Set-Content $pPath $content

# Also fix categories.js
$cPath = "$base\src\data\categories.js"
$cContent = Get-Content $cPath -Raw

$cContent = [System.Text.RegularExpressions.Regex]::Replace(
    $cContent,
    "image:\s*'/images/categories/([^']+)\.svg'",
    { param($m)
        $slug = $m.Groups[1].Value
        "image: 'https://picsum.photos/seed/cat-$slug/600/400'"
    }
)

Set-Content $cPath $cContent

Write-Host "Done"
