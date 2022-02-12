import { Telegraf, Scenes } from "telegraf";
import qrcode from "qrcode-terminal";
const format = require("string-kit").format;

/**
 * Console logs the bot username and gives a link to the bot
 * @param bot Bot object
 * @returns {Promise<number>} number of possible bosses from information given
 */
export async function printBotInfo(
  bot: Telegraf<Scenes.WizardContext<Scenes.WizardSessionData>>,
): Promise<void> {
  const botMe = await bot.telegram.getMe();
  console.log(
    format(
      `Bot ^_${botMe.first_name}^ is running with username ^_@${botMe.username}^ \nhttps://t.me/${botMe.username}`,
    ),
  );
  qrcode.generate(`https://t.me/${botMe.username}`, { small: true });
}
