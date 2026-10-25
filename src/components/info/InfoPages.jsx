import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { 
  ShieldCheck, Plane, Clock, RefreshCw, FileText, 
  Send, MessageCircle, ArrowLeft 
} from 'lucide-react';

export const InfoPages = () => {
  const { infoPageId, setInfoPageId, navigateTo, showToast, whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  // TODO: confirmar con el dueño
  const whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde la sección informativa de Desde el Extranjero Hacia Ti para resolver unas dudas.')}`;

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Consulta sobre un producto importado',
    message: ''
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showToast('Por favor completa los campos requeridos', 'info');
      return;
    }
    // TODO: confirmar con el dueño
    const text = `Hola, mi nombre es ${contactForm.name} (${contactForm.email}, Tel: ${contactForm.phone || 'No especificado'}). Asunto: ${contactForm.subject}. Mensaje: ${contactForm.message}`;
    window.open(`https://wa.me/57${phone}?text=${encodeURIComponent(text)}`, '_blank');
    showToast('Redirigiendo a WhatsApp con tu consulta...', 'success');
    setContactForm({
      name: '',
      email: '',
      phone: '',
      subject: 'Consulta sobre un producto importado',
      message: ''
    });
  };

  const navItems = [
    { id: 'sobre-nosotros', label: 'Sobre Nosotros' },
    { id: 'como-funciona', label: 'Cómo Funciona el Catálogo' },
    { id: 'envios', label: 'Envíos y Tiempos de Entrega' },
    { id: 'devoluciones', label: 'Garantías y Cambios' },
    { id: 'terminos', label: 'Términos y Declaración Médica' },
    { id: 'contacto', label: 'Contacto y Pedidos Especiales' },
  ];

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8 bg-[#FAF7F2]">
      
      {/* Botón Volver */}
      <button
        onClick={() => navigateTo('home')}
        className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#0F1B2D] hover:text-[#B08D57] mb-10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la Portada</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* SIDEBAR DE PÁGINAS INFORMATIVAS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-[#E5DFD7] p-6 bg-[#FAF7F2] shadow-subtle">
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-4">
              Información Editorial
            </span>
            <div className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setInfoPageId(item.id)}
                  className={`w-full text-left px-4 py-3 text-xs font-sans tracking-[0.14em] uppercase transition-all border-l-2 ${
                    infoPageId === item.id
                      ? 'border-[#0F1B2D] bg-[#0F1B2D] text-[#FAF7F2] font-semibold'
                      : 'border-transparent text-[#161616]/70 hover:text-[#0F1B2D] hover:bg-[#F2EDE4]/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta de Asistencia WhatsApp */}
          <div className="border border-[#B08D57]/30 p-6 bg-[#0F1B2D] text-[#FAF7F2] space-y-3 shadow-subtle">
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block font-semibold">
              Atención Directa
            </span>
            <h4 className="font-serif text-lg text-[#FAF7F2] font-normal">
              ¿Prefieres hablar con un asesor?
            </h4>
            <p className="text-xs font-sans text-[#FAF7F2]/80 leading-relaxed">
              Te atendemos vía WhatsApp para verificar disponibilidad de piezas, tallas o cotizaciones a medida desde EE.UU.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#B08D57] hover:bg-[#8E6E38] text-[#0F1B2D] text-xs font-sans tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contactar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="lg:col-span-8">
          <div className="border border-[#E5DFD7] p-8 sm:p-12 bg-[#FAF7F2] text-[#161616] space-y-8 leading-relaxed shadow-subtle">
            
            {/* 1. SOBRE NOSOTROS */}
            {infoPageId === 'sobre-nosotros' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Nuestra Identidad
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1B2D] font-normal">
                    Productos Importados de Estados Unidos a Colombia
                  </h2>
                </div>
                
                {/* TODO: confirmar con el dueño */}
                <p className="text-sm font-sans text-[#161616]/80 leading-relaxed">
                  <strong>Desde el Extranjero Hacia Ti</strong> conecta a clientes en Colombia con productos auténticos de moda, tecnología, perfumería y bienestar importados desde Estados Unidos.
                </p>

                {/* TODO: confirmar con el dueño */}
                <p className="text-sm font-sans text-[#161616]/80 leading-relaxed">
                  Buscamos brindar una experiencia cercana, directa y transparente: seleccionas las referencias que te interesan en nuestro catálogo digital y coordinamos cada detalle de tu pedido a través de WhatsApp.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E5DFD7]">
                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/50 space-y-2">
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#B08D57] uppercase block font-semibold">
                      Procedencia
                    </span>
                    <h3 className="font-serif text-lg text-[#0F1B2D]">100% Original</h3>
                    {/* TODO: confirmar con el dueño */}
                    <p className="text-xs font-sans text-[#161616]/70 leading-relaxed">
                      Productos adquiridos en Estados Unidos. Cero copias o imitaciones.
                    </p>
                  </div>

                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/50 space-y-2">
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#B08D57] uppercase block font-semibold">
                      Atención
                    </span>
                    <h3 className="font-serif text-lg text-[#0F1B2D]">Acompañamiento Personal</h3>
                    {/* TODO: confirmar con el dueño */}
                    <p className="text-xs font-sans text-[#161616]/70 leading-relaxed">
                      Respuestas rápidas y cotizaciones claras en pesos colombianos vía WhatsApp.
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
                    Metodología
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1B2D] font-normal">
                    Catálogo Digital y Pedido Directo
                  </h2>
                </div>

                <p className="text-sm font-sans text-[#161616]/80 leading-relaxed">
                  Esta plataforma opera como un catálogo visual. No requiere pasarelas automáticas ni crear contraseñas para comprar:
                </p>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/50 space-y-1">
                    <div className="font-mono text-xs tracking-wider text-[#B08D57] font-semibold">01 · EXPLORA EL CATÁLOGO</div>
                    <h3 className="font-serif text-lg text-[#0F1B2D]">Eliges la pieza que te interesa</h3>
                    <p className="font-sans text-[#161616]/70">Revisas fotos, variantes y el precio en pesos colombianos (COP).</p>
                  </div>

                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/50 space-y-1">
                    <div className="font-mono text-xs tracking-wider text-[#B08D57] font-semibold">02 · CONTACTO WHATSAPP</div>
                    <h3 className="font-serif text-lg text-[#0F1B2D]">Pulsas "Pedir por WhatsApp"</h3>
                    <p className="font-sans text-[#161616]/70">Se abre el chat oficial con el nombre y enlace del producto prellenados automáticamente.</p>
                  </div>

                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/50 space-y-1">
                    <div className="font-mono text-xs tracking-wider text-[#B08D57] font-semibold">03 · COORDINACIÓN Y ENTREGA</div>
                    <h3 className="font-serif text-lg text-[#0F1B2D]">Acordamos el pago y el despacho</h3>
                    {/* TODO: confirmar con el dueño */}
                    <p className="font-sans text-[#161616]/70">Coordinamos el medio de pago preferido en Colombia y te enviamos la guía para recibir en tu puerta.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ENVÍOS Y TIEMPOS */}
            {infoPageId === 'envios' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Logística
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1B2D] font-normal">
                    Tiempos Estimados de Entrega en Colombia
                  </h2>
                </div>

                {/* TODO: confirmar con el dueño */}
                <p className="text-sm font-sans text-[#161616]/80 leading-relaxed">
                  Los productos son importados desde Estados Unidos y luego distribuidos a nivel nacional a través de transportadoras en Colombia:
                </p>

                <div className="border border-[#E5DFD7] p-6 bg-[#F2EDE4]/50 space-y-3">
                  <h3 className="font-serif text-lg text-[#0F1B2D]">Tiempos Estimados Habituales:</h3>
                  {/* TODO: confirmar con el dueño */}
                  <ul className="space-y-2 text-xs sm:text-sm font-sans text-[#161616]/75 list-disc pl-5">
                    <li><strong>Bogotá D.C. y alrededores:</strong> 4 a 7 días hábiles aprox.</li>
                    <li><strong>Ciudades principales (Medellín, Cali, Barranquilla, Bucaramanga):</strong> 5 a 8 días hábiles aprox.</li>
                    <li><strong>Otras ciudades y municipios:</strong> 6 a 10 días hábiles aprox.</li>
                  </ul>
                  <p className="text-[11px] text-[#161616]/60 pt-2 border-t border-[#E5DFD7]/60">
                    * Los tiempos exactos pueden variar según disponibilidad de stock o trayecto y se confirman por WhatsApp al momento del pedido.
                  </p>
                </div>
              </div>
            )}

            {/* 4. GARANTÍAS Y CAMBIOS */}
            {infoPageId === 'devoluciones' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Respaldo
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1B2D] font-normal">
                    Políticas de Garantía y Cambios
                  </h2>
                </div>

                {/* TODO: confirmar con el dueño */}
                <p className="text-sm font-sans text-[#161616]/80 leading-relaxed">
                  Queremos que recibas exactamente lo que esperas. Ante cualquier inconsistencia o novedad en el transporte:
                </p>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/50 space-y-1">
                    <strong className="font-serif text-base text-[#0F1B2D] block">Novedad de Transporte o Defecto</strong>
                    {/* TODO: confirmar con el dueño */}
                    <p className="font-sans text-[#161616]/70 leading-relaxed">
                      Si el producto llega con algún daño ocasionado durante el traslado, repórtalo en las primeras 48 horas con fotos vía WhatsApp para gestionar una solución inmediata.
                    </p>
                  </div>

                  <div className="p-6 border border-[#E5DFD7] bg-[#F2EDE4]/50 space-y-1">
                    <strong className="font-serif text-base text-[#0F1B2D] block">Perfumería y Suplementos</strong>
                    <p className="font-sans text-[#161616]/70 leading-relaxed">
                      Por normas de higiene y preservación, las fragancias y suplementos solo admiten cambio con sus precintos y empaques originales intactos.
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
                    Aspectos Legales
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1B2D] font-normal">
                    Términos Generales y Aviso Médico
                  </h2>
                </div>

                {/* AVISO MÉDICO DESTACADO */}
                <div className="p-6 border-l-4 border-[#B08D57] bg-[#F2EDE4] space-y-2">
                  <span className="text-[10px] font-sans tracking-[0.22em] text-[#8E6E38] uppercase font-bold block">
                    Aviso Importante: Categoría Salud y Bienestar
                  </span>
                  <p className="text-xs sm:text-sm font-sans text-[#161616] leading-relaxed">
                    Las vitaminas, suplementos nutricionales y productos de cuidado personal son importados desde Estados Unidos para consumo personal. <strong>Estos productos no son medicamentos y no sustituyen el diagnóstico, tratamiento o consulta de un profesional médico.</strong> Consulte a su médico antes de iniciar cualquier suplementación.
                  </p>
                </div>

                <div className="space-y-3 text-xs font-sans text-[#161616]/75 leading-relaxed pt-2">
                  <p>1. <strong>Precios en COP:</strong> Los valores indicados en el catálogo están expresados en pesos colombianos.</p>
                  <p>2. <strong>Confirmación de Pedidos:</strong> Todo pedido se formaliza y valida a través de nuestra línea de WhatsApp oficial.</p>
                  <p>3. <strong>Tratamiento de Datos:</strong> Tus datos de contacto y entrega se utilizan únicamente con fines logísticos para despachar tu encargo.</p>
                </div>
              </div>
            )}

            {/* 6. CONTACTO Y PEDIDOS ESPECIALES */}
            {infoPageId === 'contacto' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                    Atención
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1B2D] font-normal">
                    Contáctanos o Cotiza una Pieza Específica
                  </h2>
                  <p className="text-xs font-sans text-[#161616]/70 mt-2">
                    Si buscas una referencia que no está en el catálogo, escríbenos para verificar si podemos traértela bajo pedido.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Tu nombre..."
                        className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="tucorreo@ejemplo.com"
                        className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="310 000 0000"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                      Asunto o Referencia de Interés *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Indícanos qué pieza o marca deseas consultar..."
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#0F1B2D] text-[#FAF7F2] hover:bg-[#16263D] text-xs font-sans tracking-[0.18em] uppercase transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-[#B08D57]" />
                    <span>Enviar Consulta por WhatsApp</span>
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
