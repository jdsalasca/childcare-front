import Lottie from 'lottie-react';
import animationData from '../../assets/lottie/welcome_woman.json';
const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <Lottie animationData={animationData} width={20} height={10}  className='c-lottie-animation welcome' />

    </div>
  );
};

export default HomePage;