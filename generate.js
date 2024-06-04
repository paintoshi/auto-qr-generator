const fs = require('fs');
const qr = require('./qr-code.js');
const { createCanvas } = require('canvas');

const size = 512; // Width and Height in px
const radius = 0.5; // 0.0 to 0.5
const ecLevel = 'M'; // L, M, Q, H
// Foreground color with radial gradient
const fill = {
  type: 'radial-gradient', // or 'linear-gradient'
  position: [ 0.5,0.5,0, 0.5,0.5,0.75 ], //xPos,yPos,radius of inner and outer circle where position is 0-1 of full dimension
  colorStops: [
    [ 0, '#376ab4' ], //from 0 to 100% (0-1)
    [ 1, '#000034' ],
  ]
}
// const fill = '#000000' // Solid foreground color
const background = null; // color or null for transparent

const filePath = process.argv[2]; // Get the file path from the second argument

if (!filePath) {
  console.error('Please provide a text file path as an argument. Usage: node generate <file_path>');
  process.exit(1);
}

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  const codes = data.split('\n');

  codes.forEach((code, index) => {
    if (!code.trim()) return; // Skip empty lines

    const canvas = createCanvas(size, size);

    qr.render({
      text: code.trim(),
      radius: radius,
      ecLevel: ecLevel,
      fill: fill,
      background: background,
      size: size,
    }, canvas);

    const filename = `qr-output/qr-${String(index + 1).padStart(6, '0')}.png`;
    const out = fs.createWriteStream(filename);
    const stream = canvas.createPNGStream();

    stream.pipe(out);
    out.on('finish', () => console.log(`QR code saved: ${filename}`));
  });
});
