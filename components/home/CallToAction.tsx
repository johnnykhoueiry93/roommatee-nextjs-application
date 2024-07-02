import Link from 'next/link';
import '../../styles/CallToAction.css';

const CallToAction = () => {
  return (
    <div className='pt-5 mb-5' style={{ height: "300px", backgroundColor: "#d9eada" }}>
      <div style={{ width: "50%", margin: "auto", textAlign: "center" }}>
        <h2>#1 Rommate Finder</h2>
        <h3 className='pt-3'>Discover Your Perfect Roommate Today!</h3>
        <div className='pt-3'>
          <Link href="/signup" passHref>
            <button className="cta-button">Free Sign Up!</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
