import { User, Infinity as InfinityIcon } from 'lucide-react';
import './index.css';


const Body = () => {
  return (
    <>
      <div className='body-container'>
        <div className='chatbot-message-container'>
          <div className='bot-logo'>
            <InfinityIcon size={33} color='grey' />
          </div>
          <p className='bot-message' >hello, how can i help you?</p>
        </div>
        <div className='client-message-container'>
          <p className='client-message' >My HCG level is 8.5 is it normal?</p>
          <div className='client-logo'>
            <User size={27} color='white' />
          </div>
        </div>
        <div className='chatbot-message-container'>
          <div className='bot-logo'>
            <InfinityIcon size={33} color='grey' />
          </div>
          <p className='bot-message' >
          In IVF, HCG (human chorionic gonadotropin) levels are used to determine pregnancy viability after embryo transfer. An HCG level of 8.5 mIU/mL is quite low</p>
        </div>
      </div>
    </>
  );
};

export default Body;
