import { SiteFooter, SiteHeader } from "../components/Portal";

export const metadata = {
  title: "Términos y privacidad",
  description: "Condiciones de uso y política de privacidad del portal Pío Deportes.",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="page-hero legal-hero">
          <div className="shell">
            <span className="eyebrow">Información institucional</span>
            <h1>Términos y privacidad</h1>
            <p>Las reglas que protegen la experiencia editorial, los contenidos y los datos de quienes visitan Pío Deportes.</p>
            <time dateTime="2026-08-14">Vigente desde el 14 de agosto de 2026</time>
          </div>
        </header>

        <section className="shell legal-layout">
          <aside className="legal-index" aria-label="Contenido de esta política">
            <strong>En esta página</strong>
            <a href="#terminos">Condiciones de uso</a>
            <a href="#publicidad">Publicidad y terceros</a>
            <a href="#privacidad">Política de privacidad</a>
            <a href="#cookies">Cookies y medición</a>
            <a href="#derechos">Tus derechos</a>
            <a href="#contacto-legal">Contacto</a>
          </aside>

          <article className="legal-copy">
            <section id="terminos">
              <span className="legal-number">01</span>
              <h2>Condiciones de uso</h2>
              <h3>Alcance y aceptación</h3>
              <p>Estas condiciones regulan el acceso y uso de piodeportes.com, sus páginas, servicios, reproductores, formularios y futuras aplicaciones asociadas (el “Portal”). Al utilizar el Portal aceptas estas condiciones. Si no estás de acuerdo, debes abstenerte de usarlo.</p>

              <h3>Contenido editorial</h3>
              <p>Pío Deportes publica noticias, análisis, resultados, entrevistas, audio y video con fines informativos. Trabajamos para ofrecer información oportuna y precisa, pero resultados, horarios, estadísticas y transmisiones pueden cambiar por decisiones de ligas, organizadores o proveedores. Cuando corresponda, podremos corregir, actualizar, retirar o aclarar contenidos.</p>

              <h3>Propiedad intelectual</h3>
              <p>La marca Pío Deportes, su identidad visual, diseño, textos, producciones originales, audio, video y demás materiales propios están protegidos por la normativa aplicable. Las fotografías, logotipos, estadísticas o contenidos de terceros conservan la titularidad y licencias de sus respectivos propietarios. Se permite compartir enlaces y extractos breves con atribución; no se permite reproducir, republicar, vender, automatizar la extracción masiva ni crear productos derivados sin autorización escrita.</p>

              <h3>Uso permitido</h3>
              <p>No debes interferir con la seguridad o disponibilidad del Portal, introducir código malicioso, intentar acceder a áreas restringidas, suplantar identidades, vulnerar derechos de terceros ni utilizar sistemas automatizados de manera que afecten el servicio. Podemos limitar o suspender accesos que incumplan estas condiciones.</p>

              <h3>Enlaces, audio y contenido incrustado</h3>
              <p>El Portal puede integrar reproductores, publicaciones o enlaces de ligas, plataformas sociales, TuneIn, proveedores de resultados y otros servicios externos. Esos servicios se rigen por sus propias políticas y disponibilidad. Pío Deportes no controla sus cambios, interrupciones o prácticas independientes.</p>

              <h3>Responsabilidad</h3>
              <p>El Portal se ofrece según disponibilidad. En la medida permitida por la ley, Pío Deportes no responde por decisiones tomadas únicamente sobre la base de información deportiva, interrupciones de terceros o daños indirectos derivados del uso del Portal. Nada en estas condiciones limita derechos que legalmente no puedan excluirse.</p>
            </section>

            <section id="publicidad">
              <span className="legal-number">02</span>
              <h2>Publicidad y contenido comercial</h2>
              <p>El Portal puede mostrar publicidad programática, anuncios directos, patrocinios y contenido de marca. Las comunicaciones comerciales se identificarán de forma razonable y se mantendrán separadas de las decisiones editoriales. Pío Deportes puede rechazar materiales que resulten engañosos, ilegales, ofensivos, incompatibles con la audiencia o contrarios a sus estándares técnicos y editoriales.</p>
              <p>Las campañas pueden utilizar formatos responsivos de display, video, audio y contenido patrocinado. El rendimiento, disponibilidad e inventario se acuerdan en cada propuesta comercial; el envío del formulario de <a href="/anunciate">Anúnciate</a> no constituye por sí mismo una contratación.</p>
            </section>

            <section id="privacidad">
              <span className="legal-number">03</span>
              <h2>Política de privacidad</h2>
              <h3>Datos que podemos recibir</h3>
              <ul>
                <li><b>Suscripciones:</b> correo electrónico y fecha de consentimiento.</li>
                <li><b>Solicitudes comerciales:</b> nombre, empresa, correo, teléfono, ciudad, objetivos, presupuesto y detalles aportados voluntariamente.</li>
                <li><b>Datos técnicos:</b> dirección IP, tipo de navegador, sistema operativo, páginas visitadas, origen aproximado, interacciones y registros de seguridad.</li>
                <li><b>Preferencias:</b> permiso de notificaciones, elección de reproducción y controles similares almacenados en el dispositivo o por el proveedor correspondiente.</li>
              </ul>

              <h3>Cómo utilizamos los datos</h3>
              <p>Los usamos para operar y proteger el Portal, responder consultas comerciales, entregar suscripciones solicitadas, habilitar alertas deportivas, medir rendimiento, mejorar contenidos, limitar mensajes repetidos y cumplir obligaciones legales. No vendemos los datos personales aportados en formularios.</p>

              <h3>Base y consentimiento</h3>
              <p>Procesamos datos cuando son necesarios para atender una solicitud, prestar una función pedida por el usuario, mantener la seguridad e interés legítimo del Portal, o cuando existe consentimiento —por ejemplo, para correo promocional o notificaciones del sistema—. Puedes retirar ese consentimiento en cualquier momento, sin afectar el tratamiento anterior.</p>

              <h3>Proveedores y transferencias</h3>
              <p>Podemos utilizar proveedores de alojamiento, correo transaccional, analítica, publicidad, almacenamiento, video, radio y notificaciones. Solo reciben la información necesaria para su función y pueden procesarla fuera de República Dominicana, bajo sus medidas contractuales y de seguridad. Entre las categorías previstas se encuentran WordPress, Vercel o AWS, Google, Resend, Upstash, OneSignal, TuneIn y proveedores deportivos cuando estén activados.</p>

              <h3>Retención y seguridad</h3>
              <p>Conservamos la información durante el tiempo necesario para la finalidad indicada, obligaciones legales, defensa de derechos y prevención de abuso. Aplicamos controles razonables de acceso, cifrado en tránsito y minimización; ningún sistema conectado a Internet puede garantizar seguridad absoluta.</p>

              <h3>Ventana de suscripción por IP</h3>
              <p>Para no mostrar repetidamente la invitación al boletín, el servidor transforma la dirección IP mediante un identificador criptográfico y registra que la invitación ya fue presentada. No guardamos la IP legible para esta finalidad. También podemos usar una cookie técnica en el navegador como respaldo.</p>

              <h3>Menores de edad</h3>
              <p>El Portal está dirigido a una audiencia general y no solicita intencionalmente datos personales de menores. Si un padre, madre o tutor entiende que un menor proporcionó información sin autorización, puede escribirnos para solicitar su revisión o eliminación.</p>
            </section>

            <section id="cookies">
              <span className="legal-number">04</span>
              <h2>Cookies, medición y preferencias</h2>
              <p>Utilizamos cookies o tecnologías equivalentes estrictamente necesarias para seguridad, continuidad de funciones y preferencias. Cuando se activen analítica o publicidad personalizada, el Portal podrá usar tecnologías adicionales para medir audiencias, frecuencia y rendimiento, sujetas a la configuración de consentimiento aplicable y a las políticas de los proveedores.</p>
              <p>Puedes gestionar o borrar cookies desde el navegador. Bloquear algunas tecnologías puede impedir recordar preferencias, mantener una reproducción o limitar determinadas funciones.</p>
            </section>

            <section id="derechos">
              <span className="legal-number">05</span>
              <h2>Tus derechos y elecciones</h2>
              <p>Conforme a la Ley núm. 172-13 de República Dominicana y demás normas aplicables, puedes solicitar acceso, rectificación, actualización, oposición o eliminación de datos personales, sujeto a las excepciones legales. También puedes cancelar el boletín mediante el mecanismo incluido en cada envío y desactivar notificaciones desde el navegador o sistema operativo.</p>
              <p>Para proteger a los titulares, podremos pedir información razonable para verificar identidad antes de responder. Atenderemos las solicitudes dentro del plazo legal aplicable.</p>
            </section>

            <section id="contacto-legal">
              <span className="legal-number">06</span>
              <h2>Cambios, ley aplicable y contacto</h2>
              <p>Podemos actualizar estas condiciones para reflejar cambios legales, técnicos o de servicio. Publicaremos la fecha de vigencia y, si el cambio es material, procuraremos comunicarlo de forma destacada. Estas condiciones se interpretan conforme a las leyes de República Dominicana y las controversias se someterán a los tribunales competentes, salvo que una norma obligatoria disponga otra cosa.</p>
              <div className="legal-contact-card">
                <span>Consultas, privacidad y ejercicio de derechos</span>
                <a href="mailto:info@piodeportes.com">info@piodeportes.com</a>
                <small>Pío Deportes · Santo Domingo, República Dominicana</small>
              </div>
              <p className="legal-review-note">Este texto constituye la política operativa del Portal. Antes del lanzamiento comercial definitivo, se recomienda una revisión final por asesoría jurídica dominicana para incorporar la razón social, domicilio registral y cualquier requisito sectorial aplicable.</p>
            </section>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
