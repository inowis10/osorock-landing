import { useState } from 'react'
import './index.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    terms: false,
    newsletter: false,
    website: '' // Honeypot field (must stay empty)
  })

  // Track which fields have been touched by the user
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false
  })
  const [status, setStatus] = useState('idle') // idle, submitting, success, error

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Mark field as touched when the user starts typing
    if (!touched[name] && type !== 'checkbox') {
      setTouched(prev => ({ ...prev, [name]: true }))
    }
  }

  // Simple validation logic
  const validateField = (name, value) => {
    if (!touched[name]) return null; // Don't show validation if not touched yet
    if (!value || value.trim() === '') return false;

    switch (name) {
      case 'name':
        return value.trim().length > 2;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^(\+56|0|)?\d{9}$/.test(value.replace(/\s/g, ''));
      default:
        return true;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    // Mark all fields as touched on submit
    setTouched({ name: true, phone: true, email: true })

    // Honeypot check
    if (formData.website !== '') {
      console.log('Bot detected')
      setStatus('success') // Fake success to trick the bot
      return
    }

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api/leads'

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          terms: formData.terms,
          newsletter: formData.newsletter,
          turnstileToken: 'manual-token-placeholder' // Placeholder for now
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', phone: '', email: '', terms: false, newsletter: false, website: '' })
        setTouched({ name: false, phone: false, email: false })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en el servidor')
      }
    } catch (error) {
      console.error('Error al enviar:', error)
      setStatus('error')
      // Solo dejamos esta alerta para errores críticos, pero lo ideal sería una UI de error también
      alert(`Hubo un error al enviar: ${error.message}`)
    }
  }

  return (
    <div className="app-container">
      <div className="background-image"></div>

      <main className="content centered-layout">
        <div className={`main-card glass-effect ${status === 'success' ? 'is-success' : ''}`}>
          <div className="form-section">
            {status === 'success' ? (
              <div className="success-container">
                <div className="success-icon-wrapper">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2 className="success-title">¡Enviado! 🚀</h2>
                <p className="success-message">
                  Tus datos están seguros. Revisa tu WhatsApp en unos segundos para recibir tu pack de stickers.
                </p>
                <button
                  className="continue-btn"
                  onClick={() => {
                    setStatus('idle')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Volver al formulario
                </button>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <img src="/logo zorro.webp" alt="Contáctanos" className="form-header-image" width="300" height="92" />
                  <p className="form-description">
                    Te invitamos a vivir una experiencia exclusiva con sorpresas y contenido especial. <br /><br />
                    <strong>Completa este formulario y recibe gratis un 🎁 <span className="highlight">pack de stickers de Zorro</span> ✨</strong>
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
                      className={validateField('name', formData.name) === true ? 'is-valid' : validateField('name', formData.name) === false ? 'is-invalid' : ''}
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
                      pattern="(\+56|0|)?\d{9}"
                      title="Ingresa un número válido de 9 dígitos (ej: 912345678 o +56912345678)"
                      disabled={status === 'submitting'}
                      className={validateField('phone', formData.phone) === true ? 'is-valid' : validateField('phone', formData.phone) === false ? 'is-invalid' : ''}
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
                      placeholder="ejemplo@correo.com"
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                      disabled={status === 'submitting'}
                      className={validateField('email', formData.email) === true ? 'is-valid' : validateField('email', formData.email) === false ? 'is-invalid' : ''}
                    />
                  </div>

                  {/* Honeypot field (invisible to humans) */}
                  <div className="hp-field" style={{ display: 'none' }}>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      tabIndex="-1"
                      autoComplete="off"
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
                    {status === 'submitting' ? (
                      <>
                        <div className="spinner"></div>
                        Enviando...
                      </>
                    ) : 'Quiero mis stickers 🎸'}
                  </button>

                  <p className="privacy-text">
                    Los datos están protegidos y serán utilizados de forma segura para los fines indicados.
                  </p>
                </form>
              </>
            )}
          </div>

          <div className="image-section">
            <div className="image-bg-effects">
              <div className="character-halo"></div>
            </div>
            <img src="/zorro rock.webp" alt="Decorativa" className="decorative-image" width="400" height="500" />
          </div>

          <div className="social-section">
            <h3 className="social-title">Únete a la comunidad <span className="highlight-brand">Zorro</span> 🤘</h3>
            <p className="social-subtitle">Contenido exclusivo y sorpresas 🎁</p>
            <div className="social-orbs">
              <a href="https://www.instagram.com/drsimichile/" target="_blank" rel="noopener noreferrer" className="orb-link instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.tiktok.com/@drsimichile_oficial" target="_blank" rel="noopener noreferrer" className="orb-link tiktok" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
              <a href="https://www.youtube.com/c/FarmaciasDelDrSimiChile" target="_blank" rel="noopener noreferrer" className="orb-link youtube" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://www.facebook.com/DrSimiChile/" target="_blank" rel="noopener noreferrer" className="orb-link facebook" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.linkedin.com/company/farmacias-de-similares-chile-s.a/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="orb-link linkedin" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </main >
    </div >
  )
}

export default App
