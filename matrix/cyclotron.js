// We want to circulate a particle inside a cyclotron. The particles used are: e, p, n (electron, proton, and neutron). Each particle has a circulation function within the cyclotron, which can create either a closed or an open cycle.

// Find the algorithm that satisfies the following cases for each particle:

// Input
// [particle, matrix] ~> Example: cyclotron(“e”, matrix)

function cyclotron(params) {
	// Check if params exists, and is an array.
	if (!params || !Array.isArray(params) || (Array.isArray(params) && params.length < 1)) return 'ERROR: Use cyclotron([particle, matrix])';

	// Check if informed params are valid.
	let particles = ['e', 'n', 'p']; // Valid particles
	const particle = params.length > 1 ? params[0] : null;
	const matrix = params.length > 1 ? params[1] : params[0];
	if (particle && (typeof particle !== 'string' || !particles.includes(particle))) return 'ERROR: Please inform valid particle';
	if ((matrix && typeof matrix !== 'number') || matrix < 4) return 'ERROR: Please inform matrix type number 4 or higher';

	// If particle is informed (and valid)
	let response = [];
	const firstLineFunction = (letter) => new Array(matrix).fill(letter);

	// Prepares for response (no particle or neutron);
	let arrayRow = firstLineFunction(1);

	switch (particle) {
		case 'n': // Neutron
			response.push(firstLineFunction('n'));
			break;

		case 'e': // Electron
			response.push(firstLineFunction('e'));
			const newArrayRow = arrayRow.map((item, index) => index === (arrayRow.length - 1) ? 'e' : item)
			arrayRow = newArrayRow;
			break;

		case 'p': // Proton
			response.push(firstLineFunction('p'));
			for (let i = 1; i < matrix; i++) response
				.push(arrayRow
					.map((item, index) => i === (matrix - 1)
						? index > (matrix - 2)
							? item
							: 'p'
						: index > 0 && index < (matrix - 1)
							? index === (matrix - 2) && i === (matrix - 2)
								? 'p'
								: item
							: 'p')
				);
			return response;

		default: // Particle not informed
			response.push(arrayRow)
			break;
	}
	for (let i = 1; i < matrix; i++) response.push(arrayRow);
	return response;
}

console.log(cyclotron(['p', 4]));

module.exports = cyclotron;
