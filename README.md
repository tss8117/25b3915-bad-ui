# Volume Cannon 🔊

## The Idea

Most volume sliders let you drag a handle to set the volume.

This one makes you fire a cannonball instead.

You hold the speaker icon to charge up power, then release to shoot. The ball flies in a projectile arc and lands somewhere on the slider. Wherever it lands becomes your new volume.

The longer you hold, the more power you build up, and the further the ball flies.

## How to Use

1. Hold the 🔊 icon
2. Release when you feel ready
3. Watch the ball fly
4. Accept your new volume

## Why It Is Bad

- You cannot directly choose your volume
- Short hold = low volume, long hold = high volume, but good luck being precise
- There is no undo
- The whole process takes about a second just to change the volume

## Technical Details

- The ball uses real projectile motion physics
- Horizontal velocity is calculated so the ball always lands at the correct position
- Vertical velocity is calculated using the formula: `velocityY = (landY - startY - 0.5 * gravity * t²) / t`
- More power = more time in the air = higher arc

## Files

```
index.html   — structure
style.css    — styling
script.js    — all the logic
README.md    — this file
```

## How to Run

Download all four files into one folder and open `index.html` in any browser. No server needed.
