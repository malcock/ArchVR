import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

class ProductService {
  cachedSubscriptions: Array<Stripe.Product & { prices: Stripe.Price[] }>;

  constructor() {
    this.cachedSubscriptions = [];
  }

  async getSubscriptions() {
    if (this.cachedSubscriptions.length > 0) {
      return this.cachedSubscriptions;
    }
    const priceData = await stripe.prices.search({
      query: `type:'recurring' AND active:'true'`,
      expand: ["data.product"],
    });

    const products: Array<
      Partial<Stripe.Product & { prices: Stripe.Price[] }>
    > = [];

    priceData.data.forEach((price) => {
      const index = products
        .map((x) => x.id)
        .indexOf((price.product as Stripe.Product).id);
      const santizedPrice: Stripe.Price = {
        ...price,
        product: (price.product as Stripe.Product).id,
      };
      if (index < 0) {
        const newProdPrice: Stripe.Product & { prices: Stripe.Price[] } = {
          ...(price.product as Stripe.Product),
          prices: [santizedPrice],
        };
        products.push(newProdPrice);
      } else {
        products[index].prices?.push(santizedPrice);
      }
    });
    this.cachedSubscriptions = products as Array<
      Stripe.Product & { prices: Stripe.Price[] }
    >;

    return this.cachedSubscriptions;
  }
}

const productService = new ProductService();

export default productService;
