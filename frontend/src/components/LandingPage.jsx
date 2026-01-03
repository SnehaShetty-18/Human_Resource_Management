import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    const toggleMobileMenu = () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    };

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 70,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Add animation when elements come into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });

    // Add scroll effect to navbar
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
          navbar.style.background = '#fff';
          navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hamburger) {
        hamburger.removeEventListener('click', toggleMobileMenu);
      }
      navLinks.forEach(link => {
        link.removeEventListener('click', () => {});
      });
      anchorLinks.forEach(anchor => {
        anchor.removeEventListener('click', function() {});
      });
    };
  }, []);

  const handleRequestAccess = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <h2>Dayflow</h2>
          </div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/login" className="btn-signin">Sign In</Link></li>
            <li><Link to="/signup" className="btn-signup">Sign Up</Link></li>
          </ul>
          <div className="hamburger">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Smart Workforce Management Made Simple</h1>
            <p>Streamline your HR processes with Dayflow - a comprehensive Human Resource Management System that handles attendance, leave, employee management, and more.</p>
            <div className="hero-btns">
              <Link to="/login" className="btn btn-primary">Sign In</Link>
              <a href="#contact" className="btn btn-secondary" onClick={handleRequestAccess}>Request Access</a>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="HR Management Dashboard" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2>Powerful Features</h2>
          <p>Everything you need to manage your workforce efficiently</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Employee Management</h3>
              <p>Centralized employee database with personal information, job details, and performance records.</p>
            </div>
            
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Attendance Tracking</h3>
              <p>Real-time attendance monitoring with automated reporting and absence management.</p>
            </div>
            
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3>Leave Management</h3>
              <p>Easy leave application process with approval workflows and balance tracking.</p>
            </div>
            
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-money-check-alt"></i>
              </div>
              <h3>Salary Management</h3>
              <p>Automated payroll processing with tax calculations and payslip generation.</p>
            </div>
            
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3>Reports & Analytics</h3>
              <p>Comprehensive reports and analytics to make data-driven HR decisions.</p>
            </div>
            
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Notifications</h3>
              <p>Automated reminders and notifications for important HR events and deadlines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Dayflow</h2>
              <p>Dayflow is a comprehensive Human Resource Management System designed to simplify and automate HR processes for businesses of all sizes. Our platform combines cutting-edge technology with user-friendly design to help HR professionals manage their workforce more efficiently.</p>
              <p>With Dayflow, you can reduce administrative burden, improve employee satisfaction, and make data-driven decisions that drive business growth.</p>
              <a href="#features" className="btn btn-primary">Learn More</a>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f7b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1484&q=80" alt="About Dayflow" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Get In Touch</h2>
          <p>Ready to transform your HR processes? Contact us today to learn more about Dayflow.</p>
          
          <div className="contact-container">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>info@dayflow.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Office</h3>
                  <p>123 Business Avenue, Suite 100<br />San Francisco, CA 94107</p>
                </div>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject" />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>Dayflow</h3>
              <p>Human Resource Management System</p>
            </div>
            
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Features</h4>
              <ul>
                <li><a href="#">Employee Management</a></li>
                <li><a href="#">Attendance Tracking</a></li>
                <li><a href="#">Leave Management</a></li>
                <li><a href="#">Salary Management</a></li>
              </ul>
            </div>
            
            <div className="footer-contact">
              <h4>Contact Info</h4>
              <p><i className="fas fa-envelope"></i> info@dayflow.com</p>
              <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2026 Dayflow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;