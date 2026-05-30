$dir = "c:\Users\Sivanesh\OneDrive - ELCOT\folder\Gift_Shop\gifthaven"
$files = Get-ChildItem -Path $dir -Recurse -Include *.js, *.jsx, *.css, *.html -Exclude node_modules, .git

foreach ($file in $files) {
    if ($file.FullName -match "node_modules" -or $file.FullName -match "\.git") {
        continue
    }
    $content = Get-Content -Path $file.FullName -Raw
    $newContent = $content
    
    $newContent = $newContent -replace 'Blessy Gift Shop', 'TRESOR GIFTS'
    $newContent = $newContent -replace 'Blessy gift shop', 'TRESOR GIFTS'
    $newContent = $newContent -replace 'Blessy', 'TRESOR GIFTS'
    
    $newContent = $newContent -replace 'Lights & Gifts', 'TRESOR GIFTS'
    $newContent = $newContent -replace 'ClassyPik Gifts', 'TRESOR GIFTS'
    $newContent = $newContent -replace 'Green Roots', 'TRESOR GIFTS'
    $newContent = $newContent -replace 'lightsandgifts', 'tresorgifts'
    $newContent = $newContent -replace 'blessygiftshop@gmail.com', 'info@tresorgifts.in'
    
    $newContent = $newContent -replace 'bg-rose-500', 'bg-red-600'
    $newContent = $newContent -replace 'bg-rose-600', 'bg-red-700'
    $newContent = $newContent -replace 'text-rose-500', 'text-red-600'
    $newContent = $newContent -replace 'text-rose-600', 'text-red-700'
    $newContent = $newContent -replace 'border-rose-500', 'border-red-600'
    $newContent = $newContent -replace 'bg-rose-50', 'bg-red-50'
    $newContent = $newContent -replace 'bg-rose-100', 'bg-red-100'
    $newContent = $newContent -replace 'text-rose-400', 'text-red-500'
    $newContent = $newContent -replace 'from-rose-500', 'from-red-600'
    $newContent = $newContent -replace 'to-pink-600', 'to-red-800'
    $newContent = $newContent -replace 'hover:text-rose-400', 'hover:text-red-500'
    
    if ($content -cne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        Write-Output "Updated $($file.FullName)"
    }
}
Write-Output "Done"
