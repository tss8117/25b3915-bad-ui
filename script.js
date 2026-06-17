// Get all the elements we need
const icon        = document.getElementById('icon');
const ball        = document.getElementById('ball');
const sliderFill  = document.getElementById('sliderFill');
const volumeNumber = document.getElementById('volumeNumber');
const rightSide   = document.getElementById('rightSide');
const slider      = document.getElementById('slider');

// Variables to track state
let holdStart    = null;   // when did the user start holding
let isFiring     = false;  // is the ball currently in the air?

// Max hold time is 2 seconds = 100% power
const MAX_HOLD = 2000;


function charge() {
  if (isFiring) return;

  holdStart = Date.now();  // save the current time
  icon.classList.add('charging');
}

function release() {
  if (holdStart === null) return;

  // Calculate final power
  let heldFor = Date.now() - holdStart;
  let power   = Math.min((heldFor / MAX_HOLD) * 100, 100);

  icon.classList.remove('charging');
  holdStart = null;

  if (power < 2) return;  // ignore tiny taps

  // Fire the ball
  fireBall(power);
}

// --- When user presses down on the icon ---
icon.addEventListener('mousedown', charge);

// --- When user releases ---
window.addEventListener('mouseup', release);

// --- Fire the ball ---
function fireBall(power) {
  isFiring = true;
 
  let targetVolume = Math.round(power);
 
  // Get positions on screen
  let arenaRect  = rightSide.getBoundingClientRect();
  let sliderRect = slider.getBoundingClientRect();
  let iconRect   = icon.getBoundingClientRect();
 
  // Where the ball starts and ends
  let startX = 0;
  let startY = iconRect.top - arenaRect.top + iconRect.height / 2;
  let landX  = (sliderRect.left - arenaRect.left) + (targetVolume / 100) * sliderRect.width;
  let landY  = sliderRect.top - arenaRect.top;
 
  // --- PROJECTILE PHYSICS ---
 
  // More power = more time in the air (between 0.4s and 1.0s)
  let totalTime = 0.4 + (power / 100) * 0.6;
 
  // Gravity in pixels per second squared
  // Higher = ball falls faster and arcs more dramatically
  let gravity = 800;
 
  // Work out what horizontal speed is needed to reach landX in totalTime
  // x = startX + velocityX * t  →  velocityX = distance / time
  let velocityX = (landX - startX) / totalTime;
 
  // Work out what upward speed is needed to reach landY at the end
  // landY = startY + velocityY * totalTime + 0.5 * gravity * totalTime²
  // Rearranging: velocityY = (landY - startY - 0.5 * gravity * totalTime²) / totalTime
  let velocityY = (landY - startY - 0.5 * gravity * totalTime * totalTime) / totalTime;
 
  // Show the ball
  ball.style.display = 'block';
  ball.style.left    = startX + 'px';
  ball.style.top     = startY + 'px';
 
  // We track real elapsed time in seconds
  let startTime = null;
 
  function animate(timestamp) {
    // timestamp is the current time in milliseconds given by requestAnimationFrame
    if (startTime === null) startTime = timestamp;
 
    // How many seconds have passed since the animation started
    let t = (timestamp - startTime) / 1000;
 
    // Cap t so ball does not go past the landing point
    if (t > totalTime) t = totalTime;
 
    // Real projectile motion formulas
    let x = startX + velocityX * t;
    let y = startY + velocityY * t + 0.5 * gravity * t * t;
 
    ball.style.left = x + 'px';
    ball.style.top  = y + 'px';
 
    if (t < totalTime) {
      requestAnimationFrame(animate);
    } else {
      // Ball has landed
      ball.style.display        = 'none';
      sliderFill.style.width    = targetVolume + '%';
      volumeNumber.textContent  = targetVolume;
      isFiring = false;
    }
  }
 
  requestAnimationFrame(animate);
}