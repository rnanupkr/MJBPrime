document.querySelectorAll('nav a').forEach(a=>{if(location.pathname.endsWith(a.getAttribute('href')))a.classList.add('active');});
fetch('host.cfg').then(r=>r.text()).then(t=>{let m=t.match(/HOST\s*=\s*(.+)/);if(m){document.getElementById('loginLink').href='http://'+m[1].trim()+':3000';}}).catch(()=>{});
