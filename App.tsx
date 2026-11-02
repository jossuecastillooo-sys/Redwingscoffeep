import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  Home,
  Coffee,
  UserRound,
  Plus,
  Minus,
  X,
  ChevronRight,
  Heart,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  Star,
  Tag,
  Gift,
  Package,
  ClipboardList,
  ArrowLeft,
  MinusCircle,
  PlusCircle,
} from "lucide-react";


import "../index.css";

/* =====================================================
   REDWINGS COFFEE
   TIENDA PÚBLICA
   PARTE 1: TIPOS, PRODUCTOS Y CONFIGURACIÓN
===================================================== */

type Category =
  | "Granitas"
  | "Frappés"
  | "Bolis"
  | "Café";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  popular?: boolean;
  available?: boolean;
  tags?: string[];
};

type Extra = {
  id: string;
  name: string;
  price: number;
  appliesTo: Category[];
};

type CartExtra = {
  extra: Extra;
  quantity: number;
};

type CartItem = {
  product: Product;
  quantity: number;
  extras: CartExtra[];
};

type Customer = {
  name: string;
  phone: string;
  career: string;
  section: string;
};

type OrderStatus =
  | "Recibido"
  | "Confirmado"
  | "Preparando"
  | "Listo para recoger"
  | "Entregado"
  | "Cancelado";

type Order = {
  id: string;
  code: string;
  date: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string;
  status: OrderStatus;
  payment: "Efectivo";
  delivery: "Recogida en instituto" | "Entrega coordinada";
};

type Coupon = {
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minimum: number;
  active: boolean;
};

type Promotion = {
  id: string;
  title: string;
  description: string;
  label: string;
  active: boolean;
};

/* =====================================================
   CONFIGURACIÓN GENERAL
===================================================== */

const STORE_NAME = "Redwings Coffee";

const WHATSAPP_NUMBER = "50492899752";

const STORAGE_KEYS = {
  cart: "redwings_cart_v1",
  favorites: "redwings_favorites_v1",
  orders: "redwings_orders_v1",
  customer: "redwings_customer_v1",
  points: "redwings_points_v1",
};

/* =====================================================
   PRODUCTOS
===================================================== */

const products: Product[] = [
  {
    id: "granita-tradicional",
    name: "Granita tradicional",
    description: "Café frío con sabor intenso.",
    price: 45,
    category: "Granitas",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700",
    popular: true,
    available: true,
    tags: ["Café", "Frío", "Popular"],
  },

  {
    id: "granita-crema",
    name: "Granita con crema",
    description: "Café frío acompañado de crema suave.",
    price: 50,
    category: "Granitas",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700",
    popular: true,
    available: true,
    tags: ["Café", "Crema"],
  },

  {
    id: "frappe-cafe",
    name: "Frappé de café",
    description: "Frappé de café con lechera.",
    price: 55,
    category: "Frappés",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700",
    popular: true,
    available: true,
    tags: ["Café", "Frappé"],
  },

  {
    id: "frappe-pinguinera",
    name: "Frappé Pinguinera",
    description: "Una mezcla cremosa para disfrutar.",
    price: 65,
    category: "Frappés",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700",
    available: true,
    tags: ["Frappé", "Especial"],
  },

  {
    id: "frappe-oreo",
    name: "Frappé Oreo",
    description: "Frappé con sabor a Oreo.",
    price: 70,
    category: "Frappés",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700",
    popular: true,
    available: true,
    tags: ["Oreo", "Frappé"],
  },

  {
    id: "boli-oreo",
    name: "Boli Oreo",
    description: "Boli largo con sabor a Oreo.",
    price: 30,
    category: "Bolis",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700",
    available: true,
    tags: ["Oreo", "Boli"],
  },

  {
    id: "cafe-tradicional",
    name: "Café tradicional",
    description: "Café Redwings en presentación de 1 libra.",
    price: 150,
    category: "Café",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700",
    available: true,
    tags: ["Café", "1 libra"],
  },

  {
    id: "cafe-pimienta",
    name: "Café con pimienta",
    description: "Café Redwings con pimienta en presentación de 1 libra.",
    price: 165,
    category: "Café",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700",
    available: true,
    tags: ["Café", "1 libra", "Especial"],
  },
];

/* =====================================================
   EXTRAS
===================================================== */

const extras: Extra[] = [
  {
    id: "crema-batida",
    name: "Crema batida",
    price: 8,
    appliesTo: ["Granitas", "Frappés"],
  },

  {
    id: "oreo-extra",
    name: "Oreo extra",
    price: 8,
    appliesTo: ["Granitas", "Frappés", "Bolis"],
  },

  {
    id: "pinguino-extra",
    name: "Pinguino extra",
    price: 5,
    appliesTo: ["Granitas", "Frappés"],
  },

  {
    id: "lechera-extra",
    name: "Lechera",
    price: 5,
    appliesTo: ["Granitas", "Frappés"],
  },

  {
    id: "caramelo-hersheys",
    name: "Caramelo Hershey's",
    price: 6,
    appliesTo: ["Granitas", "Frappés"],
  },
];

/* =====================================================
   CATEGORÍAS
===================================================== */

const categories = [
  "Todos",
  "Granitas",
  "Frappés",
  "Bolis",
  "Café",
] as const;

type CategoryFilter = (typeof categories)[number];

/* =====================================================
   PROMOCIONES
===================================================== */

const promotions: Promotion[] = [
  {
    id: "promo-favoritos",
    title: "Tu pausa favorita",
    description:
      "Descubre nuestros cafés fríos y frappés favoritos.",
    label: "Favoritos Redwings",
    active: true,
  },

  {
    id: "promo-combos",
    title: "Combos especiales",
    description:
      "Próximamente podrás disfrutar de combos para compartir.",
    label: "Próximamente",
    active: true,
  },
];

/* =====================================================
   CUPONES
===================================================== */

const coupons: Coupon[] = [
  {
    code: "REDWINGS5",
    description: "5% de descuento en tu compra.",
    type: "percentage",
    value: 5,
    minimum: 100,
    active: true,
  },

  {
    code: "CAFE10",
    description: "L 10 de descuento en compras desde L 150.",
    type: "fixed",
    value: 10,
    minimum: 150,
    active: true,
  },
];

/* =====================================================
   FUNCIONES GENERALES
===================================================== */

function money(value: number): string {
  return `L ${value.toFixed(2)}`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("es-HN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function createOrderCode(): string {
  const random = Math.floor(100000 + Math.random() * 900000);

  return `RW-${random}`;
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Si el almacenamiento no está disponible,
    // la aplicación continúa funcionando en memoria.
  }
}

function calculateItemTotal(item: CartItem): number {
  const productTotal = item.product.price * item.quantity;

  const extrasTotal = item.extras.reduce(
    (total, cartExtra) =>
      total + cartExtra.extra.price * cartExtra.quantity,
    0,
  );

  return productTotal + extrasTotal;
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0,
  );
}

/* =====================================================
   FIN DE LA PARTE 1
   La parte 2 continúa con el componente App,
   estados, carrito, favoritos, persistencia y funciones.
===================================================== *//* =====================================================
   COMPONENTE PRINCIPAL
   PARTE 2: ESTADOS Y FUNCIONES
===================================================== */

export default function App() {
  /* ===================================================
     ESTADOS PRINCIPALES
  =================================================== */

  const [category, setCategory] =
    useState<CategoryFilter>("Todos");

  const [search, setSearch] = useState("");

  const [cart, setCart] = useState<CartItem[]>(() =>
    safeRead<CartItem[]>(STORAGE_KEYS.cart, []),
  );

  const [favorites, setFavorites] = useState<string[]>(() =>
    safeRead<string[]>(STORAGE_KEYS.favorites, []),
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    safeRead<Order[]>(STORAGE_KEYS.orders, []),
  );

  const [customer, setCustomer] = useState<Customer>(() =>
    safeRead<Customer>(STORAGE_KEYS.customer, {
      name: "",
      phone: "",
      career: "",
      section: "",
    }),
  );

  const [points, setPoints] = useState<number>(() =>
    safeRead<number>(STORAGE_KEYS.points, 0),
  );

  /* ===================================================
     ESTADOS DE INTERFAZ
  =================================================== */

  const [cartOpen, setCartOpen] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const [ordersOpen, setOrdersOpen] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [productDetailsOpen, setProductDetailsOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [orderComplete, setOrderComplete] = useState(false);

  const [orderCode, setOrderCode] = useState("");

  const [couponInput, setCouponInput] = useState("");

  const [appliedCoupon, setAppliedCoupon] =
    useState<Coupon | null>(null);

  const [couponMessage, setCouponMessage] = useState("");

  const [notification, setNotification] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /* ===================================================
     PERSISTENCIA LOCAL
  =================================================== */

  useEffect(() => {
    safeWrite(STORAGE_KEYS.cart, cart);
  }, [cart]);

  useEffect(() => {
    safeWrite(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    safeWrite(STORAGE_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    safeWrite(STORAGE_KEYS.customer, customer);
  }, [customer]);

  useEffect(() => {
    safeWrite(STORAGE_KEYS.points, points);
  }, [points]);

  /* ===================================================
     NOTIFICACIONES
  =================================================== */

  function showNotification(message: string) {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2800);
  }

  /* ===================================================
     PRODUCTOS FILTRADOS
  =================================================== */

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "Todos" ||
        product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.tags?.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch),
        );

      return (
        matchesCategory &&
        matchesSearch &&
        product.available !== false
      );
    });
  }, [category, search]);

  /* ===================================================
     PRODUCTOS FAVORITOS
  =================================================== */

  const favoriteProducts = useMemo(() => {
    return products.filter((product) =>
      favorites.includes(product.id),
    );
  }, [favorites]);

  /* ===================================================
     CONTADOR DEL CARRITO
  =================================================== */

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  /* ===================================================
     SUBTOTAL
  =================================================== */

  const subtotal = useMemo(() => {
    return calculateSubtotal(cart);
  }, [cart]);

  /* ===================================================
     CUPÓN Y DESCUENTO
  =================================================== */

  const discount = useMemo(() => {
    if (!appliedCoupon || !appliedCoupon.active) {
      return 0;
    }

    if (subtotal < appliedCoupon.minimum) {
      return 0;
    }

    if (appliedCoupon.type === "percentage") {
      return Math.min(
        subtotal,
        subtotal * (appliedCoupon.value / 100),
      );
    }

    return Math.min(
      subtotal,
      appliedCoupon.value,
    );
  }, [subtotal, appliedCoupon]);

  const total = Math.max(
    0,
    subtotal - discount,
  );

  /* ===================================================
     AGREGAR PRODUCTO AL CARRITO
  =================================================== */

  function addProduct(product: Product) {
    if (product.available === false) {
      showNotification("Este producto no está disponible.");
      return;
    }

    setCart((previous) => {
      const existing = previous.find(
        (item) => item.product.id === product.id,
      );

      if (existing) {
        return previous.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...previous,
        {
          product,
          quantity: 1,
          extras: [],
        },
      ];
    });

    showNotification(`${product.name} agregado al carrito`);
  }

  /* ===================================================
     CAMBIAR CANTIDAD
  =================================================== */

  function changeQuantity(
    productId: string,
    amount: number,
  ) {
    setCart((previous) =>
      previous
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  item.quantity + amount,
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  /* ===================================================
     ELIMINAR PRODUCTO DEL CARRITO
  =================================================== */

  function removeProduct(productId: string) {
    setCart((previous) =>
      previous.filter(
        (item) => item.product.id !== productId,
      ),
    );

    showNotification("Producto eliminado del carrito");
  }

  /* ===================================================
     VACIAR CARRITO
  =================================================== */

  function clearCart() {
    setCart([]);
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage("");

    showNotification("Carrito vaciado");
  }

  /* ===================================================
     AGREGAR EXTRA A UN PRODUCTO
  =================================================== */

  function addExtra(
    productId: string,
    extraId: string,
  ) {
    const extra = extras.find(
      (item) => item.id === extraId,
    );

    if (!extra) {
      return;
    }

    setCart((previous) =>
      previous.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        const allowed = extra.appliesTo.includes(
          item.product.category,
        );

        if (!allowed) {
          return item;
        }

        const existingExtra = item.extras.find(
          (cartExtra) =>
            cartExtra.extra.id === extraId,
        );

        if (existingExtra) {
          return {
            ...item,
            extras: item.extras.map((cartExtra) =>
              cartExtra.extra.id === extraId
                ? {
                    ...cartExtra,
                    quantity:
                      cartExtra.quantity + 1,
                  }
                : cartExtra,
            ),
          };
        }

        return {
          ...item,
          extras: [
            ...item.extras,
            {
              extra,
              quantity: 1,
            },
          ],
        };
      }),
    );

    showNotification(`${extra.name} agregado`);
  }

  /* ===================================================
     CAMBIAR CANTIDAD DE EXTRA
  =================================================== */

  function changeExtraQuantity(
    productId: string,
    extraId: string,
    amount: number,
  ) {
    setCart((previous) =>
      previous.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        return {
          ...item,
          extras: item.extras
            .map((cartExtra) =>
              cartExtra.extra.id === extraId
                ? {
                    ...cartExtra,
                    quantity: Math.max(
                      0,
                      cartExtra.quantity + amount,
                    ),
                  }
                : cartExtra,
            )
            .filter(
              (cartExtra) =>
                cartExtra.quantity > 0,
            ),
        };
      }),
    );
  }

  /* ===================================================
     FAVORITOS
  =================================================== */

  function toggleFavorite(productId: string) {
    const alreadyFavorite =
      favorites.includes(productId);

    setFavorites((previous) =>
      alreadyFavorite
        ? previous.filter(
            (id) => id !== productId,
          )
        : [...previous, productId],
    );

    showNotification(
      alreadyFavorite
        ? "Eliminado de favoritos"
        : "Agregado a favoritos",
    );
  }

  /* ===================================================
     DETALLES DEL PRODUCTO
  =================================================== */

  function openProductDetails(product: Product) {
    setSelectedProduct(product);
    setProductDetailsOpen(true);
  }

  function closeProductDetails() {
    setSelectedProduct(null);
    setProductDetailsOpen(false);
  }

  /* ===================================================
     APLICAR CUPÓN
  =================================================== */

  function applyCoupon() {
    const normalizedCode = couponInput
      .trim()
      .toUpperCase();

    if (!normalizedCode) {
      setCouponMessage("Escribe un código de cupón.");
      return;
    }

    const coupon = coupons.find(
      (item) =>
        item.code === normalizedCode &&
        item.active,
    );

    if (!coupon) {
      setAppliedCoupon(null);
      setCouponMessage("El cupón no es válido.");
      return;
    }

    if (subtotal < coupon.minimum) {
      setAppliedCoupon(null);

      setCouponMessage(
        `Compra mínima: ${money(coupon.minimum)}`,
      );

      return;
    }

    setAppliedCoupon(coupon);

    setCouponMessage(
      `Cupón aplicado: ${coupon.description}`,
    );

    showNotification("Cupón aplicado correctamente");
  }

  /* ===================================================
     QUITAR CUPÓN
  =================================================== */

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage("");

    showNotification("Cupón eliminado");
  }

  /* ===================================================
     ACTUALIZAR DATOS DEL CLIENTE
  =================================================== */

  function updateCustomer(
    field: keyof Customer,
    value: string,
  ) {
    setCustomer((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  /* ===================================================
     VALIDAR DATOS DEL CLIENTE
  =================================================== */

  function validateCustomer(): boolean {
    if (!customer.name.trim()) {
      showNotification("Completa tu nombre.");
      return false;
    }

    if (!customer.career.trim()) {
      showNotification("Completa tu carrera.");
      return false;
    }

    if (!customer.section.trim()) {
      showNotification("Completa tu sección.");
      return false;
    }

    if (cart.length === 0) {
      showNotification("Tu carrito está vacío.");
      return false;
    }

    return true;
  }

  /* ===================================================
     CREAR PEDIDO
  =================================================== */

  function createOrder(
    delivery: Order["delivery"],
  ): Order | null {
    if (!validateCustomer()) {
      return null;
    }

    const order: Order = {
      id: crypto.randomUUID(),
      code: createOrderCode(),
      date: new Date().toISOString(),
      customer: {
        ...customer,
      },
      items: cart.map((item) => ({
        ...item,
        extras: item.extras.map((extra) => ({
          ...extra,
        })),
      })),
      subtotal,
      discount,
      total,
      coupon: appliedCoupon?.code,
      status: "Recibido",
      payment: "Efectivo",
      delivery,
    };

    setOrders((previous) => [
      order,
      ...previous,
    ]);

    setOrderCode(order.code);

    setOrderComplete(true);

    setCart([]);

    setAppliedCoupon(null);

    setCouponInput("");

    setCouponMessage("");

    setCheckoutOpen(false);

    setCartOpen(false);

    setPoints((previous) =>
      previous + Math.floor(order.total / 50),
    );

    return order;
  }

  /* ===================================================
     PREPARAR MENSAJE DE WHATSAPP
  =================================================== */

  function createWhatsAppMessage(order: Order): string {
    return [
      `☕ ${STORE_NAME.toUpperCase()}`,
      "",
      `Pedido: ${order.code}`,
      `Fecha: ${formatDate(order.date)}`,
      "",
      `Cliente: ${order.customer.name}`,
      `Carrera: ${order.customer.career}`,
      `Sección: ${order.customer.section}`,
      `Teléfono: ${order.customer.phone || "No indicado"}`,
      "",
      "PRODUCTOS:",
      ...order.items.map((item) => {
        const extrasText = item.extras
          .map(
            (extra) =>
              `  + ${extra.quantity}x ${extra.extra.name}`,
          )
          .join("\n");

        return [
          `${item.quantity}x ${item.product.name}`,
          `  ${money(calculateItemTotal(item))}`,
          extrasText,
        ]
          .filter(Boolean)
          .join("\n");
      }),
      "",
      `Subtotal: ${money(order.subtotal)}`,
      `Descuento: ${money(order.discount)}`,
      `TOTAL: ${money(order.total)}`,
      "",
      `Pago: ${order.payment}`,
      `Entrega: ${order.delivery}`,
      "",
      "Estado inicial: Recibido",
    ].join("\n");
  }

  /* ===================================================
     ENVIAR PEDIDO A WHATSAPP
  =================================================== */

  function sendOrderToWhatsApp(order: Order) {
    const message = createWhatsAppMessage(order);

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer",
    );
  }

  /* ===================================================
     CONFIRMAR PEDIDO
  =================================================== */

  function submitOrder() {
    const order = createOrder(
      "Recogida en instituto",
    );

    if (!order) {
      return;
    }

    sendOrderToWhatsApp(order);

    showNotification(
      `Pedido ${order.code} creado`,
    );
  }

  /* ===================================================
     CANCELAR PEDIDO LOCAL
  =================================================== */

  function cancelOrder(orderId: string) {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId &&
        order.status === "Recibido"
          ? {
              ...order,
              status: "Cancelado",
            }
          : order,
      ),
    );

    showNotification("Pedido actualizado");
  }

  /* ===================================================
     BUSCAR PEDIDO POR CÓDIGO
  =================================================== */

  function findOrderByCode(code: string) {
    const normalizedCode = code
      .trim()
      .toUpperCase();

    return orders.find(
      (order) =>
        order.code.toUpperCase() ===
        normalizedCode,
    );
  }

  /* ===================================================
     ABRIR WHATSAPP DE CONTACTO
  =================================================== */

  function openWhatsAppContact() {
    const message =
      "Hola Redwings Coffee, quiero consultar sobre un pedido.";

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer",
    );
  }

  /* ===================================================
     NAVEGACIÓN
  =================================================== */

  function goToMenu() {
    setCartOpen(false);
    setFavoritesOpen(false);
    setOrdersOpen(false);
    setProfileOpen(false);

    document
      .getElementById("rw-menu")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  function goToHome() {
    setCartOpen(false);
    setFavoritesOpen(false);
    setOrdersOpen(false);
    setProfileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* ===================================================
     FIN DE PARTE 2
     PARTE 3: INTERFAZ VISUAL Y COMPONENTES JSX
  =================================================== */  /* =====================================================
     HEADER
  ===================================================== */

  return (
    <div className="rw-app">
      {/* NOTIFICACIÓN */}
      {notification && (
        <div className="rw-toast">
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="rw-header">
        <button
          className="rw-brand"
          onClick={goToHome}
          aria-label="Redwings Coffee inicio"
        >
          <div className="rw-logo">
            <Coffee size={25} />
          </div>

          <div>
            <h1>Redwings</h1>
            <span>COFFEE</span>
          </div>
        </button>

        <div className="rw-header-actions">
          <button
            className="rw-icon-button"
            onClick={() => setFavoritesOpen(true)}
            aria-label="Favoritos"
          >
            <Heart size={21} />

            {favorites.length > 0 && (
              <span className="rw-cart-count">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            className="rw-cart-button"
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrito"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="rw-cart-count">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="rw-hero">
        <div className="rw-hero-content">
          <span className="rw-eyebrow">
            TU CAFÉ FAVORITO
          </span>

          <h2>
            Tu momento.
            <br />
            <span>Tu café.</span>
          </h2>

          <p>
            Sabores que convierten cualquier pausa
            en tu momento favorito.
          </p>

          <button
            className="rw-primary-button"
            onClick={goToMenu}
          >
            Explorar menú
            <ChevronRight size={18} />
          </button>

          <div className="rw-hero-note">
            <Coffee size={16} />
            <span>Una pausa con sabor Redwings</span>
          </div>
        </div>

        <div className="rw-hero-image">
          <img
            src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900"
            alt="Café frío"
          />

          <div className="rw-hero-badge">
            <Coffee size={16} />
            <span>Hecho para disfrutar</span>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="rw-benefits">
        <div className="rw-benefit">
          <Coffee size={20} />

          <div>
            <strong>Tu café favorito</strong>
            <span>Sabores para disfrutar</span>
          </div>
        </div>

        <div className="rw-benefit">
          <Clock size={20} />

          <div>
            <strong>Pedido sencillo</strong>
            <span>Ordena en minutos</span>
          </div>
        </div>

        <div className="rw-benefit">
          <MapPin size={20} />

          <div>
            <strong>Recogida</strong>
            <span>En el instituto</span>
          </div>
        </div>
      </section>

      {/* PROMOCIONES */}
      <section className="rw-promotions">
        <div className="rw-section-heading">
          <div>
            <span className="rw-eyebrow">
              ESPECIAL REDWINGS
            </span>

            <h2>Un momento delicioso</h2>
          </div>
        </div>

        <div className="rw-promotion-grid">
          {promotions
            .filter((promotion) => promotion.active)
            .map((promotion) => (
              <article
                className="rw-promotion-card"
                key={promotion.id}
              >
                <div className="rw-promotion-icon">
                  <Gift size={23} />
                </div>

                <span className="rw-promotion-label">
                  {promotion.label}
                </span>

                <h3>{promotion.title}</h3>

                <p>{promotion.description}</p>

                <button
                  className="rw-text-button"
                  onClick={goToMenu}
                >
                  Explorar menú
                  <ChevronRight size={16} />
                </button>
              </article>
            ))}
        </div>
      </section>

      {/* MENÚ */}
      <main id="rw-menu" className="rw-menu">
        <div className="rw-section-heading">
          <div>
            <span className="rw-eyebrow">
              DESCUBRE REDWINGS
            </span>

            <h2>Nuestro menú</h2>

            <p>
              Encuentra algo delicioso para tu próxima pausa.
            </p>
          </div>

          <span className="rw-product-count">
            {filteredProducts.length} productos
          </span>
        </div>

        {/* BUSCADOR */}
        <div className="rw-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Buscar tu favorito..."
            value={search}
            onChange={(value) =>
              setSearch(value.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Limpiar búsqueda"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* CATEGORÍAS */}
        <div className="rw-categories">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "rw-category active"
                  : "rw-category"
              }
              onClick={() =>
                setCategory(item as CategoryFilter)
              }
            >
              {item}
            </button>
          ))}
        </div>

        {/* PRODUCTOS */}
        <div className="rw-product-grid">
          {filteredProducts.map((product) => (
            <article
              className="rw-product-card"
              key={product.id}
            >
              <div className="rw-product-image">
                <button
                  className="rw-product-image-button"
                  onClick={() =>
                    openProductDetails(product)
                  }
                  aria-label={`Ver ${product.name}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                </button>

                {product.popular && (
                  <span className="rw-popular">
                    Popular
                  </span>
                )}

                <button
                  className={
                    favorites.includes(product.id)
                      ? "rw-favorite active"
                      : "rw-favorite"
                  }
                  onClick={() =>
                    toggleFavorite(product.id)
                  }
                  aria-label={
                    favorites.includes(product.id)
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"
                  }
                >
                  <Heart
                    size={18}
                    fill={
                      favorites.includes(product.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              <div className="rw-product-info">
                <span className="rw-product-category">
                  {product.category}
                </span>

                <button
                  className="rw-product-title"
                  onClick={() =>
                    openProductDetails(product)
                  }
                >
                  <h3>{product.name}</h3>
                </button>

                <p>{product.description}</p>

                <div className="rw-product-bottom">
                  <strong>{money(product.price)}</strong>

                  <button
                    className="rw-add-button"
                    onClick={() =>
                      addProduct(product)
                    }
                    aria-label={`Agregar ${product.name}`}
                  >
                    <Plus size={19} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SIN RESULTADOS */}
        {filteredProducts.length === 0 && (
          <div className="rw-empty">
            <Search size={30} />

            <h3>No encontramos productos</h3>

            <p>
              Prueba con otra búsqueda o categoría.
            </p>

            <button
              className="rw-primary-button"
              onClick={() => {
                setSearch("");
                setCategory("Todos");
              }}
            >
              Ver todo el menú
            </button>
          </div>
        )}
      </main>

      {/* FAVORITOS */}
      {favoritesOpen && (
        <div
          className="rw-overlay"
          onClick={() => setFavoritesOpen(false)}
        >
          <section
            className="rw-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="rw-drawer-header">
              <div>
                <span className="rw-eyebrow">
                  TUS FAVORITOS
                </span>

                <h2>Mis favoritos</h2>
              </div>

              <button
                className="rw-close"
                onClick={() =>
                  setFavoritesOpen(false)
                }
                aria-label="Cerrar favoritos"
              >
                <X size={22} />
              </button>
            </div>

            {favoriteProducts.length === 0 ? (
              <div className="rw-empty-cart">
                <Heart size={42} />

                <h3>Aún no tienes favoritos</h3>

                <p>
                  Guarda los productos que más te gustan
                  para encontrarlos fácilmente.
                </p>

                <button
                  className="rw-primary-button"
                  onClick={() =>
                    setFavoritesOpen(false)
                  }
                >
                  Explorar menú
                </button>
              </div>
            ) : (
              <div className="rw-cart-items">
                {favoriteProducts.map((product) => (
                  <div
                    className="rw-cart-item"
                    key={product.id}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div className="rw-cart-item-info">
                      <h3>{product.name}</h3>

                      <strong>
                        {money(product.price)}
                      </strong>

                      <button
                        className="rw-text-button"
                        onClick={() => {
                          addProduct(product);
                          setFavoritesOpen(false);
                        }}
                      >
                        Agregar al carrito
                        <Plus size={15} />
                      </button>
                    </div>

                    <button
                      className="rw-close"
                      onClick={() =>
                        toggleFavorite(product.id)
                      }
                      aria-label="Quitar favorito"
                    >
                      <Heart
                        size={19}
                        fill="currentColor"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* DETALLES DEL PRODUCTO */}
      {productDetailsOpen && selectedProduct && (
        <div
          className="rw-overlay"
          onClick={closeProductDetails}
        >
          <section
            className="rw-checkout rw-product-details"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="rw-drawer-header">
              <div>
                <span className="rw-eyebrow">
                  REDWINGS COFFEE
                </span>

                <h2>Producto</h2>
              </div>

              <button
                className="rw-close"
                onClick={closeProductDetails}
                aria-label="Cerrar detalles"
              >
                <X size={22} />
              </button>
            </div>

            <img
              className="rw-details-image"
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />

            <span className="rw-product-category">
              {selectedProduct.category}
            </span>

            <h2>{selectedProduct.name}</h2>

            <p>{selectedProduct.description}</p>

            <div className="rw-details-price">
              {money(selectedProduct.price)}
            </div>

            <div className="rw-details-tags">
              {selectedProduct.tags?.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <button
              className="rw-primary-button rw-full"
              onClick={() => {
                addProduct(selectedProduct);
                closeProductDetails();
              }}
            >
              Agregar al carrito
              <ShoppingBag size={18} />
            </button>
          </section>
        </div>
      )}

      {/* NAVEGACIÓN INFERIOR */}
      <nav className="rw-bottom-nav">
        <button
          className="active"
          onClick={goToHome}
        >
          <Home size={21} />
          <span>Inicio</span>
        </button>

        <button onClick={goToMenu}>
          <Coffee size={21} />
          <span>Menú</span>
        </button>

        <button
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag size={21} />

          {cartCount > 0 && (
            <span className="rw-nav-count">
              {cartCount}
            </span>
          )}

          <span>Carrito</span>
        </button>

        <button
          onClick={() => setProfileOpen(true)}
        >
          <UserRound size={21} />
          <span>Cuenta</span>
        </button>
      </nav>

      {/* FIN PARTE 3 */}
      {/* PARTE 4: CARRITO, CHECKOUT, PEDIDOS Y CIERRE */}
            {/* CARRITO */}
      {cartOpen && (
        <div className="rw-overlay" onClick={() => setCartOpen(false)}>
          <section
            className="rw-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rw-drawer-header">
              <div>
                <span className="rw-eyebrow">REDWINGS COFFEE</span>
                <h2>Tu carrito</h2>
              </div>

              <button
                className="rw-icon-button"
                onClick={() => setCartOpen(false)}
                aria-label="Cerrar carrito"
              >
                <X />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="rw-empty-state">
                <ShoppingBag size={42} />
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algo delicioso para continuar.</p>

                <button
                  className="rw-primary-button"
                  onClick={() => {
                    setCartOpen(false);
                    goToMenu();
                  }}
                >
                  Ver menú
                </button>
              </div>
            ) : (
              <>
                <div className="rw-cart-items">
                  {cart.map((item) => (
                    <article
                      className="rw-cart-item"
                      key={item.product.id}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="rw-cart-image"
                      />

                      <div className="rw-cart-item-info">
                        <h3>{item.product.name}</h3>

                        <p className="rw-cart-price">
                          {money(item.product.price)}
                        </p>

                        <div className="rw-quantity-control">
                          <button
                            onClick={() =>
                              changeQuantity(item.product.id, -1)
                            }
                            aria-label="Disminuir cantidad"
                          >
                            <Minus />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              changeQuantity(item.product.id, 1)
                            }
                            aria-label="Aumentar cantidad"
                          >
                            <Plus />
                          </button>
                        </div>
                      </div>

                      <button
                        className="rw-remove-button"
                        onClick={() => removeProduct(item.product.id)}
                        aria-label="Eliminar producto"
                      >
                        <X />
                      </button>
                    </article>
                  ))}
                </div>

                <div className="rw-cart-actions">
                  <button
                    className="rw-text-button"
                    onClick={clearCart}
                  >
                    Vaciar carrito
                  </button>

                  <button
                    className="rw-primary-button"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  >
                    Continuar
                    <ChevronRight />
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* FIN PARTE 4A */}
            {/* CHECKOUT */}
      {checkoutOpen && (
        <div
          className="rw-overlay"
          onClick={() => setCheckoutOpen(false)}
        >
          <section
            className="rw-drawer rw-checkout"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rw-drawer-header">
              <div>
                <span className="rw-eyebrow">REDWINGS COFFEE</span>
                <h2>Finalizar pedido</h2>
              </div>

              <button
                className="rw-icon-button"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Cerrar checkout"
              >
                <X />
              </button>
            </div>

            {/* DATOS DEL CLIENTE */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitOrder();
              }}
            >
              <div className="rw-form-section">
                <h3>Información del cliente</h3>

                <label className="rw-field">
                  <span>Nombre completo *</span>

                  <input
                    type="text"
                    value={customer.name}
                    onChange={(event) =>
                      updateCustomer("name", event.target.value)
                    }
                    placeholder="Tu nombre"
                    required
                  />
                </label>

                <label className="rw-field">
                  <span>Carrera *</span>

                  <input
                    type="text"
                    value={customer.career}
                    onChange={(event) =>
                      updateCustomer("career", event.target.value)
                    }
                    placeholder="Ej. Administración de Empresas"
                    required
                  />
                </label>

                <label className="rw-field">
                  <span>Sección *</span>

                  <input
                    type="text"
                    value={customer.section}
                    onChange={(event) =>
                      updateCustomer("section", event.target.value)
                    }
                    placeholder="Ej. 11-A"
                    required
                  />
                </label>

                <label className="rw-field">
                  <span>Teléfono</span>

                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(event) =>
                      updateCustomer("phone", event.target.value)
                    }
                    placeholder="Tu número de teléfono"
                  />
                </label>
              </div>

              {/* ENTREGA */}
              <div className="rw-form-section">
                <h3>Entrega</h3>

                <div className="rw-delivery-option">
                  <MapPin />

                  <div>
                    <strong>Recogida en el instituto</strong>
                    <p>Coordina la entrega con Redwings Coffee.</p>
                  </div>
                </div>
              </div>

              {/* MÉTODO DE PAGO */}
              <div className="rw-form-section">
                <h3>Forma de pago</h3>

                <div className="rw-payment-option">
                  <CheckCircle2 />

                  <div>
                    <strong>Efectivo</strong>
                    <p>Paga al recibir tu pedido.</p>
                  </div>
                </div>
              </div>

              {/* CUPÓN */}
              <div className="rw-form-section">
                <h3>¿Tienes un cupón?</h3>

                <div className="rw-coupon-input">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(event) =>
                      setCouponInput(event.target.value)
                    }
                    placeholder="Código de descuento"
                  />

                  <button
                    type="button"
                    onClick={applyCoupon}
                  >
                    Aplicar
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="rw-coupon-success">
                    <CheckCircle2 />

                    <span>
                      Cupón {appliedCoupon.code} aplicado
                    </span>

                    <button
                      type="button"
                      onClick={removeCoupon}
                      aria-label="Eliminar cupón"
                    >
                      <X />
                    </button>
                  </div>
                )}
              </div>

              {/* RESUMEN */}
              <div className="rw-order-summary">
                <h3>Resumen del pedido</h3>

                <div className="rw-summary-row">
                  <span>Productos</span>
                  <span>{money(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="rw-summary-row rw-discount">
                    <span>Descuento</span>
                    <span>-{money(discount)}</span>
                  </div>
                )}

                <div className="rw-summary-total">
                  <span>Total</span>
                  <strong>{money(total)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="rw-primary-button rw-submit-order"
                disabled={cart.length === 0}
              >
                Confirmar pedido
                <ChevronRight />
              </button>

              <p className="rw-checkout-note">
                Al confirmar, se preparará tu pedido y podrás
                enviarlo por WhatsApp.
              </p>
            </form>
          </section>
        </div>
      )}

      {/* CONFIRMACIÓN DEL PEDIDO */}
      {orderComplete && (
        <div className="rw-overlay">
          <section className="rw-success-modal">
            <div className="rw-success-icon">
              <CheckCircle2 />
            </div>

            <span className="rw-eyebrow">
              REDWINGS COFFEE
            </span>

            <h2>¡Pedido preparado!</h2>

            <p>
              Tu pedido fue registrado en este dispositivo.
              Envíalo por WhatsApp para coordinar la entrega.
            </p>

            {orders.length > 0 && (
              <div className="rw-order-code">
                <span>Código de pedido</span>

                <strong>
                  {orders[0].code}
                </strong>
              </div>
            )}

            <button
              className="rw-primary-button"
              onClick={() => {
                const latestOrder = orders[0];

                if (latestOrder) {
                  window.open(
                    createWhatsAppMessage(latestOrder),
                    "_blank"
                  );
                }
              }}
            >
               <CheckCircle2 />
              Enviar por WhatsApp
            </button>

            <button
              className="rw-secondary-button"
              onClick={() => {
                setOrderComplete(false);
                setCheckoutOpen(false);
                setCartOpen(false);
                goToMenu();
              }}
            >
              Volver al menú
            </button>
          </section>
        </div>
      )}

      {/* FIN PARTE 4B */}
            {/* HISTORIAL DE PEDIDOS */}
      {historyOpen && (
        <div
          className="rw-overlay"
          onClick={() => setHistoryOpen(false)}
        >
          <section
            className="rw-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rw-drawer-header">
              <div>
                <span className="rw-eyebrow">
                  REDWINGS COFFEE
                </span>

                <h2>Mis pedidos</h2>
              </div>

              <button
                className="rw-icon-button"
                onClick={() => setHistoryOpen(false)}
                aria-label="Cerrar historial"
              >
                <X />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="rw-empty-state">
                <ClipboardList size={42} />

                <h3>Aún no tienes pedidos</h3>

                <p>
                  Aquí aparecerán los pedidos registrados
                  en este dispositivo.
                </p>

                <button
                  className="rw-primary-button"
                  onClick={() => {
                    setHistoryOpen(false);
                    goToMenu();
                  }}
                >
                  Explorar menú
                </button>
              </div>
            ) : (
              <div className="rw-order-list">
                {orders.map((order) => (
                  <article
                    className="rw-order-card"
                    key={order.id}
                  >
                    <div className="rw-order-card-header">
                      <div>
                        <span className="rw-order-label">
                          Pedido
                        </span>

                        <strong>{order.code}</strong>
                      </div>

                      <span
                        className={`rw-order-status rw-status-${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="rw-order-date">
                      {formatDate(order.date)}
                    </p>

                    <div className="rw-order-products">
                      {order.items.map((item) => (
                        <div
                          className="rw-order-product"
                          key={item.product.id}
                        >
                          <span>
                            {item.quantity} × {item.product.name}
                          </span>

                          <span>
                            {money(
                              calculateItemTotal(item)
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="rw-order-card-total">
                      <span>Total</span>

                      <strong>{money(order.total)}</strong>
                    </div>

                    <div className="rw-order-card-actions">
                      <button
                        className="rw-secondary-button"
                        onClick={() =>
                          window.open(
                            createWhatsAppMessage(order),
                            "_blank"
                          )
                        }
                      >
                        <CheckCircle2 />
                        WhatsApp
                      </button>

                      {order.status === "Recibido" && (
                        <button
                          className="rw-text-button"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* PERFIL DEL CLIENTE */}
      {profileOpen && (
        <div
          className="rw-overlay"
          onClick={() => setProfileOpen(false)}
        >
          <section
            className="rw-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rw-drawer-header">
              <div>
                <span className="rw-eyebrow">
                  REDWINGS COFFEE
                </span>

                <h2>Mi perfil</h2>
              </div>

              <button
                className="rw-icon-button"
                onClick={() => setProfileOpen(false)}
                aria-label="Cerrar perfil"
              >
                <X />
              </button>
            </div>

            <div className="rw-profile-card">
              <div className="rw-profile-avatar">
                <UserRound />
              </div>

              <h3>
                {customer.name || "Cliente Redwings"}
              </h3>

              <p>
                {customer.career || "Tu carrera"}
                {customer.section
                  ? ` · ${customer.section}`
                  : ""}
              </p>
            </div>

            {/* PUNTOS */}
            <div className="rw-loyalty-card">
              <div className="rw-loyalty-icon">
                <Gift />
              </div>

              <div>
                <span>Programa de fidelidad</span>

                <strong>{points} puntos</strong>

                <p>
                  Acumula puntos con tus pedidos.
                </p>
              </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="rw-profile-details">
              <div className="rw-profile-detail">
                <span>Nombre</span>

                <strong>
                  {customer.name || "No registrado"}
                </strong>
              </div>

              <div className="rw-profile-detail">
                <span>Carrera</span>

                <strong>
                  {customer.career || "No registrada"}
                </strong>
              </div>

              <div className="rw-profile-detail">
                <span>Sección</span>

                <strong>
                  {customer.section || "No registrada"}
                </strong>
              </div>

              <div className="rw-profile-detail">
                <span>Teléfono</span>

                <strong>
                  {customer.phone || "No registrado"}
                </strong>
              </div>
            </div>

            <button
              className="rw-primary-button"
              onClick={() => {
                setProfileOpen(false);
                setHistoryOpen(true);
              }}
            >
              <ClipboardList />
              Ver mis pedidos
            </button>

            <button
              className="rw-secondary-button"
              onClick={() => {
                setProfileOpen(false);
                setCheckoutOpen(true);
              }}
            >
              Actualizar información
            </button>

            <button
              className="rw-text-button"
              onClick={openWhatsAppContact}
            >
              Contactar Redwings Coffee
            </button>
          </section>
        </div>
      )}

      {/* PIE DE PÁGINA */}
      <footer className="rw-footer">
        <div className="rw-footer-brand">
          <Coffee />

          <span>REDWINGS COFFEE</span>
        </div>

        <p>
          Sabores que convierten cualquier pausa
          en tu momento favorito.
        </p>

        <div className="rw-footer-links">
          <button onClick={goToHome}>
            Inicio
          </button>

          <button onClick={goToMenu}>
            Menú
          </button>

          <button onClick={() => setHistoryOpen(true)}>
            Mis pedidos
          </button>

          <button onClick={openWhatsAppContact}>
            Contacto
          </button>
        </div>

        <span className="rw-footer-copy">
          © {new Date().getFullYear()} Redwings Coffee
        </span>
      </footer>

      {/* CIERRE FINAL DE APP */}
    </div>
  );
}
