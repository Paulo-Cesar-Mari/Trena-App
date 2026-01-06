import { storage } from "./storage";
import { faker } from "@faker-js/faker";
import type { InsertUser } from "@shared/schema";

// Função para embaralhar um array
function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function seedDatabase() {
  console.log("Verificando se o banco de dados precisa ser semeado...");

  const products = await storage.getProducts();
  const services = await storage.getServices();

  if (products.length > 0 || services.length > 0) {
    console.log("O banco de dados já contém dados. Semeação não necessária.");
    return;
  }

  console.log("Semeando o banco de dados...");

  // --- 1. GERAR USUÁRIOS ---
  const userTypes: InsertUser['role'][] = [
    ...Array(8).fill('store'),      // 8 Lojas
    ...Array(7).fill('provider'),   // 7 Prestadores
    ...Array(5).fill('consumer'),   // 5 Consumidores
  ];

  const shuffledUserTypes = shuffle(userTypes);
  const createdUsers = [];

  for (const role of shuffledUserTypes) {
    const user = await storage.createUser({
      username: faker.internet.username(),
      password: "password", // Senha simples para teste
      name: faker.person.fullName(),
      role: role,
      email: faker.internet.email(),
      location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
      bio: faker.lorem.sentence(),
      avatar: faker.image.avatar(),
    });
    createdUsers.push(user);
  }

  // --- 2. GERAR PRODUTOS ---
  const stores = createdUsers.filter(u => u.role === 'store');
  const productTitles = [
    "Cimento Votoran Todas as Obras 50kg", "Argamassa ACIII Quartzolit 20kg", "Tijolo Baiano 9 Furos (Milheiro)",
    "Tinta Acrílica Fosca Suvinil 18L", "Vergalhão de Aço CA-50 10mm (Barra 12m)", "Areia Média Lavada (Metro Cúbico)",
    "Pedra Brita N° 1 (Metro Cúbico)", "Telha de Cerâmica Portuguesa (Unidade)", "Caixa d'Água Fortlev 1000L",
    "Fio Elétrico Flexível 2.5mm (Rolo 100m)", "Tubo de PVC Esgoto 100mm (Barra 6m)", "Janela de Alumínio Veneziana 1.20x1.00m",
    "Porta de Madeira Maciça Angelim 2.10x0.80m", "Vaso Sanitário com Caixa Acoplada Deca", "Piso Porcelanato Retificado 60x60cm (m²)",
    "Furadeira de Impacto Bosch 650W", "Serra Mármore Makita 1400W", "Betoneira 400L", "Carrinho de Mão Tramontina",
    "Kit de Ferramentas com 110 Peças", "Lâmpada LED Bulbo 9W Branca", "Disjuntor Unipolar 20A", "Chuveiro Elétrico Lorenzetti 5500W",
    "Torneira para Cozinha de Parede", "Gabinete de Banheiro com Espelho", "Impermeabilizante Vedacit 18L",
    "Manta Asfáltica 3mm (Rolo 10m)", "Escada de Alumínio 5 Degraus", "Luva de Segurança em Malha", "Óculos de Proteção"
  ];

  for (let i = 0; i < 30; i++) {
    const randomStore = stores[Math.floor(Math.random() * stores.length)];
    await storage.createProduct({
      sellerId: randomStore.id,
      title: productTitles[i % productTitles.length],
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(["Cimento", "Tinta", "Ferramentas", "Elétrica", "Hidráulica", "Madeira", "Aço"]),
      price: faker.commerce.price({ min: 10, max: 500, dec: 2 }),
      image: `https://placehold.co/600x400?text=${encodeURIComponent(productTitles[i % productTitles.length])}`,
      location: randomStore.location || `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
      storeName: randomStore.name,
      contactPhone: faker.string.numeric(11),
    });
  }

  // --- 3. GERAR SERVIÇOS ---
  const providers = createdUsers.filter(u => u.role === 'provider');
  const serviceTypes = [
    "Pedreiro", "Eletricista", "Encanador", "Pintor", "Gesseiro", "Marceneiro",
    "Serralheiro", "Vidraceiro", "Arquiteto", "Engenheiro Civil", "Mestre de Obras",
    "Azulejista", "Instalador de Drywall", "Calheiro", "Telhadista"
  ];

  for (let i = 0; i < 15; i++) {
    const randomProvider = providers[Math.floor(Math.random() * providers.length)];
    await storage.createService({
      providerId: randomProvider.id,
      name: randomProvider.name,
      serviceType: serviceTypes[i % serviceTypes.length],
      description: faker.lorem.paragraph(),
      location: randomProvider.location || `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
      contactInfo: faker.phone.number(),
      image: `https://placehold.co/400x400?text=${serviceTypes[i % serviceTypes.length]}`,
      hourlyRate: faker.commerce.price({ min: 50, max: 200, dec: 2 }),
    });
  }

  console.log("Banco de dados semeado com sucesso.");
}
