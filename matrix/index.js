// We want to circulate a particle inside a cyclotron. The particles used are: e, p, n (electron, proton, and neutron). Each particle has a circulation function within the cyclotron, which can create either a closed or an open cycle.

// Find the algorithm that satisfies the following cases for each particle:

// Input
// [particle, matrix] ~> Example: cyclotron(“e”, matrix)

function cyclotron(params) {
	// Check if params exists, and is an array.
	if (!params || !Array.isArray(params)) return 'ERROR: Use cyclotron([particle, matrix])';
	
	// Check if informed params are valid.
  let particles = ['e', 'n', 'p']; // Valid particles
  const particle = params.length > 1 ? params[0] : null;
  const matrix = params.length > 1 ? params[1] : params[0];
  if (particle && (typeof particle !== 'string' || !particles.includes(particle))) return 'ERROR: Please inform valid particle';
  if ((matrix && typeof matrix !== 'number') || matrix < 1) return 'ERROR: Please inform matrix number higher than 0';

	// Prepares for response (no particle or neutron);
	let arrayRow = new Array(matrix).fill(1);
	
	// If particle is informed (and valid)
	let response = [];
	switch (particle) {
		case 'n': // Neutron
			const nRow = new Array(matrix).fill('n');
			response.push(nRow);
			break;

		case 'e': // Electron
			const eRow = new Array(matrix).fill('e');
			response.push(eRow);
			const newArrayRow = arrayRow.map((item, index) => index === (arrayRow.length - 1) ? 'e' : item)
			arrayRow = newArrayRow;
			break;
	
		case 'p': // Proton
			const pRow = new Array(matrix).fill('p');
			response = 'Proton';
			break;

		default: // Particle not informed
			response.push(arrayRow)
			break;
		}
		for (let i = 1; i < matrix; i++) response.push(arrayRow);
		return response;
}


// Params test
// console.log(cyclotron()); 											// Expects "ERROR: Use cyclotron([particle, matrix])"
// console.log(cyclotron({})); 										// Expects "ERROR: Use cyclotron([particle, matrix])"
// console.log(cyclotron('e', 3)); 								// Expects "ERROR: Use cyclotron([particle, matrix])"
// console.log(cyclotron(['not a particle', 4])); 	// Expects "ERROR: Please inform valid particle"
// console.log(cyclotron([5, 5])); 								// Expects "ERROR: Please inform valid particle"
// console.log(cyclotron([['e'], 6])); 						// Expects "ERROR: Please inform valid particle"
// console.log(cyclotron(['e', 0])); 							// Expects "ERROR: Please inform matrix number higher than 0"
// console.log(cyclotron(['e', 'x'])); 						// Expects "ERROR: Please inform matrix number higher than 0"
// console.log(cyclotron(['x'])); 									// Expects "ERROR: Please inform matrix number higher than 0"

// Content tests
console.log(cyclotron([5])); 										// Expects 5x5 matrix
console.log(cyclotron(['n', 4])); 							// Expects 4x4 Neutron matrix
console.log(cyclotron(['e', 4])); 							// Expects 4x4 Electron matrix
// console.log(cyclotron(['p', 5])); 							// Expects 5x5 Proton matrix