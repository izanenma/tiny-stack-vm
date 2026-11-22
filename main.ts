import { readFileSync as R, writeFileSync as W, mkdirSync as M } from 'node:fs';
import { join as J } from 'node:path';
function run(p: Buffer, q: Buffer) {
  const s: number[] = [], c: number[] = [], m = new Int32Array(256), o: number[] = [];
  let pc = 0, ip = 0, n = 0;
  const d = (e: number) => ({ o: Buffer.from(o), e });
  for (;;) {
    if (n >= 1e6) return d(10);
    if (pc < 0 || pc >= p.length) return d(9);
    const op = p[pc]!;
    if (!(op < 8 || (op > 15 && op < 31) || (op > 31 && op < 35) || (op > 47 && op < 53) || op === 64 || op === 65 || (op > 79 && op < 84))) return d(5);
    const im = op === 1 ? 1 : op === 2 ? 4 : op > 47 && op < 52 ? 2 : 0, nx = pc + 1 + im;
    if (nx > p.length) return d(9);
    n++;
    const f = () => ((p[pc + 1]! | (p[pc + 2]! << 8)) << 16) >> 16;
    switch (op) {
      case 0: return d(0);
      case 1: if (s.length > 255) return d(3); s.push((p[pc + 1]! << 24) >> 24); break;
      case 2: if (s.length > 255) return d(3); s.push(p.readInt32LE(pc + 1)); break;
      case 3: if (!s.length) return d(2); s.pop(); break;
      case 4: if (!s.length) return d(2); if (s.length > 255) return d(3); s.push(s[s.length - 1]!); break;
      case 5: if (s.length < 2) return d(2); { const t = s[s.length - 1]!; s[s.length - 1] = s[s.length - 2]!; s[s.length - 2] = t; } break;
      case 6: if (s.length < 2) return d(2); if (s.length > 255) return d(3); s.push(s[s.length - 2]!); break;
      case 7: if (s.length < 3) return d(2); { const t = s[s.length - 3]!; s[s.length - 3] = s[s.length - 2]!; s[s.length - 2] = s[s.length - 1]!; s[s.length - 1] = t; } break;
      case 23: if (!s.length) return d(2); s[s.length - 1] = -s[s.length - 1]! | 0; break;
      case 27: if (!s.length) return d(2); s[s.length - 1] = ~s[s.length - 1]!; break;
      case 48: pc = nx + f(); continue;
      case 49: if (!s.length) return d(2); if (!s.pop()) { pc = nx + f(); continue; } break;
      case 50: if (!s.length) return d(2); if (s.pop()) { pc = nx + f(); continue; } break;
      case 51: if (c.length > 63) return d(7); c.push(nx); pc = p[pc + 1]! | (p[pc + 2]! << 8); continue;
      case 52: if (!c.length) return d(8); pc = c.pop()!; continue;
      case 64: if (!s.length) return d(2); { const a = s.pop()!; if (a < 0 || a > 255) return d(6); s.push(m[a]!); } break;
      case 65: if (s.length < 2) return d(2); { const a = s.pop()!, v = s.pop()!; if (a < 0 || a > 255) return d(6); m[a] = v; } break;
      case 80: if (!s.length) return d(2); { const v = s.pop()!, t = String(v); if (o.length + t.length > 65536) return d(11); for (let k = 0; k < t.length; k++) o.push(t.charCodeAt(k)); } break;
      case 81: if (!s.length) return d(2); { const v = s.pop()!; if (o.length > 65535) return d(11); o.push(v & 255); } break;
      case 82: if (s.length > 255) return d(3); s.push(ip < q.length ? q[ip++]! : -1); break;
      case 83: if (!s.length) return d(2); return d(s.pop()! & 255);
      default: {
        if (s.length < 2) return d(2);
        const b = s.pop()!, a = s.pop()!;
        let r: number;
        if ((op === 19 || op === 20 || op === 21 || op === 22) && !b) return d(4);
        switch (op) {
          case 16: r = a + b | 0; break;
          case 17: r = a - b | 0; break;
          case 18: r = Math.imul(a, b); break;
          case 19: r = a / b | 0; break;
          case 20: r = a % b | 0; break;
          case 21: r = (a >>> 0) / (b >>> 0) | 0; break;
          case 22: r = (a >>> 0) % (b >>> 0) | 0; break;
          case 24: r = a & b; break;
          case 25: r = a | b; break;
          case 26: r = a ^ b; break;
          case 28: r = a << b; break;
          case 29: r = a >> b; break;
          case 30: r = a >>> b | 0; break;
          case 32: r = +(a === b); break;
          case 33: r = +(a < b); break;
          case 34: r = +((a >>> 0) < (b >>> 0)); break;
          default: return d(5);
        }
        s.push(r);
      }
    }
    pc = nx;
  }
}
const I = process.env.MAKEFUN_INPUT_DIR || '/input', O = process.env.MAKEFUN_OUTPUT_DIR || '/output';
for (let i = 1; i < 41; i++) {
  const id = 'i' + String(i).padStart(3, '0'), dr = J(O, id);
  M(dr, { recursive: true });
  let r: { o: Buffer; e: number };
  try { r = run(R(J(I, id, 'program.bin')), R(J(I, id, 'input.bin'))); } catch { r = { o: Buffer.alloc(0), e: 9 }; }
  W(J(dr, 'stdout.bin'), r.o);
  W(J(dr, 'exit.txt'), '' + r.e);
}
