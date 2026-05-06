# Firefly Brand Colors

| Lime Green (Fire) | #9BCF53 |
| Forest Green (Fly) | #2D5A27 |
| Yellow (Primary) | #FDB813 |

---

## Green Glow Pulse Animation

Cycles text color between Lime Green → Forest Green infinitely.

**Keyframe** (already in `src/index.css`):
```css
@keyframes greenGlowPulse {
  0%, 100% { color: #9BCF53; }
  50%       { color: #2D5A27; }
}
```

**To apply to any element**, add:
```css
animation: greenGlowPulse 4s infinite ease-in-out;
```
