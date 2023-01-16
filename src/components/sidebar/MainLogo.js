import React from 'react';
import "./index.css"
import PaidIcon from '@mui/icons-material/Paid';
function MainLogo() {
    return ( 
        <div className='MainLogo-main'>
            <PaidIcon style={{fontSize:"23px"}} />
            <p className='logo-text'>MoneyTracker</p>
        </div>
    );
}

export default MainLogo;