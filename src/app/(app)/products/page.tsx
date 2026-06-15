import { requireAuth } from "@/lib/auth/session";
import { listProducts } from "@/services/product-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction } from "@/app/actions/domain";

export default async function ProductsPage() {
  const auth = await requireAuth();
  const products = await listProducts(auth);

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <section className="space-y-4">
        <PageHeader
          title="Produtos"
          description="Catálogo do consultório para indicações nas sessões"
        />
        <div className="space-y-2">
          {products.map((product) => (
            <Card key={product.id}>
              <p className="font-medium text-gray-900">{product.name}</p>
              {product.description && (
                <p className="text-sm text-gray-600">{product.description}</p>
              )}
            </Card>
          ))}
        </div>
      </section>
      <section>
        <Card className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Novo produto</h2>
          <form action={createProductAction} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input className="mt-1" id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea className="mt-1 min-h-20" id="description" name="description" />
            </div>
            <Button type="submit">Adicionar</Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
