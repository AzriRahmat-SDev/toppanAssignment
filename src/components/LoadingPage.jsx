import React from 'react';

function LoadingPage({error}){


    if(error){
        return(
            <p>There was an error</p>
        )
    }else{
        return (
        <p>Page is loading please wait</p>
        )
    }
    

}

export default LoadingPage;