// Broadcast chat with polished landing / invite + QR modal
(() => {
  const $ = (id) => document.getElementById(id);
  const btnCreate = $('btnCreate');
  const btnCopy = $('btnCopy');
  const btnShare = $('btnShare');
  const btnQR = $('btnQR');
  const inviteWrap = $('inviteWrap');
  const invite = $('invite');
  const btnCopy2 = $('btnCopy2');
  const chatCard = $('chatCard');
  const roomName = $('roomName');
  const statusEl = $('status');
  const setup = $('setup');
  const usernameEl = $('username');
  const messagesEl = $('messages');
  const composer = $('composer');
  const textEl = $('text');

  // QR modal elements
  const qrModal = $('qrModal');
  const qrCanvas = $('qrCanvas');
  const qrLink = $('qrLink');
  const qrCopy = $('qrCopy');
  const qrClose = $('qrClose');

  // Supabase config baked in
  const CFG = window.CHAT_CONFIG || {};
  let supabaseClient = null;
  let channel = null;

  const clientId = crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);
  const params = new URLSearchParams(location.search);
  let room = params.get('room') || '';

  // Initialize Supabase
  // @ts-ignore global
  supabaseClient = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);

  // If there's already a room in the URL, prep UI
  if (room) {
    setInviteLink(room);
    enableInviteButtons(true);
    showChat(room);
  }

  btnCreate.onclick = () => {
    room = crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);
    setInviteLink(room);
    pushRoomToUrl(room);
    enableInviteButtons(true);
    showChat(room);
  };

  btnCopy.onclick = copyInvite;
  btnCopy2.onclick = copyInvite;
  btnShare.onclick = async () => {
    if (!room) return;
    const url = currentInvite(room);
    if (navigator.share) {
      try { await navigator.share({ title: 'Private Chat', url }); }
      catch(e) {}
    } else {
      await copyText(url);
      flash('Invite link copied');
    }
  };
  btnQR.onclick = () => openQR();

  setup.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!room) return;
    await connect(room);
  });

  composer.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = textEl.value.trim();
    if (!content || !channel) return;
    const msg = packMessage(content);
    renderMessage(msg, true);
    textEl.value = '';
    await channel.send({ type: 'broadcast', event: 'msg', payload: msg });
  });

  function showChat(r) {
    roomName.textContent = r;
    chatCard.classList.remove('hidden');
    inviteWrap.classList.remove('hidden');
  }

  async function connect(r) {
    const username = (usernameEl.value || '').trim() || `user${Math.floor(Math.random()*1000)}`;
    setStatus('connecting…');
    channel = supabaseClient.channel('broadcast:'+r, { config: { broadcast: { self: true } } });
    channel.on('broadcast', { event: 'msg' }, (payload) => {
      const msg = payload.payload;
      if (!msg || msg.clientId === clientId) return; // ignore own
      renderMessage(msg, false);
    });
    await channel.subscribe((s) => setStatus(s));
    composer.classList.remove('hidden');
    setup.classList.add('hidden');
  }

  function packMessage(content){
    return {
      id: (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)),
      clientId,
      room,
      username: (usernameEl.value || '').trim() || 'user',
      content,
      created_at: new Date().toISOString()
    };
  }

  function renderMessage(msg, isMe){
    const row = document.createElement('div');
    row.className = 'msg' + (isMe ? ' me' : '');
    const avat = document.createElement('div');
    avat.className = 'avatar';
    avat.textContent = (msg.username || '?').slice(0,2).toUpperCase();
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const meta = document.createElement('div');
    meta.className = 'meta';
    const dt = new Date(msg.created_at);
    meta.textContent = `${msg.username} • ${dt.toLocaleTimeString()}`;
    const body = document.createElement('div');
    body.textContent = msg.content;
    bubble.appendChild(meta);
    bubble.appendChild(body);
    if (!row.classList.contains('me')) row.appendChild(avat);
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /* ===== QR helpers ===== */
  function openQR(){
    if (!room) return;
    const url = currentInvite(room);
    qrLink.value = url;
    const opts = { errorCorrectionLevel: 'M', margin: 2, scale: 6, color: { dark: '#000000', light: '#ffffff' } };
    window.QRCode.toCanvas(qrCanvas, url, opts, (err) => {
      if (err) console.error(err);
    });
    qrModal.classList.remove('hidden');
  }
  qrCopy.onclick = async () => { await copyText(qrLink.value); flash('Invite link copied'); };
  qrClose.onclick = () => { qrModal.classList.add('hidden'); };

  function setInviteLink(r){
    const url = currentInvite(r);
    invite.value = url;
  }
  function currentInvite(r){
    const u = new URL(location.href);
    u.searchParams.set('room', r);
    return u.toString();
  }
  function pushRoomToUrl(r){
    const u = new URL(location.href);
    u.searchParams.set('room', r);
    history.replaceState({}, '', u);
  }
  async function copyInvite(){
    if (!room) return;
    await copyText(currentInvite(room));
    flash('Invite link copied');
  }
  async function copyText(t){
    try { await navigator.clipboard.writeText(t); }
    catch(e){
      invite.select();
      document.execCommand('copy');
    }
  }
  function enableInviteButtons(on){
    btnCopy.disabled = !on;
    btnShare.disabled = !on;
    btnQR.disabled = !on;
  }
  function setStatus(s){ statusEl.textContent = s; }
  function flash(msg){
    const prev = statusEl.textContent;
    statusEl.textContent = msg;
    setTimeout(()=>{ statusEl.textContent = prev || 'ready'; }, 1200);
  }
})();