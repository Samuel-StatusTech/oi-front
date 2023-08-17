import { useState } from 'react';

function ContextValues() {
    const[expireAt, setExpireAt] = useState({show: true, date: ''});
    return {
        expireAt, setExpireAt
    }
}

export default ContextValues