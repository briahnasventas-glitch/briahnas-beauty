# Compress Large Images Script
# Uses .NET standard libraries available in PowerShell

Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param (
        [string]$Path,
        [int]$MaxWidth = 1920
    )

    $img = [System.Drawing.Image]::FromFile($Path)
    
    # Calculate new dimensions
    $ratio = $img.Width / $img.Height
    $newWidth = $MaxWidth
    $newHeight = [int]($newWidth / $ratio)

    if ($img.Width -gt $MaxWidth) {
        $newImg = new-object System.Drawing.Bitmap $newWidth, $newHeight
        $graph = [System.Drawing.Graphics]::FromImage($newImg)
        $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        
        $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)
        
        $img.Dispose()
        $newImg.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
        $newImg.Dispose()
        $graph.Dispose()
        
        Write-Host "Compressed: $Path"
    } else {
        $img.Dispose()
        Write-Host "Skipped (Small enough): $Path"
    }
}

# Target specific large files known to cause issues
Resize-Image -Path "c:\Users\snake\OneDrive\Escritorio\BRIAHNAS_PREMIUM_CLONE\images\luxury-v8.png"
Resize-Image -Path "c:\Users\snake\OneDrive\Escritorio\BRIAHNAS_PREMIUM_CLONE\images\luxury-bg.png"
Resize-Image -Path "c:\Users\snake\OneDrive\Escritorio\BRIAHNAS_PREMIUM_CLONE\images\luxury-v6.png"
