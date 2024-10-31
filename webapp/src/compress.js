import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

// Method 0: base64
function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

function compressBase64(s) {
  return "0" + bytesToBase64(new TextEncoder().encode(s));
}

function decompressBase64(s) {
  return new TextDecoder().decode(base64ToBytes(s));
}

// Method 1: LZ
function compressLZ(s) {
  return "1" + compressToEncodedURIComponent(s);
}

function decompressLZ(s) {
  return decompressFromEncodedURIComponent(s);
}

// Method 2: urlencode
function compressURL(s) {
  return "2" + encodeURIComponent(s);
}

function decompressURL(s) {
  return decodeURIComponent(s);
}

export function compress(s) {
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

export function decompress(s) {
  switch (s[0]) {
    case "0":
      return decompressBase64(s.substring(1));
    case "1":
      return decompressLZ(s.substring(1));
    default:
      throw new Error("unknown compression version " + s[0]);
  }
}
