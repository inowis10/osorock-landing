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
        </div>
      </main>
    </div>
  )
}

export default App
