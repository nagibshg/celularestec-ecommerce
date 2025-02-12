import { Color, Product, VariantProduct } from '../interfaces';

// Function to format the price to dollars
export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
};

// Function to prepare products - (CELLULARS)
export const prepareProducts = (products: Product[]) => {
	return products.map(product => {
		// Group variants by color
		const colors = product.variants.reduce(
			(acc: Color[], variant: VariantProduct) => {
				const existingColor = acc.find(
					item => item.color === variant.color
				);

				if (existingColor) {
					// If the color is already available, we compare prices
					existingColor.price = Math.min(
						existingColor.price,
						variant.price
					);
				} // We maintain the minimum price
				else {
					acc.push({
						color: variant.color,
						price: variant.price,
						name: variant.color_name,
					});
				}

				return acc;
			},
			[]
		);

		// Obtain the lowest price of the grouped variants
		const price = Math.min(...colors.map(item => item.price));

		// Return the formatted product
		return {
			...product,
			price,
			colors: colors.map(({ name, color }) => ({ name, color })),
			variants: product.variants,
		};
	});
};