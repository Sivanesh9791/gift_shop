$base = "c:\Users\Sivanesh\OneDrive - ELCOT\folder\Gift_Shop\gifthaven"
$pPath = "$base\src\data\products.js"

$lines = Get-Content $pPath
$currentSlug = "product"
$output = @()

foreach ($line in $lines) {
    # Detect slug line and remember it
    if ($line -match "slug:\s*['""]([^'""]+)['""]") {
        $currentSlug = $Matches[1]
    }
    
    # Replace ANY image: '...' line or image: "..." line with picsum
    if ($line -match "^\s*image:\s*['""]") {
        $indent = $line -replace "^(\s*).*", '$1'
        $line = "${indent}image: 'https://picsum.photos/seed/$currentSlug/400/400',"
    }
    
    # Replace images: [...] single-liners
    if ($line -match "^\s*images:\s*\[") {
        $indent = $line -replace "^(\s*).*", '$1'
        $line = "${indent}images: ['https://picsum.photos/seed/$currentSlug/400/400'],"
    }
    
    $output += $line
}

$output -join "`n" | Set-Content $pPath -Encoding UTF8
Write-Host "Updated products.js - done"

# Now fix categories.js
$cPath = "$base\src\data\categories.js"
$clines = Get-Content $cPath
$cslug = "category"
$cout = @()

foreach ($line in $clines) {
    if ($line -match "slug:\s*['""]([^'""]+)['""]") { $cslug = $Matches[1] }
    if ($line -match "^\s*image:\s*['""]") {
        $indent = $line -replace "^(\s*).*", '$1'
        $line = "${indent}image: 'https://picsum.photos/seed/cat-$cslug/600/400',"
    }
    $cout += $line
}
$cout -join "`n" | Set-Content $cPath -Encoding UTF8
Write-Host "Updated categories.js - done"
