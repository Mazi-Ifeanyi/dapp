import { useContext } from 'react';

import classes from '../styles/components/Layout.module.css';
import Footer from './Footer';
import Header from './Header';
import Header2 from './Header2';
import { useLayoutEffect } from 'react';
import { chain, isNull } from '../utils/Util';
import { AccountContext } from '../App';


const Layout = (props) =>{
    const { children } = props;
    const { account, setAccount } = useContext(AccountContext);


    useLayoutEffect(()=>{
        const address = sessionStorage.getItem('address');
        if(!isNull(address)){
            setAccount({ address: address, isConnected: true });
        }else{
            setAccount({ address: '', isConnected: false });
        }

        if(window.ethereum){
            window.ethereum.on('chainChanged', (chainId)=>{
               if(chainId !== chain.id){
                 sessionStorage.removeItem('address');
                 setAccount({ wallet: '', isConnected: false });
               }
            });

            window.ethereum.on('accountsChanged', (accounts)=>{
                if(!isNull(accounts)){
                    sessionStorage.setItem('address', accounts[0]);
                    setAccount({ address: accounts[0], isConnected: true })
                }else{
                    sessionStorage.removeItem('address');
                    setAccount({ address: '', isConnected: false });
                }
            });
        }
    },[]);


    return(
        <main className={classes.parent}>
            {!account.isConnected? <Header /> : <Header2 />}
            {children}
            <Footer />
        </main>
    )
}

export default Layout;