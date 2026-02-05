import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// SafeIcon Component - converts kebab-case to PascalCase
const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const iconMap = {
    scissors: 'Scissors',
    clock: 'Clock',
    'map-pin': 'MapPin',
    phone: 'Phone',
    instagram: 'Instagram',
    facebook: 'Facebook',
    send: 'Send',
    'check-circle': 'CheckCircle',
    'chevron-right': 'ChevronRight',
    star: 'Star',
    calendar: 'Calendar',
    user: 'User',
    mail: 'Mail',
    'message-square': 'MessageSquare',
    menu: 'Menu',
    x: 'X',
    sparkles: 'Sparkles',
    flame: 'Flame',
    percent: 'Percent',
    gift: 'Gift',
    camera: 'Camera',
    image: 'Image'
  }

  const pascalName = iconMap[name] || name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase())

  import * as icons from 'lucide-react'
  const IconComponent = icons[pascalName] || icons['HelpCircle']

  return <IconComponent size={size} className={className} color={color} />
}

// Web3Forms Handler Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Что-то пошло не так')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Ошибка сети. Пожалуйста, попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }

  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

// CleanMap Component
const CleanMap = ({ coordinates = [14.4378, 50.0755], zoom = 14 }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return

    const styleUrl = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: coordinates,
      zoom: zoom,
      attributionControl: false,
      interactive: true,
      dragPan: true,
      dragRotate: false,
      touchZoomRotate: false,
      doubleClickZoom: true,
      keyboard: false
    })

    map.current.scrollZoom.disable()

    const el = document.createElement('div')
    el.style.cssText = `
      width: 24px;
      height: 24px;
      background: #d97706;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `

    new maplibregl.Marker({ element: el })
      .setLngLat(coordinates)
      .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML('<strong style="color: #1a0505;">BAZA Barbershop</strong><br><span style="color: #666;">Praha, Vinohrady</span>'))
      .addTo(map.current)

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [coordinates, zoom])

  return (
    <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-2xl border border-amber-600/20 relative">
      <style>{`
        .maplibregl-ctrl-attrib { display: none !important; }
        .maplibregl-ctrl-logo { display: none !important; }
        .maplibregl-compact { display: none !important; }
      `}</style>
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  )
}

// Countdown Timer Component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        clearInterval(interval)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-b from-amber-600 to-amber-800 w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center shadow-lg border border-amber-500/50">
        <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-xs sm:text-sm text-amber-500/70 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  )

  return (
    <div className="flex gap-3 sm:gap-4 justify-center">
      <TimeUnit value={timeLeft.days} label="Дней" />
      <TimeUnit value={timeLeft.hours} label="Часов" />
      <TimeUnit value={timeLeft.minutes} label="Минут" />
      <TimeUnit value={timeLeft.seconds} label="Секунд" />
    </div>
  )
}

// Promo Slider Component
const PromoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const promos = [
    {
      id: 1,
      title: "Скидка 20% на первый визит",
      description: "Добро пожаловать в BAZA! Получите скидку 20% на любую услугу при первом посещении",
      icon: "percent",
      color: "from-amber-600 to-amber-800"
    },
    {
      id: 2,
      title: "Комбо: Стрижка + Бритьё",
      description: "Классическое комбо со скидкой 15%. Идеальный подарок для себя или друга",
      icon: "gift",
      color: "from-red-800 to-red-950"
    },
    {
      id: 3,
      title: "VIP Уход за бородой",
      description: "Премиальный уход с горячими полотенцами и массажем лица",
      icon: "sparkles",
      color: "from-amber-700 to-amber-900"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promos.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [promos.length])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-600/30 bg-gradient-to-br from-neutral-900 to-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${promos[currentSlide].color} mb-4`}>
            <SafeIcon name={promos[currentSlide].icon} size={16} className="text-white" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Акция</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-3">
            {promos[currentSlide].title}
          </h3>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {promos[currentSlide].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 justify-center pb-4">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-amber-600' : 'bg-amber-600/30'}`}
          />
        ))}
      </div>
    </div>
  )
}

// UPDATED Gallery Component with ONLY the 3 user provided photos
const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null)

  const galleryImages = [
    {
      id: 1,
      src: "https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770327376-7708.jpg?",
      alt: "BAZA Barbershop - работа мастера",
      span: "col-span-2 row-span-2"
    },
    {
      id: 2,
      src: "https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770327377-6711.jpg?",
      alt: "BAZA Barbershop - стиль и атмосфера"
    },
    {
      id: 3,
      src: "https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770327378-2135.jpg?",
      alt: "BAZA Barbershop - детали работы"
    }
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-transparent via-neutral-900/30 to-transparent">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-amber-500 text-sm font-mono uppercase tracking-[0.3em]">Наши работы</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white font-serif mt-3 mb-4">
            <span className="text-amber-500">Галерея</span> BAZA
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Атмосфера винтажного барбершопа. Каждая фотография рассказывает историю стиля и мастерства.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`relative group overflow-hidden rounded-xl cursor-pointer ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <SafeIcon name="camera" size={16} className="text-amber-500" />
                  <span className="text-white text-sm font-mono">{image.alt}</span>
                </div>
              </div>
              {index === 0 && (
                <div className="absolute top-4 left-4 bg-amber-600 px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">Featured</span>
                </div>
              )}
              {index > 0 && (
                <div className="absolute top-4 right-4 bg-green-600 px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">New</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-white hover:text-amber-500 transition-colors"
                >
                  <SafeIcon name="x" size={32} />
                </button>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                <p className="text-white text-center mt-4 font-mono text-lg">{selectedImage.alt}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// Service Card Component
const ServiceCard = ({ title, price, description, duration, icon, delay }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: delay }}
      className="group bg-gradient-to-br from-neutral-900 to-black p-6 rounded-2xl border border-amber-600/20 hover:border-amber-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-600/10 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-600/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-4">
        <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 w-14 h-14 rounded-xl flex items-center justify-center border border-amber-600/30">
          <SafeIcon name={icon} size={28} className="text-amber-500" />
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-bold text-amber-500 font-mono">{price}</span>
          <span className="text-amber-500/60 text-sm"> Kč</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white font-serif mb-2 group-hover:text-amber-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        {description}
      </p>

      <div className="flex items-center gap-2 text-amber-500/60 text-sm">
        <SafeIcon name="clock" size={14} />
        <span>{duration}</span>
      </div>
    </motion.div>
  )
}

// Booking Form Component
const BookingForm = () => {
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

  const services = [
    { value: 'haircut', label: 'Мужская стрижка' },
    { value: 'beard', label: 'Уход за бородой' },
    { value: 'combo', label: 'Комбо: Стрижка + Бритьё' },
    { value: 'shave', label: 'Классическое бритьё' },
    { value: 'child', label: 'Детская стрижка' },
  ]

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
            className="space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <SafeIcon name="user" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
                <input
                  type="text"
                  name="name"
                  placeholder="Ваше имя"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-amber-600/20 rounded-xl text-white placeholder-amber-500/30 focus:outline-none focus:border-amber-600/50 transition-colors font-mono"
                />
              </div>
              <div className="relative">
                <SafeIcon name="phone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Телефон"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-amber-600/20 rounded-xl text-white placeholder-amber-500/30 focus:outline-none focus:border-amber-600/50 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="relative">
              <SafeIcon name="mail" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
              <input
                type="email"
                name="email"
                placeholder="Email (необязательно)"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-amber-600/20 rounded-xl text-white placeholder-amber-500/30 focus:outline-none focus:border-amber-600/50 transition-colors font-mono"
              />
            </div>

            <div className="relative">
              <SafeIcon name="calendar" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
              <select
                name="service"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-amber-600/20 rounded-xl text-white focus:outline-none focus:border-amber-600/50 transition-colors font-mono appearance-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900">Выберите услугу</option>
                {services.map(s => (
                  <option key={s.value} value={s.value} className="bg-neutral-900">{s.label}</option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <SafeIcon name="calendar" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-amber-600/20 rounded-xl text-white placeholder-amber-500/30 focus:outline-none focus:border-amber-600/50 transition-colors font-mono"
                />
              </div>
              <div className="relative">
                <SafeIcon name="clock" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
                <select
                  name="time"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-amber-600/20 rounded-xl text-white focus:outline-none focus:border-amber-600/50 transition-colors font-mono appearance-none cursor-pointer"
                >
                  <option value="" className="bg-neutral-900">Время</option>
                  <option value="10:00" className="bg-neutral-900">10:00</option>
                  <option value="11:00" className="bg-neutral-900">11:00</option>
                  <option value="12:00" className="bg-neutral-900">12:00</option>
                  <option value="13:00" className="bg-neutral-900">13:00</option>
                  <option value="14:00" className="bg-neutral-900">14:00</option>
                  <option value="15:00" className="bg-neutral-900">15:00</option>
                  <option value="16:00" className="bg-neutral-900">16:00</option>
                  <option value="17:00" className="bg-neutral-900">17:00</option>
                  <option value="18:00" className="bg-neutral-900">18:00</option>
                  <option value="19:00" className="bg-neutral-900">19:00</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <textarea
                name="message"
                placeholder="Дополнительные пожелания..."
                rows="3"
                className="w-full px-4 py-4 bg-white/5 border border-amber-600/20 rounded-xl text-white placeholder-amber-500/30 focus:outline-none focus:border-amber-600/50 transition-colors font-mono resize-none"
              ></textarea>
            </div>

            {isError && (
              <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-neutral-700 disabled:to-neutral-800 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3 shadow-lg shadow-amber-600/20 font-mono uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Отправка...
                </>
              ) : (
                <>
                  <SafeIcon name="send" size={20} />
                  Забронировать
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="text-center py-12"
          >
            <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-600/30">
              <SafeIcon name="check-circle" size={48} className="text-amber-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 font-serif">
              Заявка отправлена!
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Мы свяжемся с вами в ближайшее время для подтверждения записи. Добро пожаловать в BAZA!
            </p>
            <button
              onClick={resetForm}
              className="text-amber-500 hover:text-amber-400 font-semibold transition-colors font-mono uppercase tracking-wider"
            >
              Отправить ещё заявку
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main App Component
function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  const featuresRef = useRef(null)
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" })

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 overflow-x-hidden">
      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/50'
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto max-w-6xl px-4 md:px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg shadow-amber-600/20 group-hover:shadow-amber-600/40 transition-shadow">
              <SafeIcon name="scissors" size={24} className="text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-white font-serif tracking-tight">BAZA</span>
              <span className="block text-[10px] text-amber-500 uppercase tracking-[0.3em] font-mono">Barbershop</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {['Акции', 'Услуги', 'Галерея', 'Бронирование', 'Контакты'].map((item, i) => {
              const ids = ['promo', 'services', 'gallery', 'booking', 'contacts']
              return (
                <button
                  key={item}
                  onClick={() => scrollToSection(ids[i])}
                  className="text-gray-300 hover:text-amber-500 transition-colors font-mono uppercase tracking-wider text-sm"
                >
                  {item}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center text-white"
          >
            <SafeIcon name={mobileMenuOpen ? 'x' : 'menu'} size={28} />
          </button>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/98 border-t border-amber-600/20 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {['Акции', 'Услуги', 'Галерея', 'Бронирование', 'Контакты'].map((item, i) => {
                  const ids = ['promo', 'services', 'gallery', 'booking', 'contacts']
                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection(ids[i])}
                      className="block w-full text-left text-lg text-gray-300 hover:text-amber-500 transition-colors font-mono uppercase tracking-wider py-2"
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(180,83,9,0.15)_0%,_transparent_70%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
        </div>

        <div ref={heroRef} className="relative z-10 container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/10 border border-amber-600/30 mb-6">
              <SafeIcon name="flame" size={16} className="text-amber-500" />
              <span className="text-amber-500 text-sm font-mono uppercase tracking-wider">Основан в 2019</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white font-serif mb-6 tracking-tight">
              BAZA <span className="text-amber-500">Barbershop</span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-amber-500/80 mb-4 font-mono uppercase tracking-wider">
              Винтажная классика в сердце Праги
            </p>

            <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Традиции мужского груминга, переданные через поколения.
              Аутентичная атмосфера, мастера с опытом и неповторимый стиль.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('booking')}
                className="group bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg shadow-amber-600/25 font-mono uppercase tracking-wider"
              >
                Записаться
                <SafeIcon name="chevron-right" size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all backdrop-blur-sm border border-white/10 hover:border-amber-600/30 font-mono uppercase tracking-wider"
              >
                Наши услуги
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: '5+', label: 'Лет опыта' },
              { value: '15K+', label: 'Стрижек' },
              { value: '12', label: 'Мастеров' },
              { value: '4.9', label: 'Рейтинг' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-amber-500 font-mono">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROMO SECTION */}
      <section id="promo" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-amber-500 text-sm font-mono uppercase tracking-[0.3em]">Специальные предложения</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white font-serif mt-3 mb-4">
              Акции недели
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <PromoSlider />

            <div className="bg-gradient-to-br from-neutral-900 to-black p-6 sm:p-8 rounded-2xl border border-amber-600/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-600/20 w-12 h-12 rounded-xl flex items-center justify-center">
                  <SafeIcon name="percent" size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-serif">Скидка 20%</h3>
                  <p className="text-gray-400 text-sm">До конца недели</p>
                </div>
              </div>

              <p className="text-gray-400 mb-6 leading-relaxed">
                Успейте записаться до воскресенья и получите скидку 20% на любую услугу.
                Идеальная возможность познакомиться с BAZA или порадовать себя премиальным уходом.
              </p>

              <CountdownTimer targetDate={new Date().getTime() + 5 * 24 * 60 * 60 * 1000} />

              <button
                onClick={() => scrollToSection('booking')}
                className="w-full mt-6 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white py-4 rounded-xl font-bold transition-colors font-mono uppercase tracking-wider"
              >
                Получить скидку
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-20 px-4 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-amber-500 text-sm font-mono uppercase tracking-[0.3em]">Прайс-лист</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white font-serif mt-3 mb-4">
              Наши <span className="text-amber-500">услуги</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-4" />
            <p className="text-gray-400 max-w-2xl mx-auto">
              Каждая услуга — это ритуал. Мы используем премиальную косметику и традиционные техники для идеального результата.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title="Мужская стрижка"
              price="650"
              description="Классическая или современная стрижка с мытьём головы и укладкой. Консультация по стилю включена."
              duration="45-60 мин"
              icon="scissors"
              delay={0}
            />
            <ServiceCard
              title="Классическое бритьё"
              price="550"
              description="Горячее полотенце, премиальная пена и опасная бритва. Завершается холодным компрессом."
              duration="30-45 мин"
              icon="sparkles"
              delay={0.1}
            />
            <ServiceCard
              title="Уход за бородой"
              price="450"
              description="Моделирование бороды, подравнивание, уход за кожей. Массаж лица горячим полотенцем."
              duration="30 мин"
              icon="user"
              delay={0.2}
            />
            <ServiceCard
              title="Комбо Deluxe"
              price="1050"
              description="Стрижка + бритьё с максимальным комфортом. Включает маску для лица и напиток."
              duration="75-90 мин"
              icon="gift"
              delay={0.3}
            />
            <ServiceCard
              title="Королевское бритьё"
              price="750"
              description="Расширенный ритуал с двойным проходом, аромatherapy и питательным маслом."
              duration="45 мин"
              icon="flame"
              delay={0.4}
            />
            <ServiceCard
              title="Детская стрижка"
              price="450"
              description="Для юных джентльменов до 12 лет. Терпеливый подход и стильный результат."
              duration="30-40 мин"
              icon="star"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* GALLERY SECTION - Updated with ONLY the 3 user provided photos */}
      <GallerySection />

      {/* BOOKING SECTION */}
      <section id="booking" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-amber-500 text-sm font-mono uppercase tracking-[0.3em]">Онлайн-запись</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white font-serif mt-3 mb-6">
                Забронируйте <span className="text-amber-500">визит</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Выберите удобное время и услугу. Мы свяжемся с вами для подтверждения записи.
                Для срочной записи звоните по телефону.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-600/10 w-12 h-12 rounded-xl flex items-center justify-center border border-amber-600/20">
                    <SafeIcon name="phone" size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Телефон</div>
                    <a href="tel:+420777123456" className="text-white hover:text-amber-500 transition-colors font-mono text-lg">+420 777 123 456</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-amber-600/10 w-12 h-12 rounded-xl flex items-center justify-center border border-amber-600/20">
                    <SafeIcon name="clock" size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Часы работы</div>
                    <div className="text-white font-mono text-lg">Пн-Сб: 10:00 - 20:00</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-neutral-900/80 to-black/80 p-6 sm:p-8 rounded-2xl border border-amber-600/20 backdrop-blur-sm"
            >
              <BookingForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACTS SECTION */}
      <section id="contacts" className="py-20 px-4 bg-gradient-to-b from-transparent via-neutral-900/50 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-amber-500 text-sm font-mono uppercase tracking-[0.3em]">Как нас найти</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white font-serif mt-3 mb-4">
              Контакты
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-neutral-900 to-black p-6 rounded-2xl border border-amber-600/20">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-600/10 w-12 h-12 rounded-xl flex items-center justify-center border border-amber-600/20 flex-shrink-0">
                    <SafeIcon name="map-pin" size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif mb-2">Адрес</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Vinohradská 123<br />
                      120 00 Praha 2, Vinohrady<br />
                      Чехия
                    </p>
                    <p className="text-amber-500/60 text-sm mt-2">5 минут от метра Jiřího z Poděbrad</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-neutral-900 to-black p-6 rounded-2xl border border-amber-600/20">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-600/10 w-12 h-12 rounded-xl flex items-center justify-center border border-amber-600/20 flex-shrink-0">
                    <SafeIcon name="clock" size={20} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white font-serif mb-3">Часы работы</h3>
                    <div className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-2 text-gray-400">
                      <span>Понедельник — Пятница</span>
                      <span className="text-white text-right">10:00 — 20:00</span>
                      <span>Суббота</span>
                      <span className="text-white text-right">10:00 — 18:00</span>
                      <span>Воскресенье</span>
                      <span className="text-red-400 text-right">Выходной</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-neutral-900 to-black p-6 rounded-2xl border border-amber-600/20">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-600/10 w-12 h-12 rounded-xl flex items-center justify-center border border-amber-600/20 flex-shrink-0">
                    <SafeIcon name="phone" size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif mb-2">Связаться</h3>
                    <div className="space-y-2">
                      <a href="tel:+420777123456" className="block text-gray-400 hover:text-amber-500 transition-colors">
                        +420 777 123 456
                      </a>
                      <a href="mailto:hello@bazabarbershop.cz" className="block text-gray-400 hover:text-amber-500 transition-colors">
                        hello@bazabarbershop.cz
                      </a>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <a href="#" className="bg-amber-600/10 w-10 h-10 rounded-lg flex items-center justify-center border border-amber-600/20 hover:bg-amber-600/20 transition-colors">
                        <SafeIcon name="instagram" size={18} className="text-amber-500" />
                      </a>
                      <a href="#" className="bg-amber-600/10 w-10 h-10 rounded-lg flex items-center justify-center border border-amber-600/20 hover:bg-amber-600/20 transition-colors">
                        <SafeIcon name="facebook" size={18} className="text-amber-500" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] lg:h-auto min-h-[400px]">
              <CleanMap coordinates={[14.4519, 50.0785]} zoom={15} />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-amber-600/10 py-12 px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 w-10 h-10 rounded-lg flex items-center justify-center">
                <SafeIcon name="scissors" size={20} className="text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-white font-serif">BAZA</span>
                <span className="block text-[8px] text-amber-500 uppercase tracking-[0.3em] font-mono">Barbershop</span>
              </div>
            </div>

            <div className="text-gray-500 text-sm text-center md:text-left font-mono">
              © 2024 BAZA Barbershop. Все права защищены.
            </div>

            <button
              onClick={() => scrollToSection('booking')}
              className="bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 px-6 py-3 rounded-xl font-mono uppercase tracking-wider text-sm transition-colors border border-amber-600/30"
            >
              Записаться
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App