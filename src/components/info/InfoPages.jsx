import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { 
  ShieldCheck, Plane, Clock, RefreshCw, FileText, 
  Lock, Phone, Mail, MapPin, Send, MessageCircle, ArrowLeft 
} from 'lucide-react';

export const InfoPages = () => {
  const { infoPageId, setInfoPageId, navigateTo, showToast, whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  const whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde la sección informativa de Desde el Extranjero Hacia Ti para resolver unas dudas.')}`;

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Consulta sobre un producto de importación',
    message: ''
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showToast('Por favor completa los campos requeridos', 'info');
      return;
    }
    // Abrir WhatsApp con el mensaje prellenado del formulario
    const text = `Hola, mi nombre es ${contactForm.name} (${contactForm.email}, Tel: ${contactForm.phone || 'No especificado'}). Asunto: ${contactForm.subject}. Mensaje: ${contactForm.message}`;
    window.open(`https://wa.me/57${phone}?text=${encodeURIComponent(text)}`, '_blank');
    showToast('Redirigiendo a WhatsApp con tu consulta...', 'success');
    setContactForm({
      name: '',
      email: '',
      phone: '',
      subject: 'Consulta sobre un producto de importación',
      message: ''
    });
  };

  const navItems = [
    { id: 'sobre-nosotros', label: 'Sobre Nosotros' },
    { id: 'como-funciona', label: 'Cómo Funciona el Catálogo' },
    { id: 'envios', label: 'Envíos y Tiempos a Colombia' },
    { id: 'devoluciones', label: 'Garantías y Autenticidad' },
    { id: 'terminos', label: 'Términos y Declaración Médica' },
    { id: 'contacto', label: 'Contacto y Pedidos Especiales' },
  ];

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
      
      {/* Botón Volver */}
      <button
        onClick={() => navigateTo('home')}
        className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#161616]/60 hover:text-[#161616] mb-10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la Portada</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* SIDEBAR DE PÁGINAS INFORMATIVAS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-[#E5DFD7] p-6 bg-[#FAF7F2]">
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-4">
              Información Editorial
            </span>
            <div className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setInfoPageId(item.id)}
                  className={`w-full text-left px-4 py-3 text-xs font-sans tracking-[0.14em] uppercase transition-luxury border-l-2 ${
                    infoPageId === item.id
                      ? 'border-[#161616] bg-[#F2EDE4] text-[#161616] font-semibold'
                      : 'border-transparent text-[#161616]/60 hover:text-[#161616] hover:bg-[#F2EDE4]/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta de Asistencia WhatsApp */}
          <div className="border border-[#E5DFD7] p-6 bg-[#FAF7F2] space-y-3">
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block">
              Atención Directa
            </span>
            <h4 className="font-serif text-lg text-[#161616] font-normal">
              ¿Prefieres hablar directamente con un asesor?
            </h4>
            <p className="text-xs font-serif text-[#161616]/70 leading-relaxed">
              Te atendemos en Colombia vía WhatsApp para verificar disponibilidad de piezas, tallas o cotizaciones a medida desde EE.UU.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.2em] uppercase hover:bg-[#282828] transition-luxury flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#B08D57]" />
                <span>Contactar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="lg:col-span-8">
          <div className="border border-[#E5DFD7] p-8 sm:p-12 bg-[#FAF7F2] text-[#161616] space-y-8 leading-relaxed">
            
            {/* 1. SOBRE NOSOTROS */}
            {infoPageId === 'sobre-nosotros' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Nuestra Identidad
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
                    La Conexión Directa entre Estados Unidos y Colombia
                  </h2>
                </div>
                
                <p className="text-sm font-serif text-[#161616]/75 leading-relaxed">
                  <strong>Desde el Extranjero Hacia Ti</strong> nace con la convicción de que adquirir piezas originales de Estados Unidos no debe ser una experiencia compleja, riesgosa o impersonal. Seleccionamos cuidadosamente referencias auténticas de moda, fragancias exclusivas, tecnología de vanguardia y bienestar.
                </p>

                <p className="text-sm font-serif text-[#161616]/75 leading-relaxed">
                  Operamos con un centro logístico en <strong>Miami, Florida</strong> y atención directa a nuestros clientes en Colombia. Cada artículo es comprado personalmente en distribuidores oficiales y tiendas insignia norteamericanas (Apple Store, Sephora, Nordstrom, Macy's, Nike), garantizando procedencia legítima con factura.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E5DFD7]">
                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/40 space-y-2">
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#B08D57] uppercase block">
                      Autenticidad
                    </span>
                    <h3 className="font-serif text-xl text-[#161616] font-normal">100% Original con Factura</h3>
                    <p className="text-xs font-serif text-[#161616]/70 leading-relaxed">
                      Rechazamos cualquier imitación o saldo dudoso. Toda pieza incluye su comprobante fiscal de compra en EE.UU.
                    </p>
                  </div>

                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/40 space-y-2">
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#B08D57] uppercase block">
                      Legalidad
                    </span>
                    <h3 className="font-serif text-xl text-[#161616] font-normal">Aduanas DIAN Gestionadas</h3>
                    <p className="text-xs font-serif text-[#161616]/70 leading-relaxed">
                      El valor cotizado en pesos colombianos (COP) es el precio definitivo. Cero cobros sorpresa de aranceles al llegar.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CÓMO FUNCIONA */}
            {infoPageId === 'como-funciona' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Modelo del Negocio
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
                    Catálogo Editorial y Pedido Directo
                  </h2>
                </div>

                <p className="text-sm font-serif text-[#161616]/75 leading-relaxed">
                  Nuestra plataforma está pensada como una revista de moda y estilo de vida donde exploras colecciones disponibles. <strong>No usamos carritos de compra automáticos ni pasarelas impersonales:</strong>
                </p>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/40 space-y-1">
                    <div className="font-mono text-xs tracking-wider text-[#B08D57] font-semibold">01 · SELECCIÓN EN CATÁLOGO</div>
                    <h3 className="font-serif text-lg text-[#161616]">Eliges la pieza que deseas</h3>
                    <p className="font-serif text-[#161616]/70">Exploras fotos de alta resolución, descripción, variantes de talla o color y precio en pesos colombianos.</p>
                  </div>

                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/40 space-y-1">
                    <div className="font-mono text-xs tracking-wider text-[#B08D57] font-semibold">02 · CONTACTO POR WHATSAPP</div>
                    <h3 className="font-serif text-lg text-[#161616]">Pulsas "Pedir por WhatsApp"</h3>
                    <p className="font-serif text-[#161616]/70">El sistema abre WhatsApp con el nombre del producto, la talla elegida y el enlace exacto prellenado.</p>
                  </div>

                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/40 space-y-1">
                    <div className="font-mono text-xs tracking-wider text-[#B08D57] font-semibold">03 · CONFIRMACIÓN Y DESPACHO</div>
                    <h3 className="font-serif text-lg text-[#161616]">Coordinamos el pago y el envío</h3>
                    <p className="font-serif text-[#161616]/70">Acordamos tu medio de pago colombiano preferido (transferencia Bancolombia, Nequi o Daviplata), embarcamos tu paquete desde Miami y te entregamos la guía de rastreo aéreo.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ENVÍOS Y TIEMPOS */}
            {infoPageId === 'envios' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Logística Internacional
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
                    Envíos a Toda Colombia en 5 a 8 Días Hábiles
                  </h2>
                </div>

                <p className="text-sm font-serif text-[#161616]/75 leading-relaxed">
                  Realizamos despachos semanales en vuelos de carga internacional directos Miami (MIA) ➔ Bogotá (BOG). Al llegar a Colombia y superar la inspección aduanera, se transfieren a transportadoras nacionales de confianza (Coordinadora, Servientrega o Interrapidísimo) hasta la puerta de tu domicilio.
                </p>

                <div className="border border-[#E5DFD7] p-6 bg-[#F2EDE4]/40 space-y-3">
                  <h3 className="font-serif text-lg text-[#161616]">Tiempos Promedio de Entrega:</h3>
                  <ul className="space-y-2 text-xs sm:text-sm font-serif text-[#161616]/75 list-disc pl-5">
                    <li><strong>Bogotá D.C. y Sabana:</strong> 4 a 6 días hábiles.</li>
                    <li><strong>Medellín, Cali, Barranquilla, Bucaramanga y Eje Cafetero:</strong> 5 a 8 días hábiles.</li>
                    <li><strong>Resto de ciudades y cabeceras municipales:</strong> 6 a 9 días hábiles.</li>
                    <li><strong>San Andrés Isla y trayectos especiales:</strong> 8 a 12 días hábiles.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 4. GARANTÍAS Y DEVOLUCIONES */}
            {infoPageId === 'devoluciones' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Tranquilidad y Respaldo
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
                    Garantía Directa de 30 Días
                  </h2>
                </div>

                <p className="text-sm font-serif text-[#161616]/75 leading-relaxed">
                  Tu satisfacción y la certeza de autenticidad son nuestra mayor prioridad. Cada compra cuenta con políticas claras:
                </p>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/40 space-y-1">
                    <strong className="font-serif text-base text-[#161616] block">Garantía por Transporte o Defecto de Fábrica</strong>
                    <p className="font-serif text-[#161616]/70 leading-relaxed">
                      Si el producto llega con algún daño estético ocurrido en el vuelo o defecto técnico de fábrica, gestionamos el cambio inmediato o el reembolso íntegro de tu dinero.
                    </p>
                  </div>

                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/40 space-y-1">
                    <strong className="font-serif text-base text-[#161616] block">Perfumería y Cosmética</strong>
                    <p className="font-serif text-[#161616]/70 leading-relaxed">
                      Por motivos de higiene y conservación aromática, las fragancias y cosméticos solo admiten devolución con su celofán y sellos de seguridad originales intactos.
                    </p>
                  </div>

                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/40 space-y-1">
                    <strong className="font-serif text-base text-[#161616] block">Tecnología con Garantía Global</strong>
                    <p className="font-serif text-[#161616]/70 leading-relaxed">
                      Dispositivos Apple, consolas y auriculares cuentan con su año de garantía global oficial del fabricante, verificable en sus plataformas con número de serie.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. TÉRMINOS Y DECLARACIÓN MÉDICA */}
            {infoPageId === 'terminos' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Marco Legal y Salud
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
                    Términos y Aviso Médico Obligatorio
                  </h2>
                </div>

                {/* AVISO MÉDICO DESTACADO */}
                <div className="p-6 border-l-2 border-[#B08D57] bg-[#F2EDE4] space-y-2">
                  <span className="text-[10px] font-sans tracking-[0.22em] text-[#8F6E38] uppercase font-bold block">
                    Aviso Importante: Categoría Salud y Bienestar
                  </span>
                  <p className="text-xs sm:text-sm font-serif text-[#161616] leading-relaxed">
                    Las vitaminas, suplementos nutricionales y productos de cuidado personal ofrecidos en este catálogo son importados legalmente desde Estados Unidos para consumo personal. <strong>Estos productos no son medicamentos y no sustituyen el diagnóstico, tratamiento o consulta médica profesional.</strong> Recomendamos siempre consultar con su médico antes de incorporar cualquier suplementación.
                  </p>
                </div>

                <div className="space-y-3 text-xs font-serif text-[#161616]/75 leading-relaxed pt-2">
                  <p>1. <strong>Valores en Pesos Colombianos (COP):</strong> Todos los precios indicados son en moneda legal colombiana y contemplan el producto, flete aéreo internacional y trámites de aduana.</p>
                  <p>2. <strong>Trámites DIAN:</strong> Al confirmar un pedido por WhatsApp, el comprador faculta la gestión del trámite de importación para consumo propio con la información facilitada.</p>
                  <p>3. <strong>Protección de Datos (Ley 1581 de 2012):</strong> Tu número de teléfono, dirección y datos personales solo se usan con fines logísticos para coordinar la entrega de tu encargo.</p>
                </div>
              </div>
            )}

            {/* 6. CONTACTO Y PEDIDOS ESPECIALES */}
            {infoPageId === 'contacto' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Atención Personalizada
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
                    Contáctanos o Solicita una Importación a Medida
                  </h2>
                  <p className="text-xs font-serif text-[#161616]/70 mt-2">
                    Si buscas una referencia que no está en el catálogo, podemos cotizártela y traerla en el próximo vuelo.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-sans tracking-[0.16em] uppercase text-[#161616]/70 block mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Ej. Carolina Gómez"
                        className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-sans tracking-[0.16em] uppercase text-[#161616]/70 block mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="carolina@ejemplo.com"
                        className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-sans tracking-[0.16em] uppercase text-[#161616]/70 block mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="310 000 0000"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans tracking-[0.16em] uppercase text-[#161616]/70 block mb-1">
                      Asunto o Producto que Buscas en EE.UU. *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans tracking-[0.16em] uppercase text-[#161616]/70 block mb-1">
                      Detalles de tu Solicitud *
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Indícanos marca, referencia, talla, color o el enlace de la tienda norteamericana que deseas cotizar..."
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.2em] uppercase hover:bg-[#282828] transition-luxury flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-[#B08D57]" />
                    <span>Enviar Consulta a un Asesor</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
