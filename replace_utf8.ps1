$dir = "c:\Users\Sivanesh\OneDrive - ELCOT\folder\Gift_Shop\gifthaven"
$files = Get-ChildItem -Path $dir -Recurse -Include *.js, *.jsx, *.css, *.html -Exclude node_modules, .git

foreach ($file in $files) {
    if ($file.FullName -match "node_modules" -or $file.FullName -match "\.git") {
        continue
    }
    
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        $newContent = $content
        
        $newContent = $newContent.Replace("Blessy Gift Shop", "TRESOR GIFTS")
        $newContent = $newContent.Replace("Blessy gift shop", "TRESOR GIFTS")
        $newContent = $newContent.Replace("Blessy", "TRESOR GIFTS")
        
        $newContent = $newContent.Replace("Lights & Gifts", "TRESOR GIFTS")
        $newContent = $newContent.Replace("ClassyPik Gifts", "TRESOR GIFTS")
        $newContent = $newContent.Replace("Green Roots", "TRESOR GIFTS")
        $newContent = $newContent.Replace("lightsandgifts", "tresorgifts")
        $newContent = $newContent.Replace("blessygiftshop@gmail.com", "info@tresorgifts.in")
        
        $newContent = $newContent.Replace("bg-rose-500", "bg-red-600")
        $newContent = $newContent.Replace("bg-rose-600", "bg-red-700")
        $newContent = $newContent.Replace("text-rose-500", "text-red-600")
        $newContent = $newContent.Replace("text-rose-600", "text-red-700")
        $newContent = $newContent.Replace("border-rose-500", "border-red-600")
        $newContent = $newContent.Replace("bg-rose-50", "bg-red-50")
        $newContent = $newContent.Replace("bg-rose-100", "bg-red-100")
        $newContent = $newContent.Replace("text-rose-400", "text-red-500")
        $newContent = $newContent.Replace("from-rose-500", "from-red-600")
        $newContent = $newContent.Replace("to-pink-600", "to-red-800")
        $newContent = $newContent.Replace("hover:text-rose-400", "hover:text-red-500")
        
        if ($content -ne $newContent) {
            # Write with utf-8 encoding without BOM
            $utf8NoBom = New-Object System.Text.UTF8Encoding $False
            [System.IO.File]::WriteAllText($file.FullName, $newContent, $utf8NoBom)
        }
    } catch {
        # ignore read errors
    }
}
