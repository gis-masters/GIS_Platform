import { env } from '../stores/Env.store';
import { currentUser } from '../stores/CurrentUser.store';

export async function sendTelegramError(error: string) {
  const protocol = window.location.protocol.slice(0, -1);
  if (!env.sendErrorsToTG[protocol]) {
    return;
  }
  const text = `<b>user:</b> ${currentUser.email}
<b>orgId:</b> ${currentUser.orgId}
<b>url:</b> ${window.location.href}
<b>error:</b> ${error}
`;

  const data = new FormData();
  data.append('text', text);
  data.append('chat_id', '-1001382334246');
  data.append('parse_mode', 'html');

  await fetch('https://api.telegram.org/bot1683355693:AAFwnEU6EAHeiNy7zEX_4CH9-VypZ5JFJq4/sendMessage', {
    method: 'POST',
    body: data
  });
}
