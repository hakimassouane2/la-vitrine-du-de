function weightedRandom<T>(elements: readonly T[], weigths: readonly number[]) {
	if (elements.length === 0) {
		return undefined
	}

	if (elements.length !== weigths.length) {
		return elements[0]
	}

	const rand = Math.random()
  let sum = 0

	for (const [i, element] of elements.entries()) {
		sum += weigths[i]

		if (rand <= sum) {
			return element
		}
	}

	return elements[0]
}

export { weightedRandom }
