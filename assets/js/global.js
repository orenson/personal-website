document.addEventListener("DOMContentLoaded", function() {
  // Define text parts
  const parts = [
    { text: "Hi, ", class: "" }, // normal part
    { text: "Olivier ", class: "green" },        // green part
    { text: "here.", class: "" } // normal part
  ];

  const target = document.getElementById("text-typewriter");

  const cursor = document.createElement("span");
  cursor.classList.add("cursor", "green");
  cursor.textContent = "|";
  target.appendChild(cursor);

  let partIndex = 0;
  let charIndex = 0;

  function type() {
    if (partIndex < parts.length) {
      const part = parts[partIndex];

      if (charIndex < part.text.length) {
        if (part.class) {
          // create a span for styled characters
          const span = document.createElement("span");
          span.className = part.class;
          span.textContent = part.text[charIndex];
          target.insertBefore(span, cursor);
        } else {
          // plain text node
          cursor.insertAdjacentText("beforebegin", part.text[charIndex]);
        }

        charIndex++;
        setTimeout(type, 100); // typing speed
      } else {
        partIndex++;
        charIndex = 0;
        type(); // immediately start next part
      }
    } else {
      setTimeout(startMatrixRain(), 2000); // wait before starting matrix rain
    }
  }

  type();


  function startMatrixRain() {

    class RainChar {
      constructor(font, charSize, chars, bg, fg) {
        // Defining the parameters
        this.font = font;
        this.charSize = charSize;
        this.chars = chars;
        this.bg = bg;
        this.fg = fg;

        // Setting up the canvas
        const canvas = document.getElementById("matrix-bg");
        this.context = canvas.getContext("2d");
        const home = document.getElementById("home");
        this.size = [home.offsetWidth, home.offsetHeight];
        canvas.width = this.size[0];
        canvas.height = this.size[1];

        this.context.fillStyle = this.bg;
        this.context.fillRect(0, 0, ...this.size);

        // Creating the particles array
        this.particles = [];
        const particleCount =
          (this.size[0] * this.size[1]) / this.charSize ** 2 / 10;

        for (let i = 0; i < particleCount; i++) {
          this.particles.push(this.newParticle());
        }

        window.addEventListener("resize", () => this.resizeCanvas());
      }

      resizeCanvas() {
        const home = document.getElementById("home");
        this.size = [home.offsetWidth, home.offsetHeight];
        this.context.canvas.width = this.size[0];
        this.context.canvas.height = this.size[1];
      }

      newParticle() {
        return {
          x: Math.random() * this.size[0],
          y: -Math.random() * this.size[1] * 2,
          size: Math.floor(
            Math.random() * (this.charSize * 2 - this.charSize / 2) +
              this.charSize / 2
          )
        };
      }

      drawParticles() {
        this.context.fillStyle = this.fg;
        this.particles.forEach((particle) => {
          this.context.font = `${particle.size}px ${this.font}`;
          const randomChar = this.chars[
            Math.floor(Math.random() * this.chars.length)
          ];
          this.context.fillText(randomChar, particle.x, particle.y);
        });
      }

      updateParticles() {
        this.particles.forEach((particle) => {
          if (particle.y > this.size[1]) {
            Object.assign(particle, this.newParticle());
          } else {
            particle.y += particle.size;
          }
        });
      }

      clearCanvas() {
        this.context.globalAlpha = 0.25;
        this.context.fillStyle = this.bg;
        this.context.fillRect(0, 0, ...this.size);
        this.context.globalAlpha = 1;
      }

      drawFadeIn() {
      const fadeHeight = 100;
      const fadeStart = 0;
      const gradient = this.context.createLinearGradient(
        0, fadeStart, 0, fadeStart + fadeHeight
      );
      gradient.addColorStop(1, "rgba(10,25,47,0)"); // transparent
      gradient.addColorStop(0, "rgba(10,25,47,1)"); // solid navy

      this.context.fillStyle = gradient;
      this.context.fillRect(0, fadeStart, this.size[0], fadeHeight);
      }

      drawFadeOut() {
      const fadeHeight = 200; // px fade area
      const gradient = this.context.createLinearGradient(
        0, this.size[1] - fadeHeight, 0, this.size[1]
      );
      gradient.addColorStop(0, "rgba(10,25,47,0)"); // transparent
      gradient.addColorStop(1, "rgba(10,25,47,1)"); // solid navy

      this.context.fillStyle = gradient;
      this.context.fillRect(0, this.size[1] - fadeHeight, this.size[0], fadeHeight);
      }

      play() {
        this.clearCanvas();
        this.drawParticles();
        this.updateParticles();
        this.drawFadeIn();
        this.drawFadeOut();
        setTimeout(() => {this.play();}, 50);
      }
    }

    const chars = "ABCDEFGHIJKLMNOPRSTUVWXYZ";
    const rain = new RainChar("monospace", 20, chars, "rgb(10,25,47)", "rgba(100,255,219,0.2)");
    rain.play();
  }

});