var pretag = document.getElementById("d");

var axisA = 1;
var axisB = 1;

var thetaSpacing = 0.07;
var phiSpacing = 0.02;

var twoPI = 6.28;

var asciiFrame = () => {
  var output = [];
  var zBuffer = [];

  axisA += thetaSpacing;
  axisB += phiSpacing;

  var cosAxisA = Math.cos(axisA);
  var sinAxisA = Math.sin(axisA);
  var cosAxisB = Math.cos(axisB);
  var sinAxisB = Math.sin(axisB);

  for (var k = 0; k < 1760; k++) {
    output[k] = k % 80 == 79 ? "\n" : " ";
    zBuffer[k] = 0;
  }

  for (var theta = 0; theta < twoPI; theta += thetaSpacing) {
    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);

    for (var phi = 0; phi < twoPI; phi += phiSpacing) {
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var circleX = cosTheta + 2; // R1 + R2 * cos(theta)
      var circleY = sinPhi * circleX * cosAxisA - sinTheta * sinAxisA; // This is a clever factoring of some of the terms in x' and y'
      var z_1 = 1 / (sinPhi * circleX * sinAxisA + sinTheta * cosAxisA + 5); // This is 1/z

      var x = 0 | (40 + 30 * z_1 * (cosPhi * circleX * cosAxisB - circleY * sinAxisB));
      var y = 0 | (12 + 15 * z_1 * (cosPhi * circleX * sinAxisB + circleY * cosAxisB));
      var charIndex = x + 80 * y;
      
      var luminance = 0 | (8 *
            ((sinTheta * sinAxisA - sinPhi * cosTheta * cosAxisA) * cosAxisB -
              sinPhi * cosTheta * sinAxisA -
              sinTheta * cosAxisA -
              cosPhi * cosTheta * sinAxisB));

      if (y < 22 && y >= 0 && x >= 0 && x < 79 && z_1 > zBuffer[charIndex]) {
        zBuffer[charIndex] = z_1;
        output[charIndex] = ".,-~:;=!*#$@"[luminance > 0 ? luminance : 0];
      }
    }
  }

  pretag.innerHTML = output.join("");
};

setInterval(asciiFrame, 50)
