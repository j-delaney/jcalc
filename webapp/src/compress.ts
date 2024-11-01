import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

// Method 0: base64
function base64ToBytes(base64: string): Uint8Array {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
}

function bytesToBase64(bytes: Uint8Array): string {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

function compressBase64(s: string): string {
  return "0" + bytesToBase64(new TextEncoder().encode(s));
}

function decompressBase64(s: string): string {
  return new TextDecoder().decode(base64ToBytes(s));
}

// Method 1: LZ
function compressLZ(s: string): string {
  return "1" + compressToEncodedURIComponent(s);
}

function decompressLZ(s: string): string {
  return decompressFromEncodedURIComponent(s);
}

// Method 2: urlencode
function compressURL(s: string): string {
  return "2" + encodeURIComponent(s);
}

function decompressURL(s: string): string {
  return decodeURIComponent(s);
}

export function compress(s: string): string {
  const base64 = compressBase64(s);
  const lz = compressLZ(s);
  const uri = compressURL(s);

  const minLength = Math.min(base64.length, lz.length, uri.length);
  console.log({
    base64: base64.length,
    lz: lz.length,
    uri: uri.length,
  });
  if (base64.length === minLength) {
    return base64;
  }
  if (lz.length === minLength) {
    return lz;
  }
  return uri;
}

export function decompress(s: string): string {
  switch (s[0]) {
    case "0":
      return decompressBase64(s.substring(1));
    case "1":
      return decompressLZ(s.substring(1));
    case "2":
      return decompressURL(s.substring(1));
    default:
      throw new Error("unknown compression version " + s[0]);
  }
}
