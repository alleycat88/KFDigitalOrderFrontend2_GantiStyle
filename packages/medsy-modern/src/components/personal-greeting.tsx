import { useSession } from "contexts/session/session";

export default function PersonalGreeting (){
    const { sessionState, logout } = useSession();

    return(
        
        sessionState.isLoggedIn ? 
            <div className='personal-greeting'>
                <p>Selamat Datang <span className='text-bold'>{sessionState?.user?.name}</span>, loyalty poin anda adalah <span className='text-bold'>{sessionState?.user?.point}</span> poin. &nbsp;&nbsp;<button onClick={logout} style={{textDecoration: 'underline'}}>Keluar</button></p>
            </div>
            :
            sessionState.isLoggedInAnonymously && sessionState.userAnonymous.nameUserAnonymous ? 
                <div className='personal-greeting'>
                    <p>Selamat Datang <span className='text-bold'>{sessionState?.userAnonymous?.nameUserAnonymous}</span>, selamat berbelanja. &nbsp;&nbsp;<button onClick={logout} style={{textDecoration: 'underline'}}>Keluar</button></p>
                </div>
                :
                null
        
    );
}