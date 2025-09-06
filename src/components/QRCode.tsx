"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, Share2 } from "lucide-react";

interface QRCodeProps {
  url: string;
  size?: number;
  title?: string;
}

export default function QRCode({
  url,
  size = 200,
  title = "Scan to visit website",
}: QRCodeProps) {
  const downloadQR = () => {
    const canvas = document.createElement("canvas");
    const svg = document.querySelector("#qr-code svg") as SVGElement;
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = "brothers-bal-ganesh-qr.png";
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Brother Bal Ganesh Utsav Mandal",
          text: "Visit our website",
          url: url,
        });
      } catch {
        // Error sharing - user can still copy URL manually
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(url);
      alert("URL copied to clipboard!");
    }
  };

  return (
    <div className="text-center">
      <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
        <div id="qr-code" className="mb-4">
          <QRCodeSVG
            value={url}
            size={size}
            level="M"
            includeMargin={true}
            className="mx-auto"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          Scan this QR code to visit our website
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={downloadQR}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          <button
            onClick={shareQR}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
