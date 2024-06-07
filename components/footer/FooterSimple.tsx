"use client";
import { useRouter } from 'next/navigation';

const FooterSimple = () => {

    const router = useRouter();
    const navigateToPage = (path, newTab = true) => {
        if (newTab) {
          window.open(path, '_blank');
        } else {
          router.push(path);
        }
      };
  
    return (
      <div className="mt-1">
        <section className="social-media">
          <div>
            <a href="" className="me-4 link-secondary">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="" className="me-4 link-secondary">
              <i className="fab fa-twitter"></i>
            </a>
  
            <a href="" className="me-4 link-secondary">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="" className="me-4 link-secondary">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </section>
  
        <section className="social-media pt-2">
          <span className='cursor-pointer'  style={{color: '#007BFF' }} onClick={() => navigateToPage('privacy-policy')}>Privacy Policy</span> |{" "}
          <span className='cursor-pointer' style={{color: '#007BFF' }} onClick={() => navigateToPage("/terms-of-service")}>Terms of Use</span> |{" "}
          <span className='cursor-pointer' style={{color: '#007BFF' }} onClick={() => navigateToPage("/cookie-use")}>Cookie Use</span>
        </section>
      </div>
    );
  };
  
  export default FooterSimple;
  