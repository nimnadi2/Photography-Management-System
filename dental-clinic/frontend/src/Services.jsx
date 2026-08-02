import { useState } from 'react';

const servicesData = [
  {
    id: 1,
    icon: '🦷',
    name: 'General Checkup',
    shortDesc: 'Comprehensive dental exams and professional cleaning.',
    longDesc: 'A thorough examination of your teeth, gums, and mouth to catch problems early and keep your smile healthy.',
    included: ['Full mouth X-ray', 'Professional cleaning', 'Oral cancer screening', 'Personalized advice'],
    duration: '30-45 mins',
    price: 'Rs. 2,500',
    badge: 'Most Popular',
    category: 'Preventive'
  },
  {
    id: 2,
    icon: '✨',
    name: 'Teeth Whitening',
    shortDesc: 'Brighten your smile with modern cosmetic treatment.',
    longDesc: 'Safe and effective whitening treatment that removes stains and brightens your smile in a single visit.',
    included: ['Shade consultation', 'In-office whitening', 'Sensitivity treatment', 'Aftercare kit'],
    duration: '45-60 mins',
    price: 'Rs. 8,500',
    badge: 'Cosmetic',
    category: 'Cosmetic'
  },
  {
    id: 3,
    icon: '🔬',
    name: 'Root Canal',
    shortDesc: 'Pain-free root canal treatment to save infected teeth.',
    longDesc: 'Modern, virtually painless root canal therapy to remove infection and save your natural tooth.',
    included: ['Digital X-ray', 'Local anesthesia', 'Canal cleaning & filling', 'Follow-up visit'],
    duration: '60-90 mins',
    price: 'Rs. 12,000',
    badge: 'Painless Procedure',
    category: 'Surgical'
  },
  {
    id: 4,
    icon: '🦷',
    name: 'Dental Implants',
    shortDesc: 'Permanent solutions for missing teeth with implants.',
    longDesc: 'Titanium implants that act as artificial tooth roots, giving you a permanent, natural-looking replacement.',
    included: ['3D scan & planning', 'Implant surgery', 'Crown fitting', 'Post-op care'],
    duration: '2-3 hrs',
    price: 'Rs. 65,000',
    badge: null,
    category: 'Surgical'
  },
  {
    id: 5,
    icon: '😁',
    name: 'Braces & Orthodontics',
    shortDesc: 'Align your teeth properly for optimal health and appearance.',
    longDesc: 'Custom orthodontic treatment plans to straighten teeth and correct bite issues for all ages.',
    included: ['Orthodontic assessment', 'Custom braces fitting', 'Monthly adjustments', 'Retainer'],
    duration: '30 mins (per visit)',
    price: 'Rs. 45,000+',
    badge: null,
    category: 'Cosmetic'
  },
  {
    id: 6,
    icon: '🧸',
    name: 'Pediatric Dentistry',
    shortDesc: 'Gentle and friendly dental care for young children.',
    longDesc: 'A comfortable, kid-friendly environment designed to make dental visits stress-free for children.',
    included: ['Gentle checkup', 'Fluoride treatment', 'Cavity prevention', 'Fun & friendly staff'],
    duration: '20-30 mins',
    price: 'Rs. 2,000',
    badge: 'Kid Friendly',
    category: 'Pediatric'
  }
];

const categories = ['All', 'Preventive', 'Cosmetic', 'Surgical', 'Pediatric'];

export default function Services() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(null);

  const filteredServices = servicesData.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookService = (serviceName) => {
    window.location.href = `/book?service=${encodeURIComponent(serviceName)}`;
  };

  return (
    <div style={{
      padding: '60px 20px',
      maxWidth: '100%',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #e6f2f2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 40px auto', textAlign: 'center' }}>
        <h1 style={{ color: '#0d9488', fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>
          Our Services
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Comprehensive dental care tailored to your needs
        </p>
      </div>

      {/* Search + Filter */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center',
        marginBottom: '40px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto 40px auto'
      }}>
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
            width: '260px', fontSize: '14px', outline: 'none'
          }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: 'none',
                cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                backgroundColor: activeCategory === cat ? '#0d9488' : '#e2e8f0',
                color: activeCategory === cat ? '#fff' : '#334155',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Service Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px',
        maxWidth: '1200px', margin: '0 auto'
      }}>
        {filteredServices.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            style={{
              backgroundColor: '#fff', borderRadius: '16px', padding: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
          >
            {service.badge && (
              <span style={{
                position: 'absolute', top: '16px', right: '16px',
                backgroundColor: '#fef3c7', color: '#b45309',
                fontSize: '11px', fontWeight: '700', padding: '4px 10px',
                borderRadius: '12px'
              }}>
                {service.badge}
              </span>
            )}
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{service.icon}</div>
            <h3 style={{ color: '#0d9488', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              {service.name}
            </h3>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
              {service.shortDesc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              <span>⏱ {service.duration}</span>
              <span style={{ fontWeight: '700', color: '#0d9488' }}>{service.price}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookService(service.name);
              }}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                backgroundColor: '#0d9488', color: '#fff', fontWeight: '600',
                fontSize: '14px', cursor: 'pointer'
              }}
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>
          No services found.
        </p>
      )}

      {/* Modal */}
      {selectedService && (
        <div
          onClick={() => setSelectedService(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff', borderRadius: '16px', padding: '32px',
              maxWidth: '480px', width: '100%', position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedService(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px', border: 'none',
                background: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8'
              }}
            >
              ✕
            </button>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>{selectedService.icon}</div>
            <h2 style={{ color: '#0d9488', fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>
              {selectedService.name}
            </h2>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
              {selectedService.longDesc}
            </p>
            <h4 style={{ fontSize: '14px', color: '#334155', marginBottom: '8px' }}>What's included:</h4>
            <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
              {selectedService.included.map((item, i) => (
                <li key={i} style={{ color: '#475569', fontSize: '13px', marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '20px' }}>
              <span style={{ color: '#64748b' }}>⏱ {selectedService.duration}</span>
              <span style={{ fontWeight: '700', color: '#0d9488' }}>{selectedService.price}</span>
            </div>
            <button
              onClick={() => handleBookService(selectedService.name)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                backgroundColor: '#0d9488', color: '#fff', fontWeight: '600',
                fontSize: '15px', cursor: 'pointer'
              }}
            >
              Book This Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
}