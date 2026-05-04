import AppKit
import Foundation
import PDFKit

let arguments = CommandLine.arguments

guard arguments.count == 3 else {
    fputs("Usage: render-pdf.swift <input.pdf> <output-directory>\n", stderr)
    exit(1)
}

let inputURL = URL(fileURLWithPath: arguments[1])
let outputURL = URL(fileURLWithPath: arguments[2])

guard let document = PDFDocument(url: inputURL) else {
    fputs("Unable to open PDF at \(inputURL.path)\n", stderr)
    exit(1)
}

try FileManager.default.createDirectory(at: outputURL, withIntermediateDirectories: true)

for pageIndex in 0..<document.pageCount {
    guard let page = document.page(at: pageIndex) else {
        continue
    }

    let bounds = page.bounds(for: .mediaBox)
    let width = max(1, Int(bounds.width.rounded(.up)))
    let height = max(1, Int(bounds.height.rounded(.up)))

    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: width,
        pixelsHigh: height,
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ) else {
        fputs("Unable to allocate bitmap for page \(pageIndex + 1)\n", stderr)
        exit(1)
    }

    bitmap.size = NSSize(width: bounds.width, height: bounds.height)

    guard let graphicsContext = NSGraphicsContext(bitmapImageRep: bitmap) else {
        fputs("Unable to create graphics context for page \(pageIndex + 1)\n", stderr)
        exit(1)
    }

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = graphicsContext

    let context = graphicsContext.cgContext
    context.setFillColor(NSColor.white.cgColor)
    context.fill(CGRect(x: 0, y: 0, width: bounds.width, height: bounds.height))
    context.translateBy(x: -bounds.origin.x, y: -bounds.origin.y)
    page.draw(with: .mediaBox, to: context)

    NSGraphicsContext.restoreGraphicsState()

    guard let png = bitmap.representation(using: .png, properties: [:]) else {
        fputs("Unable to encode PNG for page \(pageIndex + 1)\n", stderr)
        exit(1)
    }

    let filename = String(format: "page-%02d.png", pageIndex + 1)
    try png.write(to: outputURL.appendingPathComponent(filename))
    print("Rendered \(filename)")
}
