import { currentUser } from '../stores/CurrentUser.store';
import { environment } from './environment';
import { escapeHtml } from './util/escapeHtml';
import { isRecordStringUnknown } from './util/typeGuards/isRecordStringUnknown';

export async function sendTelegramError(error: string): Promise<void> {
  const protocol = window.location.protocol.slice(0, -1);
  if (!isRecordStringUnknown(environment.sendErrorsToTG) || !environment.sendErrorsToTG[protocol]) {
    return;
  }
  const text = `<b>user:</b> ${currentUser.email}
<b>orgId:</b> ${currentUser.orgId}
<b>url:</b> ${window.location.href}
<b>error:</b> ${escapeHtml(error)}
`;

  const data = new FormData();
  data.append('text', text.slice(0, 4096));
  data.append('chat_id', '-1001382334246');
  data.append('parse_mode', 'html');

  await fetch('https://api.telegram.org/bot1683355693:AAFwnEU6EAHeiNy7zEX_4CH9-VypZ5JFJq4/sendMessage', {
    method: 'POST',
    body: data
  });
}
