import { Color, Product, VariantProduct } from '../interfaces';

// Función para formatear el precio a dólares
export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
};

// Función de preparación de productos - (CELULARES)
export const prepareProducts = (products: Product[]) => {
	return products.map(product => {
		// Agrupar variantes por color
		const colors = product.variants.reduce(
			(acc: Color[], variant: VariantProduct) => {
				const existingColor = acc.find(
					item => item.color === variant.color
				);

				if (existingColor) {
					// Si el color ya está disponible, comparamos precios
					existingColor.price = Math.min(
						existingColor.price,
						variant.price
					);
				} // Mantenemos el precio mínimo
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

		// Obtener el precio más bajo de las variantes agrupadas
		const price = Math.min(...colors.map(item => item.price));

		// Devuelve el producto formateado
		return {
			...product,
			price,
			colors: colors.map(({ name, color }) => ({ name, color })),
			variants: product.variants,
		};
	});
};