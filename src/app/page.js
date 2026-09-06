import products from "@/content/products.json";
import bebidas from "@/content/bebidas.json";
import extras from "@/content/extras.json";
import OrderBuilder from "@/components/OrderBuilder";

export default function Home() {
  return (
    <main>
      <header className="border-bottom border-gray py-2">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="fs-1 mb-0">
                COMBINA <small className="small-xs text-primary text-uppercase">Kiosko</small>
              </h1>
            </div>
          </div>
        </div>
      </header>
      <section className="py-5">
        <div className="container">
          <OrderBuilder products={products} bebidas={bebidas} extras={extras} />
        </div>
      </section>
    </main>
  );
}
