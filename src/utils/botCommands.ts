import { BotCommand } from "typegram";
/**
 * All admin commands here
 * @return {BotCommand[]} List of admin commands
 */
export function getBotCommands(): BotCommand[] {
  const rawBotCommands = [
    {
      command: "intervals",
      description: "Check 🛡 foray intervals",
    },
    {
      command: "stats",
      description: "Get foray stats",
    },
    {
      command: "settimezone",
      description: "Update timezone to display for /intervals",
    },
  ];
  let botCommands: BotCommand[] = [];
  rawBotCommands.forEach((botCommand) => {
    botCommands.push({
      command: botCommand.command.toLowerCase(),
      description: botCommand.description.substring(0, 256),
    });
  });

  return botCommands;
}
