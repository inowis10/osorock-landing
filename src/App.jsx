import { useState } from 'react'
import './index.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    terms: false,
    newsletter: false
  })
  const [status, setStatus] = useState('idle') // idle, submitting, success, error

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    // ⚠️ REEMPLAZA ESTA URL CON TU WEBHOOK DE N8N
    const WEBHOOK_URL = 'https://nowis1010.app.n8n.cloud/webhook/4722ba07-f4a5-455e-8656-e3a5d8b949f8'

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', phone: '', email: '' })
        alert('¡Genial! Tus datos fueron enviados. Revisa tu WhatsApp en unos segundos. 🚀')
      } else {
        throw new Error('Error en el servidor')
      }
    } catch (error) {
      console.error('Error al enviar:', error)
      setStatus('error')
      alert('Hubo un error al enviar. Por favor, intenta nuevamente.')
    }
  }

  return (
    <div className="app-container">
      <div className="background-image"></div>

      <main className="content centered-layout">
        <div className="main-card glass-effect">
          <div className="form-section">
            <div className="form-header">
              <img src="/logos.png" alt="Contáctanos" className="form-header-image" />
              <p className="form-description">
                Te invitamos a vivir una experiencia exclusiva con sorpresas y contenido especial. <br /><br />
                <strong>Completa este formulario y recibe gratis un 🎁 <span className="highlight">pack de stickers de Dr. Simi</span> ✨</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  required
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                  required
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Correo</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    Acepto <a href="#" className="link">Políticas de Privacidad</a> y <a href="#" className="link">Términos y Condiciones</a>
                  </span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                  />
                  <span>Quiero recibir el newsletter con promociones.</span>
                </label>
              </div>

              <button
                type="submit"
                className={`submit-btn ${status === 'submitting' ? 'loading' : ''}`}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Enviando...' : 'Quiero mis stickers 🎸'}
              </button>

              <p className="privacy-text">
                Los datos están protegidos y serán utilizados de forma segura para los fines indicados.
              </p>
            </form>
          </div>

          <div className="image-section">
            <img src="/simirock.png" alt="Decorativa" className="decorative-image" />
          </div>

          <div className="social-section">
            <h3 className="social-title">Únete a la comunidad <span className="highlight-brand">Dr. Simi</span> 🤘</h3>
            <p className="social-subtitle">Contenido exclusivo y sorpresas 🎁</p>
            <div className="social-orbs">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="orb-link instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="orb-link tiktok" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="orb-link youtube" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="orb-link facebook" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="orb-link linkedin" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
