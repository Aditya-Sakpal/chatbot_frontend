import { SendHorizontal } from 'lucide-react';

import './index.css'

const page = () => {
  return (
    <>
      <div className='footer-container' >
        <div className="input-field-div">
          <input type="text" placeholder='Type your query...' />
        </div>
        <div className="send-button-div">
          <div className="send-button-inner-div">
            <SendHorizontal className='send-icon' size={25} />
          </div>
        </div>
      </div>
    </>
  )
}

export default page
