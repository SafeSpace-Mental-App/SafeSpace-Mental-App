import Header from '../../For JSX/For Component/Header.jsx';
import Toggle from '../../For JSX/For Component/Toggle.jsx';
import { useApi } from '../../lib/useApi.js';
import { api } from '../../lib/api.js';
// import { logout } from '../store/auth.js';
import form from './forms.module.css';

export default function MySpace(){
  const notif = useApi('/api/settings/notifications');
  const sec   = useApi('/api/settings/security');

  async function patchNotif(patch){
    const next = { ...notif.data, ...patch };
    notif.mutate(next);
    await api.request('/api/settings/notifications', { method:'PATCH', body: next }).catch(()=> notif.reload());
  }
  async function patchSecurity(patch){
    const next = { ...sec.data, ...patch };
    sec.mutate(next);
    await api.request('/api/settings/security', { method:'PATCH', body: next }).catch(()=> sec.reload());
  }

  return (
    <div className="container" style={{ paddingBottom: 76 }}>
      <Header greeting="My Space" subtitle="Choose what helps you most"/>
      <div className="section" style={{marginBottom:12}}>
        <div className="title">Notifications</div>
        <Toggle label="Daily mood check-ins" description="Gentle reminders to log your mood" checked={!!notif.data?.dailyCheckins} onChange={v=> patchNotif({ dailyCheckins: v })}/>
        <Toggle label="Weekly Insights" description="Summary of your mood patterns" checked={!!notif.data?.weeklyInsights} onChange={v=> patchNotif({ weeklyInsights: v })}/>
        <Toggle label="Community Replies" description="When someone responds to your post" checked={!!notif.data?.communityReplies} onChange={v=> patchNotif({ communityReplies: v })}/>
        <Toggle label="Crisis Resources" description="Important safety information" checked={!!notif.data?.crisisResources} onChange={v=> patchNotif({ crisisResources: v })}/>
      </div>

      <div className="section" style={{marginBottom:12}}>
        <div className="title">Profile Security & Privacy</div>
        <button className={form.btnGhost} onClick={()=> alert('Open change-password flow')}>Change Password</button>
        <div className="hr"></div>
        <Toggle label="Enable Journal Lock (PIN/Biometric)" checked={!!sec.data?.lockEnabled} onChange={v=> patchSecurity({ lockEnabled: v })}/>
      </div>

      <div className="section" style={{borderColor:'#ffd9d9'}}>
        <button className={form.btnGhost} style={{color:'var(--danger)', borderColor:'#ffd1d1'}} onClick={logout}>Sign Out →</button>
      </div>
    </div>
  );
}
