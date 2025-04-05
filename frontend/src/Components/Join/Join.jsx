import './join.css'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../../Contexts/UserContext';

const Join = () => {
  const [roomId, setRoomId] = useState('');
  const [invalid, setInvalid] = useState(false);
  const context = useContext(UserContext);
  const { user, socket, setSocket, setRoom } = context;
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null || socket === null) {
      navigate('/');
      return;
    }

  }, [])


  const handelJoin = () => {
    socket.emit('join-room', roomId, async (res) => {
      // console.log(res.status);
      if(res.status === 'success'){
        await setRoom(res.room);
        navigate('/lobby');

      }else{
        setRoomId('')
        setInvalid(true);
        document.getElementById('id').classList.add('invalid')
      }
      // console.log(res.room);
    });
  }

  const handleExit = () => {
    socket.disconnect();
    setSocket(null);
    navigate('/');
  }

  const handleChange = (e) => {
    document.getElementById('id').classList.remove('invalid')
    setInvalid(false);
    let st = e.target.value;
    st = st.toUpperCase();
    setRoomId(st);
  }
  return (
    <div className="join">
      <header className='head'>
        <svg className='logo' viewBox="0 0 53 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className='path' d="M0.707031 0.0351562C1.1237 0.139323 1.52083 0.217448 1.89844 0.269531C2.27604 0.321615 2.60807 0.360677 2.89453 0.386719C3.23307 0.425781 3.54557 0.438802 3.83203 0.425781C4.19661 0.425781 4.65234 0.393229 5.19922 0.328125C5.75911 0.263021 6.33203 0.204427 6.91797 0.152344C7.50391 0.0872396 8.0638 0.0481771 8.59766 0.0351562C9.14453 0.00911458 9.58724 0.0416667 9.92578 0.132812C10.2643 0.210938 10.6094 0.334635 10.9609 0.503906C11.3255 0.660156 11.6576 0.861979 11.957 1.10938C12.2565 1.34375 12.5039 1.6237 12.6992 1.94922C12.8945 2.26172 13.0052 2.61979 13.0312 3.02344C13.0182 3.53125 12.901 4.00651 12.6797 4.44922C12.4974 4.82682 12.1914 5.21745 11.7617 5.62109C11.332 6.01172 10.7135 6.3112 9.90625 6.51953C10.3099 6.57161 10.6549 6.66276 10.9414 6.79297C11.2409 6.91016 11.4948 7.05339 11.7031 7.22266C11.9245 7.37891 12.1003 7.55469 12.2305 7.75C12.3737 7.94531 12.4844 8.14062 12.5625 8.33594C12.7578 8.79167 12.849 9.29948 12.8359 9.85938C12.7578 10.5885 12.6081 11.168 12.3867 11.5977C12.1784 12.0273 11.9375 12.3594 11.6641 12.5938C11.3906 12.8281 11.1107 12.9909 10.8242 13.082C10.5378 13.1732 10.2773 13.2448 10.043 13.2969C9.80859 13.349 9.52214 13.375 9.18359 13.375C8.84505 13.375 8.48047 13.3685 8.08984 13.3555C7.71224 13.3294 7.32161 13.3099 6.91797 13.2969C6.51432 13.2708 6.13021 13.2708 5.76562 13.2969C5.46615 13.3229 5.10156 13.349 4.67188 13.375C4.30729 13.401 3.85156 13.4336 3.30469 13.4727C2.75781 13.4987 2.11979 13.5312 1.39062 13.5703C1.53385 13.4661 1.65104 13.349 1.74219 13.2188C1.84635 13.0755 1.93099 12.9518 1.99609 12.8477C2.0612 12.7174 2.11979 12.5938 2.17188 12.4766C2.21094 12.3724 2.24349 12.0859 2.26953 11.6172C2.29557 11.1484 2.3151 10.5885 2.32812 9.9375C2.34115 9.27344 2.34766 8.5638 2.34766 7.80859C2.36068 7.04036 2.35417 6.30469 2.32812 5.60156C2.3151 4.88542 2.28906 4.25391 2.25 3.70703C2.22396 3.14714 2.1849 2.74349 2.13281 2.49609C2.05469 2.22266 1.95052 1.94271 1.82031 1.65625C1.71615 1.40885 1.56641 1.14193 1.37109 0.855469C1.1888 0.56901 0.967448 0.295573 0.707031 0.0351562ZM4.82812 2.02734C4.82812 2.07943 4.83464 2.25521 4.84766 2.55469C4.86068 2.8151 4.8737 3.21875 4.88672 3.76562C4.91276 4.29948 4.94531 5.0612 4.98438 6.05078C5.3099 6.19401 5.62891 6.27214 5.94141 6.28516C6.25391 6.28516 6.53385 6.27214 6.78125 6.24609C7.06771 6.20703 7.34115 6.14193 7.60156 6.05078C7.95312 5.90755 8.22656 5.67318 8.42188 5.34766C8.63021 5.02214 8.76693 4.68359 8.83203 4.33203C8.91016 3.96745 8.92969 3.62891 8.89062 3.31641C8.85156 2.99089 8.76693 2.75651 8.63672 2.61328C8.38932 2.39193 8.08333 2.20964 7.71875 2.06641C7.40625 1.94922 7.00911 1.87109 6.52734 1.83203C6.05859 1.77995 5.49219 1.84505 4.82812 2.02734ZM4.73047 11.2852C5.21224 11.5326 5.63542 11.6953 6 11.7734C6.36458 11.8516 6.67057 11.8906 6.91797 11.8906C7.20443 11.8906 7.45182 11.8516 7.66016 11.7734C7.90755 11.6562 8.14844 11.5 8.38281 11.3047C8.63021 11.0964 8.8125 10.8555 8.92969 10.582C9.0599 10.2956 9.11198 9.98307 9.08594 9.64453C9.0599 9.29297 8.91016 8.90885 8.63672 8.49219C8.38932 8.19271 8.08984 7.95833 7.73828 7.78906C7.42578 7.64583 7.02865 7.55469 6.54688 7.51562C6.07812 7.47656 5.4987 7.58724 4.80859 7.84766L4.73047 11.2852ZM13.9297 5.26953L17.5234 5.30859C17.3151 6.10286 17.1589 6.77995 17.0547 7.33984C16.9635 7.89974 16.9049 8.36849 16.8789 8.74609C16.8268 9.17578 16.8138 9.54036 16.8398 9.83984C16.8789 10.1133 16.944 10.4062 17.0352 10.7188C17.1133 10.9792 17.2305 11.2786 17.3867 11.6172C17.543 11.9557 17.7513 12.2943 18.0117 12.6328C17.8555 12.5807 17.6862 12.5417 17.5039 12.5156C17.3216 12.4896 17.1523 12.4701 16.9961 12.457C16.8138 12.444 16.6315 12.444 16.4492 12.457C16.2669 12.4701 16.0651 12.4896 15.8438 12.5156C15.6615 12.5417 15.4401 12.5742 15.1797 12.6133C14.9193 12.6523 14.6458 12.7044 14.3594 12.7695C14.5547 12.1836 14.7044 11.6758 14.8086 11.2461C14.9258 10.8164 15.0104 10.4583 15.0625 10.1719C15.1146 9.83333 15.1471 9.5599 15.1602 9.35156C15.1602 9.09115 15.1602 8.79818 15.1602 8.47266C15.1602 8.13411 15.1602 7.80859 15.1602 7.49609C15.1602 7.18359 15.1536 6.91016 15.1406 6.67578C15.1276 6.42839 15.1016 6.27214 15.0625 6.20703L14.8672 6.01172C14.7891 5.94661 14.6719 5.85547 14.5156 5.73828C14.3724 5.60807 14.1771 5.45182 13.9297 5.26953ZM15.3164 2.26172C15.5898 2.11849 15.8633 2.07943 16.1367 2.14453C16.4232 2.20964 16.6445 2.33333 16.8008 2.51562C16.957 2.69792 17.0091 2.91276 16.957 3.16016C16.918 3.40755 16.7096 3.64844 16.332 3.88281C15.9544 4.10417 15.6224 4.18229 15.3359 4.11719C15.0495 4.05208 14.8477 3.91536 14.7305 3.70703C14.6133 3.4987 14.5938 3.25781 14.6719 2.98438C14.75 2.69792 14.9648 2.45703 15.3164 2.26172ZM19.3203 11.8516C19.4115 11.4219 19.4766 11.0443 19.5156 10.7188C19.5677 10.3802 19.6068 10.1003 19.6328 9.87891C19.6589 9.61849 19.6719 9.39714 19.6719 9.21484C19.6589 8.99349 19.6458 8.73307 19.6328 8.43359C19.6328 8.12109 19.6198 7.8151 19.5938 7.51562C19.5807 7.20312 19.5612 6.92969 19.5352 6.69531C19.5091 6.44792 19.4766 6.27214 19.4375 6.16797C19.3854 6.0638 19.3138 5.95312 19.2227 5.83594C19.0404 5.61458 18.7734 5.39974 18.4219 5.19141C18.7214 5.1263 18.9753 5.07422 19.1836 5.03516C19.4049 4.98307 19.5872 4.9375 19.7305 4.89844C19.8867 4.84635 20.0234 4.80078 20.1406 4.76172C20.2448 4.72266 20.3685 4.68359 20.5117 4.64453C20.6289 4.61849 20.7721 4.58594 20.9414 4.54688C21.1107 4.50781 21.306 4.46224 21.5273 4.41016L21.4688 6.1875C21.8854 5.69271 22.3086 5.32161 22.7383 5.07422C23.168 4.82682 23.5716 4.65104 23.9492 4.54688C24.3789 4.41667 24.8021 4.35156 25.2188 4.35156C25.7396 4.3776 26.2214 4.46224 26.6641 4.60547C27.1198 4.7487 27.5104 4.91797 27.8359 5.11328C28.1745 5.29557 28.4479 5.49089 28.6562 5.69922C28.8646 5.90755 28.9883 6.08984 29.0273 6.24609C29.1836 6.75391 29.2227 7.22266 29.1445 7.65234C29.0664 8.06901 28.9622 8.47917 28.832 8.88281C28.7148 9.27344 28.6107 9.66406 28.5195 10.0547C28.4414 10.4453 28.474 10.8685 28.6172 11.3242C28.6693 11.4414 28.7214 11.5586 28.7734 11.6758C28.8255 11.7799 28.8906 11.8841 28.9688 11.9883C29.0469 12.0924 29.138 12.1771 29.2422 12.2422C29.099 12.2292 28.9557 12.2227 28.8125 12.2227C28.6693 12.2096 28.5391 12.1966 28.4219 12.1836C28.2786 12.1706 28.1484 12.1576 28.0312 12.1445C27.901 12.1315 27.7253 12.125 27.5039 12.125C27.1263 12.125 26.5404 12.1445 25.7461 12.1836C25.8633 11.9102 25.9544 11.6823 26.0195 11.5C26.0977 11.3047 26.1628 11.1484 26.2148 11.0312C26.2669 10.888 26.306 10.7773 26.332 10.6992C26.4883 10.3216 26.5794 9.89193 26.6055 9.41016C26.6445 8.92839 26.612 8.4401 26.5078 7.94531C26.4688 7.77604 26.4036 7.57422 26.3125 7.33984C26.2214 7.10547 26.0977 6.8776 25.9414 6.65625C25.7982 6.4349 25.6224 6.24609 25.4141 6.08984C25.2188 5.93359 24.9909 5.84245 24.7305 5.81641C24.4701 5.79036 24.1771 5.85547 23.8516 6.01172C23.5391 6.16797 23.2005 6.45443 22.8359 6.87109C22.5625 7.22266 22.3477 7.65234 22.1914 8.16016C22.0482 8.58984 21.9505 9.13021 21.8984 9.78125C21.8464 10.4193 21.9245 11.168 22.1328 12.0273C21.9505 12.0013 21.7812 11.9883 21.625 11.9883C21.4688 11.9753 21.3385 11.9622 21.2344 11.9492C21.1042 11.9362 20.987 11.9232 20.8828 11.9102C20.7656 11.9102 20.6354 11.9036 20.4922 11.8906C20.362 11.8906 20.1992 11.8906 20.0039 11.8906C19.8086 11.8776 19.5807 11.8646 19.3203 11.8516ZM39.6523 5.71875C39.6133 5.45833 39.5807 5.24349 39.5547 5.07422C39.5286 4.89193 39.5026 4.7487 39.4766 4.64453C39.4505 4.51432 39.431 4.41667 39.418 4.35156C39.3919 4.28646 39.3594 4.21484 39.3203 4.13672C39.2943 4.07161 39.2487 3.99349 39.1836 3.90234C39.1315 3.8112 39.0664 3.70703 38.9883 3.58984C39.1576 3.64193 39.3268 3.67448 39.4961 3.6875C39.6784 3.70052 39.8477 3.71354 40.0039 3.72656C40.1732 3.73958 40.349 3.73958 40.5312 3.72656C40.7135 3.72656 40.9219 3.72005 41.1562 3.70703C41.3646 3.69401 41.612 3.6875 41.8984 3.6875C42.1979 3.67448 42.5365 3.65495 42.9141 3.62891C42.6927 3.68099 42.5039 3.77214 42.3477 3.90234C42.2044 4.01953 42.0807 4.14974 41.9766 4.29297C41.8594 4.44922 41.7617 4.61849 41.6836 4.80078C41.6185 4.97005 41.5794 5.29557 41.5664 5.77734C41.5534 6.24609 41.5534 6.80599 41.5664 7.45703C41.5794 8.09505 41.5924 8.78516 41.6055 9.52734C41.6315 10.2695 41.6445 10.9792 41.6445 11.6562C41.6576 12.3333 41.6576 12.9518 41.6445 13.5117C41.6315 14.0586 41.599 14.4622 41.5469 14.7227C41.3646 15.543 41.026 16.207 40.5312 16.7148C40.0365 17.2357 39.3854 17.5156 38.5781 17.5547C37.6016 17.5938 36.8268 17.5026 36.2539 17.2812C35.694 17.0599 35.2578 16.7865 34.9453 16.4609C34.6328 16.1484 34.3984 15.8294 34.2422 15.5039C34.0859 15.1784 33.9232 14.931 33.7539 14.7617C33.5977 14.6185 33.4414 14.4818 33.2852 14.3516C33.1419 14.2474 32.9922 14.1432 32.8359 14.0391C32.6927 13.9349 32.5495 13.8698 32.4062 13.8438C32.7839 13.8568 33.1224 13.8633 33.4219 13.8633C33.7214 13.8633 33.9753 13.8633 34.1836 13.8633C34.418 13.8633 34.6263 13.8568 34.8086 13.8438H35.4336H37.2109C36.9505 13.9219 36.7552 14.0065 36.625 14.0977C36.4948 14.2018 36.4036 14.306 36.3516 14.4102C36.2995 14.5273 36.2734 14.6445 36.2734 14.7617C36.3255 15.0742 36.4948 15.3021 36.7812 15.4453C37.0677 15.5885 37.4583 15.6732 37.9531 15.6992C38.4349 15.7253 38.7669 15.7122 38.9492 15.6602C39.1315 15.6211 39.2747 15.543 39.3789 15.4258C39.5872 15.1133 39.763 14.7096 39.9062 14.2148C40.0104 13.7982 40.082 13.2578 40.1211 12.5938C40.1732 11.9167 40.1146 11.0898 39.9453 10.1133C39.5286 10.6862 39.0469 11.1159 38.5 11.4023C37.9531 11.6888 37.4323 11.8971 36.9375 12.0273C36.3516 12.1706 35.7591 12.2422 35.1602 12.2422C33.5846 12.1771 32.4062 11.8125 31.625 11.1484C30.8438 10.4844 30.4857 9.59245 30.5508 8.47266C30.5898 7.91276 30.7591 7.35286 31.0586 6.79297C31.3711 6.23307 31.7747 5.73177 32.2695 5.28906C32.7773 4.84635 33.3568 4.49479 34.0078 4.23438C34.6589 3.97396 35.3359 3.86328 36.0391 3.90234C36.5729 3.95443 37.0742 4.05208 37.543 4.19531C37.9466 4.32552 38.3438 4.50781 38.7344 4.74219C39.138 4.97656 39.444 5.30208 39.6523 5.71875ZM33.4414 7.67188C33.3633 8.17969 33.3958 8.65495 33.5391 9.09766C33.6953 9.54036 33.9102 9.92448 34.1836 10.25C34.457 10.5625 34.763 10.8099 35.1016 10.9922C35.4401 11.1615 35.7591 11.2396 36.0586 11.2266C36.6836 11.2135 37.224 10.9336 37.6797 10.3867C38.1354 9.82682 38.4089 8.99349 38.5 7.88672C38.5391 7.33984 38.4674 6.87109 38.2852 6.48047C38.1159 6.07682 37.901 5.7513 37.6406 5.50391C37.3802 5.25651 37.1068 5.08073 36.8203 4.97656C36.5339 4.8724 36.306 4.82682 36.1367 4.83984C35.9023 4.86589 35.6419 4.9375 35.3555 5.05469C35.082 5.15885 34.8151 5.32161 34.5547 5.54297C34.2943 5.7513 34.0599 6.03125 33.8516 6.38281C33.6562 6.73438 33.5195 7.16406 33.4414 7.67188ZM48.3242 5.25C48.6628 5.25 49.0143 5.3151 49.3789 5.44531C49.7435 5.5625 50.0951 5.71875 50.4336 5.91406C50.7721 6.09635 51.0781 6.29818 51.3516 6.51953C51.638 6.72786 51.8724 6.92969 52.0547 7.125C52.3802 7.47656 52.6016 7.95182 52.7188 8.55078C52.849 9.13672 52.875 9.74219 52.7969 10.3672C52.7188 10.9792 52.5365 11.5586 52.25 12.1055C51.9635 12.6523 51.5664 13.056 51.0586 13.3164C50.694 13.4987 50.3359 13.6419 49.9844 13.7461C49.6328 13.8503 49.2943 13.9284 48.9688 13.9805C48.6432 14.0326 48.3372 14.0586 48.0508 14.0586C47.7643 14.0586 47.5169 14.0521 47.3086 14.0391C46.918 14.013 46.5078 13.8763 46.0781 13.6289C45.6615 13.3815 45.2643 13.0755 44.8867 12.7109C44.5221 12.3464 44.2096 11.9492 43.9492 11.5195C43.6888 11.0768 43.5326 10.6602 43.4805 10.2695C43.4023 9.73568 43.3893 9.17578 43.4414 8.58984C43.4935 8.00391 43.6823 7.46354 44.0078 6.96875C44.3464 6.47396 44.8542 6.0638 45.5312 5.73828C46.2214 5.41276 47.1523 5.25 48.3242 5.25ZM47.6797 12.8281C47.8229 12.8542 48.0182 12.8216 48.2656 12.7305C48.513 12.6263 48.7539 12.4635 48.9883 12.2422C49.2357 12.0208 49.4505 11.7409 49.6328 11.4023C49.8281 11.0508 49.9453 10.6276 49.9844 10.1328C50.0234 9.65104 50.0234 9.20833 49.9844 8.80469C49.9583 8.40104 49.8997 8.04948 49.8086 7.75C49.7174 7.4375 49.6133 7.18359 49.4961 6.98828C49.3789 6.79297 49.2552 6.65625 49.125 6.57812C48.9036 6.46094 48.6367 6.36979 48.3242 6.30469C48.0117 6.22656 47.7448 6.23958 47.5234 6.34375C47.4193 6.39583 47.2891 6.50651 47.1328 6.67578C46.9766 6.84505 46.8203 7.0599 46.6641 7.32031C46.5078 7.56771 46.3646 7.85417 46.2344 8.17969C46.1172 8.50521 46.0326 8.84375 45.9805 9.19531C45.9284 9.54688 45.9154 9.92448 45.9414 10.3281C45.9805 10.7318 46.0651 11.1159 46.1953 11.4805C46.3255 11.832 46.5078 12.138 46.7422 12.3984C46.9896 12.6458 47.3021 12.7891 47.6797 12.8281Z" fill="white" />
        </svg>
      </header>

      <div className="body">
        <h1>Join</h1>
        <div className="box">
          <p>Enter Room Id:</p>
          <input type="text" name='id' className="roomid" id='id' value={roomId} onChange={handleChange} />
          {invalid && <label htmlFor='id' style={{color:'red'}}>Unable to join room</label>}
        </div>
        <div className="box">
          <button className='btn' onClick={handelJoin} >Join</button>
          <button className='btn' onClick={handleExit} style={{ background: 'red' }}>Exit</button>
        </div>
      </div>

    </div>
  )
}

export default Join