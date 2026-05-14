export default function PrivacidadPage() {
  return (
    <>
      <div className="relative overflow-hidden bg-[#161b27] rounded-b-[2.5rem] px-5 pt-12 pb-10">
        <div className="absolute -top-8 -right-8 w-44 h-44 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-[2.6rem] font-black text-white tracking-tight leading-[1.05]">
            Privacidad.
          </h1>
          <p className="mt-3 text-white/50 text-sm font-medium">
            Última actualización: mayo 2026
          </p>
        </div>
      </div>

      <div className="mx-3 mt-3 bg-white rounded-3xl overflow-hidden">
        <div className="px-5 py-6 space-y-6">
          {[
            {
              title: '1. Responsable del tratamiento',
              content: 'El responsable del tratamiento de los datos recogidos a través de esta aplicación es el administrador de Tortas Fritas de Yecla.',
            },
            {
              title: '2. Datos que recogemos',
              content: 'Recogemos los siguientes datos cuando envías una evaluación:',
              list: [
                'Dirección de correo electrónico',
                'Fecha de la visita al local',
                'Puntuaciones de evaluación (anónimas)',
                'Consentimiento para comunicaciones comerciales',
              ],
            },
            {
              title: '3. Finalidad del tratamiento',
              list: [
                'Gestionar y publicar las evaluaciones de forma anónima',
                'Si lo consientes, enviarte comunicaciones relacionadas con las tortas fritas de Yecla',
                'Prevenir evaluaciones fraudulentas',
              ],
            },
            {
              title: '4. Base legal',
              content: 'El tratamiento de tus datos se basa en tu consentimiento expreso, otorgado al aceptar esta política al enviar tu evaluación (art. 6.1.a RGPD).',
            },
            {
              title: '5. Conservación de datos',
              content: 'Conservamos tu dirección de correo el tiempo necesario para gestionar tu consentimiento y, en su caso, el envío de comunicaciones. Las evaluaciones son anónimas y se conservan indefinidamente.',
            },
            {
              title: '7. Cookies',
              content: 'Esta aplicación utiliza únicamente cookies técnicas necesarias para el funcionamiento del servicio. No se utilizan cookies de seguimiento ni publicidad.',
            },
          ].map((section) => (
            <div key={section.title} className="space-y-2">
              <h2 className="font-black text-stone-950 text-sm tracking-tight">{section.title}</h2>
              {section.content && <p className="text-sm text-stone-500 leading-relaxed">{section.content}</p>}
              {section.list && (
                <ul className="space-y-1.5 mt-2">
                  {section.list.map((item, i) => (
                    <li key={i} className="text-sm text-stone-500 flex gap-2 leading-relaxed">
                      <span className="text-amber-500 font-black shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="space-y-2">
            <h2 className="font-black text-stone-950 text-sm tracking-tight">6. Tus derechos</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Puedes ejercer tus derechos de acceso, rectificación, supresión, portabilidad y oposición contactando a través del correo indicado en el pie de página. También tienes derecho a reclamar ante la{' '}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-stone-950 underline font-semibold">
                Agencia Española de Protección de Datos
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
