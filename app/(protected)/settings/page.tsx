import { auth, signOut } from '@/auth'
import { json } from 'stream/consumers';
const SettingsPage = async () => {
    const session = await auth();
    
    return (
        <div>
            {JSON.stringify(session)}
            <form action={async () => {
                "use server"
                await signOut();
            }}>
                <button type='submit'>
                    Sign Out
                </button>
            </form>
            Settings
        </div>
    )
}

export default SettingsPage
