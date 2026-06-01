import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Select } from '../../components/forms/Select';
import { usePrixStore } from '../../store/slices/prixSlice';
import { useAuthStore } from '../../store/slices/authSlice';

export const ConsulterPrix: React.FC = () => {
  const { user } = useAuthStore();
  const { prix, loadPrix, isLoading } = usePrixStore();
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const regions = [
    'Analamanga',
    'Vakinankaratra',
    'Itasy',
    'Alaotra-Mangoro',
    'Atsinanana',
    'Analamanjy',
    'Sofia',
    'Betsiboka',
    'Boeny',
    'Melaky',
    'Atsimo-Andrefana',
    'Androy',
    'Anosy',
    'Atsimo-Atsinanana',
    'Vatovavy',
    'Fitovinany',
    'Haute Matsiatra',
    'Amoron\'i Mania',
    'Vatovavy-Fitovinany',
    'Ihorombe',
    'Menabe',
  ];

  const products = [
    'riz',
    'mais',
    'tomate',
    'oignon',
    'pomme_de_terre',
    'carotte',
    'chou',
    'poivron',
    'aubergine',
  ];

  useEffect(() => {
    loadPrix(selectedRegion || undefined, selectedProduct || undefined);
  }, [selectedRegion, selectedProduct, loadPrix]);

  const filteredPrix = prix.filter((p) => {
    if (selectedRegion && p.region !== selectedRegion) return false;
    if (selectedProduct && p.product !== selectedProduct) return false;
    return true;
  });

  const getPrixByProduct = (product: string) => {
    const productPrix = filteredPrix.filter((p) => p.product === product);
    if (productPrix.length === 0) return null;
    const avgPrice = productPrix.reduce((sum, p) => sum + p.priceAr, 0) / productPrix.length;
    const minPrice = Math.min(...productPrix.map((p) => p.priceAr));
    const maxPrice = Math.max(...productPrix.map((p) => p.priceAr));
    return { avgPrice, minPrice, maxPrice, count: productPrix.length };
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Prix du marché</h1>
          <p className="text-gray-600">Consultez les prix en temps réel dans votre région</p>
        </CardHeader>
        <CardBody>
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Région
              </label>
              <Select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">Toutes les régions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produit
              </label>
              <Select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Tous les produits</option>
                {products.map((product) => (
                  <option key={product} value={product}>
                    {product.charAt(0).toUpperCase() + product.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredPrix.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune donnée de prix disponible
            </div>
          ) : (
            <div className="space-y-4">
              {selectedProduct ? (
                // Affichage détaillé pour un produit spécifique
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-4">
                      {selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1).replace('_', ' ')}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {getPrixByProduct(selectedProduct)?.minPrice.toLocaleString()} Ar
                        </div>
                        <div className="text-sm text-gray-600">Prix min</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(getPrixByProduct(selectedProduct)?.avgPrice || 0).toLocaleString()} Ar
                        </div>
                        <div className="text-sm text-gray-600">Prix moyen</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {getPrixByProduct(selectedProduct)?.maxPrice.toLocaleString()} Ar
                        </div>
                        <div className="text-sm text-gray-600">Prix max</div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                // Affichage par produit
                products.map((product) => {
                  const productData = getPrixByProduct(product);
                  if (!productData) return null;
                  return (
                    <Card key={product}>
                      <CardBody>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {product.charAt(0).toUpperCase() + product.slice(1).replace('_', ' ')}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {productData.count} signalement(s)
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">
                              {Math.round(productData.avgPrice).toLocaleString()} Ar
                            </div>
                            <div className="text-sm text-gray-500">
                              {productData.minPrice.toLocaleString()} - {productData.maxPrice.toLocaleString()} Ar
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* Info offline */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 Les données sont mises à jour automatiquement quand vous êtes connecté.
              En mode offline, vous voyez les dernières données enregistrées.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
